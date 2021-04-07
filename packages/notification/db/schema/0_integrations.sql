SET ROLE notification;

CREATE TABLE integrations (
  account_id uuid NOT NULL,
  provider_id text NOT NULL,
  requirement jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_error_message text,
  is_active boolean NOT NULL DEFAULT true,
  failed_requests int NOT NULL default 0,

  PRIMARY KEY (account_id, provider_id)
);


GRANT SELECT, INSERT, UPDATE, DELETE ON integrations TO "notification-worker";
