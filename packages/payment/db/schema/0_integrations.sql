SET ROLE payment;

CREATE TYPE subscription_state AS ENUM (
  'new',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'trialing',
  'canceled',
  'active'
);
CREATE TYPE constant_environment AS ENUM ('production', 'staging');

CREATE TABLE integrations (
  account_id uuid NOT NULL,
  stripe_id text,
  subscription_id text,

  state subscription_state NOT NULL DEFAULT 'new',

  started_at timestamptz,
  expired_at timestamptz,
  updated_stripe_at timestamptz NOT NULL,
  environment constant_environment NOT NULL DEFAULT 'staging',

  PRIMARY KEY (account_id, environment),

  CONSTRAINT integrations_duration_validity_check CHECK (started_at <= expired_at),
  CONSTRAINT integrations_state_check CHECK (
    CASE state
      WHEN 'new' THEN
        stripe_id IS NULL AND
        subscription_id IS NULL AND
        started_at IS NULL AND
        expired_at IS NULL
      ELSE
        stripe_id IS NOT NULL AND
        subscription_id IS NOT NULL AND
        started_at IS NOT NULL AND
        expired_at IS NOT NULL
    END
  )
);


GRANT SELECT, INSERT, UPDATE, DELETE ON integrations TO "payment-worker";
