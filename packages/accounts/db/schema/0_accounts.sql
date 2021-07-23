SET ROLE accounts;

CREATE TABLE accounts (
  account_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_identity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (account_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON accounts TO "accounts-worker";

CREATE TABLE memberships (
  identity_id uuid NOT NULL,
  account_id uuid NOT NULL REFERENCES accounts,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (identity_id, account_id),
  CONSTRAINT memberships_last_active_at_check CHECK (last_active_at >= created_at)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON memberships TO "accounts-worker";

ALTER TABLE accounts
  ADD CONSTRAINT accounts_owner_identity_id_fkey
    FOREIGN KEY (owner_identity_id, account_id)
    REFERENCES memberships (identity_id, account_id)
    DEFERRABLE INITIALLY DEFERRED;
