SET ROLE subscription;

CREATE TABLE device_types (
  device_type_id text NOT NULL,
  provider_id text NOT NULL,
  name text NOT NULL,

  PRIMARY KEY (provider_id, device_type_id)
);

GRANT SELECT, INSERT ON device_types TO "subscription-worker";

CREATE TABLE subscribers (
  account_id uuid NOT NULL,
  provider_id text NOT NULL,
  subscriber_id text NOT NULL,
  device_type_id text NOT NULL,
  country_id text NOT NULL,
  first_interaction date NOT NULL,
  total_base_subscriber_purchase money_value NOT NULL DEFAULT '0.00',
  total_base_developer_proceeds money_value NOT NULL DEFAULT '0.00',

  PRIMARY KEY (account_id, subscriber_id),

  CONSTRAINT subscribers_to_device_types_fkey
    FOREIGN KEY (provider_id, device_type_id) REFERENCES device_types,

  CONSTRAINT subscribers_country_id_check
    CHECK (country_id ~ '\A[a-z]{2}\Z')
);

CREATE INDEX ON subscribers (account_id, first_interaction);

GRANT SELECT, INSERT, UPDATE, DELETE ON subscribers TO "subscription-worker";
