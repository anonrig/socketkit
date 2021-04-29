SET ROLE subscription;

CREATE TABLE device_types (
  device_type_id text NOT NULL,
  provider_id text NOT NULL,
  name text NOT NULL,

  PRIMARY KEY (provider_id, device_type_id)
);

GRANT SELECT, INSERT ON device_types TO "subscription-worker";

CREATE TABLE clients (
  account_id uuid NOT NULL,
  provider_id text NOT NULL,
  client_id text NOT NULL,
  device_type_id text NOT NULL,
  country_id text NOT NULL,
  first_interaction date NOT NULL,
  total_base_client_purchase numeric NOT NULL DEFAULT '0.00',
  total_base_developer_proceeds numeric NOT NULL DEFAULT '0.00',

  PRIMARY KEY (account_id, client_id),

  CONSTRAINT clients_to_device_types_fkey
    FOREIGN KEY (provider_id, device_type_id) REFERENCES device_types,

  CONSTRAINT clients_country_id_check
    CHECK (country_id ~ '\A[a-z]{2}\Z')
);

CREATE INDEX ON clients (account_id, first_interaction);

GRANT SELECT, INSERT, UPDATE, DELETE ON clients TO "subscription-worker";
