SET ROLE payment;

CREATE TYPE constant_payment_intent_status AS ENUM ('succeeded', 'requires_payment_method', 'requires_action');
CREATE TYPE constant_payment_status AS ENUM ('paid', 'open');
CREATE TYPE constant_subscription_state AS ENUM ('active', 'incomplete', 'inactive');
CREATE TYPE constant_environment AS ENUM ('production', 'staging');

CREATE TABLE integrations (
  account_id uuid NOT NULL,
  stripe_id text NOT NULL,
  subscription_id text,

  payment_intent_status constant_payment_intent_status,
  payment_status constant_payment_status,
  subscription_state constant_subscription_state NOT NULL DEFAULT 'inactive',

  started_at timestamptz,
  expired_at timestamptz,

  environment constant_environment NOT NULL DEFAULT 'staging',

  PRIMARY KEY (account_id),

  CONSTRAINT integrations_subscription_state_check CHECK (
    CASE subscription_state
      WHEN 'active' THEN
        payment_status = 'paid'
          AND payment_intent_status = 'succeeded'
          AND subscription_id IS NOT NULL
          AND started_at is NOT NULL
          AND expired_at is NOT NULL
      WHEN 'incomplete' THEN
        payment_status = 'open'
          AND payment_intent_status IN ('requires_payment_method', 'requires_action')
          AND subscription_id IS NOT NULL
          AND started_at is NULL
          AND expired_at is NULL
      WHEN 'inactive' THEN
        payment_status IS NULL
          AND payment_intent_status IS NULL
          AND subscription_id IS NULL
          AND started_at is NULL
          AND expired_at is NULL
    END
  )
);


GRANT SELECT, INSERT, UPDATE, DELETE ON integrations TO "payment-worker";
