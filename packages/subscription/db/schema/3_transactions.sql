SET ROLE subscription;

DROP TYPE IF EXISTS transaction_type;
CREATE TYPE transaction_type AS ENUM ('trial', 'conversion', 'renewal', 'refund');

CREATE TABLE transactions (
  transaction_type transaction_type NOT NULL,
  event_date date NOT NULL,
  subscription_started_at date NOT NULL,
  account_id uuid NOT NULL,
  subscriber_purchase numeric NOT NULL DEFAULT '0.00',
  developer_proceeds numeric NOT NULL DEFAULT '0.00',
  base_subscriber_purchase numeric NOT NULL DEFAULT '0.00',
  base_developer_proceeds numeric NOT NULL DEFAULT '0.00',
  subscription_package_id text NOT NULL,
  subscriber_id text NOT NULL,
  application_id text NOT NULL,
  subscriber_currency_id text NOT NULL,
  developer_currency_id text NOT NULL,
  base_currency_id text NOT NULL,

  CONSTRAINT transactions_to_subscriptions_fkey
    FOREIGN KEY (account_id, subscription_package_id, subscriber_id, subscription_started_at)
      REFERENCES subscriptions,

  CONSTRAINT transactions_subscription_started_at_check
    CHECK (subscription_started_at <= event_date)
);

CREATE INDEX ON transactions (account_id, event_date);

GRANT SELECT, INSERT, UPDATE, DELETE ON transactions TO "subscription-worker";

CREATE OR REPLACE FUNCTION transactions_update_subscription()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $$
  BEGIN
    UPDATE subscriptions s
    SET
      subscription_expired_at = CASE NEW.transaction_type
        WHEN 'trial' THEN (NEW.event_date + s.free_trial_duration)::date
        WHEN 'conversion' THEN (NEW.event_date + p.subscription_duration)::date
        WHEN 'renewal' THEN (NEW.event_date + p.subscription_duration)::date
        WHEN 'refund' THEN NEW.event_date
      END,
      total_base_subscriber_purchase = s.total_base_subscriber_purchase + NEW.base_subscriber_purchase,
      total_base_developer_proceeds = s.total_base_developer_proceeds + NEW.base_developer_proceeds
    FROM subscription_packages p
    WHERE
      s.account_id = NEW.account_id AND
      s.subscription_package_id = NEW.subscription_package_id AND
      s.subscriber_id = NEW.subscriber_id AND
      s.subscription_started_at = NEW.subscription_started_at AND
      p.account_id = NEW.account_id AND
      p.subscription_package_id = NEW.subscription_package_id;

    RETURN NEW;
  END;
$$;

CREATE TRIGGER transactions_after_insert
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION transactions_update_subscription();

CREATE OR REPLACE FUNCTION transactions_set_subscriber_interaction_date()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $$
  BEGIN
    UPDATE subscribers
    SET
      first_interaction = LEAST(first_interaction, NEW.event_date),
      total_base_subscriber_purchase = total_base_subscriber_purchase + NEW.base_subscriber_purchase,
      total_base_developer_proceeds = total_base_developer_proceeds + NEW.base_developer_proceeds
    WHERE
      account_id = NEW.account_id AND
      subscriber_id = NEW.subscriber_id;

    RETURN NEW;
  END;
$$;

CREATE TRIGGER transactions_after_insert_update_subscriber
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION transactions_set_subscriber_interaction_date();
