import { getDb } from "../config/db";
import { User } from "../type/type";
import { QueryResultRow } from "pg";

export async function insertUser(user: User): Promise<User> {
  const db = await getDb();
  const res = await db.query(
    `INSERT INTO users 
          (uuid, email, created_at, nickname, avatar_url, locale, signin_type, signin_ip, signin_provider, signin_openid, password_hash, invite_code, invited_by, invited_at, update_time)
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *
      `,
    [
      user.uuid,
      user.email,
      user.created_at || new Date(),
      user.nickname,
      user.avatar_url,
      user.locale || "",
      user.signin_type || "",
      user.signin_ip || "",
      user.signin_provider || "",
      user.signin_openid || "",
      user.password_hash || null,
      user.invite_code || null,
      user.invited_by || null,
      user.invited_at || null,
      new Date(),
    ]
  );
  return formatUser(res.rows[0]);
}

export async function getByEmail(email: string): Promise<User | undefined> {
  const db = getDb();
  const res = await db.query(
    `SELECT * FROM users WHERE lower(email) = lower($1) LIMIT 1`,
    [email]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;

  return formatUser(rows[0]);
}

export async function getByUuid(uuid: string): Promise<User | undefined> {
  const db = getDb();
  const res = await db.query(`SELECT * FROM users WHERE uuid = $1 LIMIT 1`, [
    uuid,
  ]);

  if (res.rowCount === 0) {
    return undefined;
  }

  return formatUser(res.rows[0]);
}

export async function getByUuidAndEmail(uuid: string, email: string) {
  const db = getDb();
  const res = await db.query(
    `SELECT * FROM users WHERE uuid = $1 AND email = $2 LIMIT 1`,
    [uuid, email]
  );
  return formatUser(res.rows[0]);
}

export async function getByInviteCode(
  inviteCode: string
): Promise<User | undefined> {
  const db = getDb();
  const normalizedCode = inviteCode.trim().toUpperCase();
  const res = await db.query(
    `SELECT * FROM users WHERE upper(invite_code) = $1 LIMIT 1`,
    [normalizedCode]
  );

  if (res.rowCount === 0) {
    return undefined;
  }

  return formatUser(res.rows[0]);
}

export async function updateUserPasswordAuth(
  uuid: string,
  params: {
    password_hash: string;
    nickname?: string;
    invited_by?: string;
    invited_at?: string;
  }
): Promise<User | undefined> {
  const db = getDb();
  const res = await db.query(
    `UPDATE users
     SET password_hash = $1,
         nickname = COALESCE(NULLIF($2, ''), nickname),
         signin_type = 'credentials',
         signin_provider = 'credentials',
         signin_openid = email,
         invited_by = COALESCE(invited_by, $3),
         invited_at = COALESCE(invited_at, $4),
         update_time = $5
     WHERE uuid = $6
     RETURNING *`,
    [
      params.password_hash,
      params.nickname || "",
      params.invited_by || null,
      params.invited_at || null,
      new Date(),
      uuid,
    ]
  );

  if (res.rowCount === 0) {
    return undefined;
  }

  return formatUser(res.rows[0]);
}

export async function updateInviteCode(
  uuid: string,
  inviteCode: string
): Promise<User | undefined> {
  const db = getDb();
  const res = await db.query(
    `UPDATE users SET invite_code = $1, update_time = $2 WHERE uuid = $3 RETURNING *`,
    [inviteCode, new Date(), uuid]
  );

  if (res.rowCount === 0) {
    return undefined;
  }

  return formatUser(res.rows[0]);
}

export async function listInvitedUsers(inviterUuid: string): Promise<User[]> {
  const db = getDb();
  const res = await db.query(
    `SELECT *
     FROM users
     WHERE invited_by = $1
     ORDER BY COALESCE(invited_at, created_at) DESC`,
    [inviterUuid]
  );

  return res.rows.map(formatUser);
}

export function formatUser(row: QueryResultRow): User {
  const user: User = {
    id: row.id,
    uuid: row.uuid,
    email: row.email,
    created_at: row.created_at,
    nickname: row.nickname,
    avatar_url: row.avatar_url,
    locale: row.locale,
    signin_type: row.signin_type,
    signin_ip: row.signin_ip,
    signin_provider: row.signin_provider,
    signin_openid: row.signin_openid,
    password_hash: row.password_hash,
    invite_code: row.invite_code,
    invited_by: row.invited_by,
    invited_at: row.invited_at,
    update_time: row.update_time,
  };

  return user;
}
