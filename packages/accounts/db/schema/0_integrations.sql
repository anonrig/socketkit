SET ROLE accounts;

CREATE TABLE integrations (
  identity_id uuid NOT NULL,
  account_id uuid NOT NULL DEFAULT gen_random_uuid(),

  PRIMARY KEY (identity_id)
);

GRANT SELECT, INSERT, UPDATE ON integrations TO "accounts-worker";
