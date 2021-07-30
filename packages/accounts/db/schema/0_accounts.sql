SET ROLE accounts;

CREATE TABLE accounts (
  account_id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_identity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,

  PRIMARY KEY (account_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON accounts TO "accounts-worker";

CREATE TABLE memberships (
  account_id uuid NOT NULL REFERENCES accounts,
  identity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (account_id, identity_id),
  CONSTRAINT memberships_last_active_at_check CHECK (last_active_at >= created_at)
);

CREATE INDEX memberships_identity_id_idx ON memberships (identity_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON memberships TO "accounts-worker";

ALTER TABLE accounts
  ADD CONSTRAINT accounts_owner_identity_id_fkey
    FOREIGN KEY (account_id, owner_identity_id)
    REFERENCES memberships (account_id, identity_id)
    DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE invitations (
  account_id uuid NOT NULL REFERENCES accounts,
  invited_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL,

  PRIMARY KEY (account_id, email),

  CONSTRAINT invitations_email_idx
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

CREATE INDEX invitations_email_idx ON invitations (email);

GRANT SELECT, INSERT, UPDATE, DELETE on invitations TO "accounts-worker";
