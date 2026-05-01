import { User } from "../type/type";
import {
  getByEmail,
  getByInviteCode,
  getByUuid,
  getByUuidAndEmail,
  insertUser,
  listInvitedUsers,
  updateInviteCode,
  updateUserPasswordAuth,
} from "../models/user";
import { createCreditUsage, getCreditUsageByUserId } from "./credit_usage";
import { genUniSeq, getIsoTimestr } from "../utils";
import { generateInviteCode } from "../utils/invite";
import { hashPassword, verifyPassword } from "../utils/password";

export class UserAuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function toPublicUser(user: User): User {
  const { password_hash, ...publicUser } = user;

  return publicUser;
}

export async function saveUser(user: User) {
  try {
    const existUser = await getByEmail(user.email);
    if (!existUser) {
      const savedUser = await insertUser({
        ...user,
        email: normalizeEmail(user.email),
        invite_code: user.invite_code || (await createUniqueInviteCode()),
      });
      Object.assign(user, savedUser);
    } else {
      user.id = existUser.id;
      user.uuid = existUser.uuid;
      user.created_at = existUser.created_at;
      user.invite_code =
        existUser.invite_code || (await ensureUserInviteCode(existUser.uuid));
    }
    await ensureInitialCreditUsage(user.uuid);
  } catch (e) {
    console.log("save user failed: ", e);
  }
}

export async function registerPasswordUser(params: {
  email: string;
  password: string;
  nickname?: string;
  inviteCode?: string;
}) {
  const email = normalizeEmail(params.email);
  const requestedNickname = params.nickname?.trim();
  const nickname = requestedNickname || email.split("@")[0];
  const inviteCode = params.inviteCode?.trim().toUpperCase();
  const existingUser = await getByEmail(email);
  const password_hash = hashPassword(params.password);
  const inviter = inviteCode ? await getByInviteCode(inviteCode) : undefined;

  if (inviteCode && !inviter) {
    throw new UserAuthError("INVALID_INVITE_CODE", "Invalid invite code", 400);
  }

  if (existingUser?.password_hash) {
    throw new UserAuthError("EMAIL_EXISTS", "Email already registered", 409);
  }

  if (existingUser && inviter?.uuid === existingUser.uuid) {
    throw new UserAuthError(
      "SELF_INVITE_NOT_ALLOWED",
      "Cannot use your own invite code",
      400
    );
  }

  let user: User | undefined;
  if (existingUser) {
    user = await updateUserPasswordAuth(existingUser.uuid, {
      password_hash,
      nickname: requestedNickname,
      invited_by: inviter?.uuid,
      invited_at: inviter ? getIsoTimestr() : undefined,
    });
  } else {
    user = await insertUser({
      uuid: genUniSeq(),
      email,
      nickname,
      avatar_url: "",
      signin_type: "credentials",
      signin_provider: "credentials",
      signin_openid: email,
      created_at: getIsoTimestr(),
      signin_ip: "",
      password_hash,
      invite_code: await createUniqueInviteCode(),
      invited_by: inviter?.uuid,
      invited_at: inviter ? getIsoTimestr() : undefined,
    });
  }

  if (!user) {
    throw new UserAuthError("REGISTER_FAILED", "Register failed", 500);
  }

  await ensureUserInviteCode(user.uuid);
  await ensureInitialCreditUsage(user.uuid);

  return toPublicUser(user);
}

export async function authenticatePasswordUser(
  email: string,
  password: string
) {
  const user = await getByEmail(normalizeEmail(email));
  if (!user || !verifyPassword(password, user.password_hash)) {
    return undefined;
  }

  await ensureUserInviteCode(user.uuid);
  await ensureInitialCreditUsage(user.uuid);

  return toPublicUser(user);
}

export async function ensureUserInviteCode(userUuid: string) {
  const user = await getByUuid(userUuid);
  if (!user) {
    throw new UserAuthError("USER_NOT_FOUND", "User not found", 404);
  }

  if (user.invite_code) {
    return user.invite_code;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const inviteCode = await createUniqueInviteCode();
      const updatedUser = await updateInviteCode(userUuid, inviteCode);
      if (updatedUser?.invite_code) {
        return updatedUser.invite_code;
      }
    } catch (error) {
      if (attempt === 4) throw error;
    }
  }

  throw new UserAuthError(
    "INVITE_CODE_FAILED",
    "Could not generate invite code",
    500
  );
}

export async function getInvitedUsersByUserId(userUuid: string) {
  const invitedUsers = await listInvitedUsers(userUuid);

  return invitedUsers.map(toPublicUser);
}

export async function getUserByUuidAndEmail(uuid: string, email: string) {
  return await getByUuidAndEmail(uuid, email);
}

async function createUniqueInviteCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const inviteCode = generateInviteCode();
    const existingUser = await getByInviteCode(inviteCode);

    if (!existingUser) {
      return inviteCode;
    }
  }

  throw new UserAuthError(
    "INVITE_CODE_COLLISION",
    "Could not generate unique invite code",
    500
  );
}

async function ensureInitialCreditUsage(userId: string) {
  const creditUsage = await getCreditUsageByUserId(userId);
  if (creditUsage) return;

  await createCreditUsage({
    user_id: userId,
    user_subscriptions_id: -1,
    is_subscription_active: false,
    used_count: 0,
    period_remain_count: 0,
    period_start: new Date(),
    period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    created_at: new Date(),
  });
}
