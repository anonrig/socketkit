SET ROLE subscription;

CREATE TABLE subscription_packages (
  subscription_duration interval NOT NULL,
  account_id uuid NOT NULL,
  subscription_package_id text NOT NULL,
  subscription_group_id text NOT NULL,
  application_id text NOT NULL,
  name text NOT NULL,

  PRIMARY KEY (account_id, subscription_package_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON subscription_packages TO "subscription-worker";

CREATE TABLE subscriptions (
  subscription_started_at date NOT NULL,
  subscription_expired_at date NOT NULL,
  subscription_refunded_at date,
  free_trial_duration interval NOT NULL DEFAULT '00:00:00',
  account_id uuid NOT NULL,
  paid_period daterange NOT NULL
    GENERATED ALWAYS AS (daterange(
      LEAST(
        (subscription_started_at + free_trial_duration)::date,
        subscription_expired_at,
        subscription_refunded_at
      ),
      LEAST(
        subscription_expired_at,
        subscription_refunded_at
      )
    )) STORED,
  active_period daterange NOT NULL
    GENERATED ALWAYS AS (daterange(
      subscription_started_at, subscription_expired_at
    )) STORED,
  total_base_developer_proceeds money_value NOT NULL DEFAULT '0.00',
  subscriber_id text NOT NULL,
  application_id text NOT NULL,
  subscription_package_id text NOT NULL,

  PRIMARY KEY (account_id, subscription_package_id, subscriber_id, subscription_started_at),

  CONSTRAINT subscriptions_to_subscription_packages_fkey
    FOREIGN KEY (account_id, subscription_package_id)
      REFERENCES subscription_packages (account_id, subscription_package_id),
  CONSTRAINT subscriptions_to_subscribers_fkey
    FOREIGN KEY (account_id, subscriber_id)
      REFERENCES subscribers,

  CONSTRAINT subscriptions_active_period_excl
    EXCLUDE USING gist (
      account_id WITH =,
      active_period WITH &&,
      subscription_package_id WITH =,
      subscriber_id WITH =
    ),

  CONSTRAINT subscriptions_subscription_started_at_check
    CHECK (subscription_started_at <= subscription_expired_at),
  CONSTRAINT subscriptions_subscription_refunded_at_check
    CHECK (subscription_refunded_at <= subscription_expired_at)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON subscriptions TO "subscription-worker";
