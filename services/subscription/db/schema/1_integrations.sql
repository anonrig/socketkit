SET ROLE subscription;

CREATE TYPE integration_state AS
  ENUM ('active', 'error', 'suspended', 'to_be_deleted');

CREATE TABLE integrations (
  state integration_state NOT NULL DEFAULT 'active',
  failed_fetches int NOT NULL DEFAULT 0,
  last_fetch date NOT NULL,
  account_id uuid NOT NULL,
  provider_id text NOT NULL,
  access_token text NOT NULL,
  vendor_ids text[] NOT NULL,
  last_error_message text,

  PRIMARY KEY (account_id, provider_id),

  CONSTRAINT integrations_failed_fetches_check
    CHECK (CASE state
      WHEN 'active' THEN failed_fetches = 0
      WHEN 'error' THEN failed_fetches > 0
      ELSE failed_fetches >= 0
    END),
  CONSTRAINT integrations_last_error_message_check
    CHECK (state != 'error' OR last_error_message IS NOT NULL),
  CONSTRAINT integrations_vendor_ids_check
    CHECK (
      array_length(vendor_ids, 1) > 0 AND
      array_length(vendor_ids, 2) IS NULL
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON integrations TO "subscription-worker";
