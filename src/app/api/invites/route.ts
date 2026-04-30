import { authOptions } from "@/backend/auth/options";
import {
  ensureUserInviteCode,
  getInvitedUsersByUserId,
} from "@/backend/service/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.uuid) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Please login first" },
      { status: 401 }
    );
  }

  const inviteCode = await ensureUserInviteCode(user.uuid);
  const invitedUsers = await getInvitedUsersByUserId(user.uuid);

  return NextResponse.json({
    invite_code: inviteCode,
    invited_users: invitedUsers.map((invitedUser) => ({
      uuid: invitedUser.uuid,
      email: invitedUser.email,
      nickname: invitedUser.nickname,
      avatar_url: invitedUser.avatar_url,
      created_at: invitedUser.created_at,
      invited_at: invitedUser.invited_at,
    })),
  });
}
