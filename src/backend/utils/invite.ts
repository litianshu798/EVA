import { randomBytes } from "node:crypto";

const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INVITE_CODE_LENGTH = 8;

export function generateInviteCode(): string {
  const bytes = randomBytes(INVITE_CODE_LENGTH);

  return Array.from(bytes)
    .map((byte) => INVITE_ALPHABET[byte % INVITE_ALPHABET.length])
    .join("");
}
