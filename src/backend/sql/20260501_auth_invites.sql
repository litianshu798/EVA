-- Account/password login and invite-code migration for existing databases.

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_code text NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by text NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_at timestamp with time zone NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_uuid_unique ON users (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_invite_code_unique ON users (invite_code) WHERE invite_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_invited_by ON users (invited_by);
