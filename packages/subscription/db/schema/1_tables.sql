SET ROLE subscription;

DROP TYPE IF EXISTS transaction_type;
CREATE TYPE transaction_type AS ENUM ('trial', 'renewal', 'refund');

CREATE TABLE countries (
    coordinates point NOT NULL,
    country_id text NOT NULL,
    name text NOT NULL,
    capital text,
    timezones text[] NOT NULL,

    PRIMARY KEY (country_id)
);

GRANT SELECT ON countries TO "subscription-worker";

CREATE TABLE currencies (
    currency_id text NOT NULL,
    symbol text NOT NULL,
    name text NOT NULL,

    PRIMARY KEY (currency_id)
);

GRANT SELECT ON currencies TO "subscription-worker";

CREATE TABLE currency_exchanges (
    currency_id text NOT NULL REFERENCES currencies,
    exchange_date date NOT NULL,
    amount numeric NOT NULL,

    PRIMARY KEY (currency_id, exchange_date)
);

CREATE INDEX ON currency_exchanges (exchange_date);

GRANT SELECT, INSERT ON currency_exchanges TO "subscription-worker";

CREATE TABLE providers (
    provider_id text NOT NULL,
    name text NOT NULL,

    PRIMARY KEY (provider_id)
);

GRANT SELECT ON providers TO "subscription-worker";

CREATE TABLE device_types (
    device_type_id text NOT NULL,
    provider_id text NOT NULL REFERENCES providers,
    name text NOT NULL,

    PRIMARY KEY (provider_id, device_type_id)
);

GRANT SELECT, INSERT ON device_types TO "subscription-worker";

CREATE TABLE clients (
    account_id uuid NOT NULL,
    provider_id text NOT NULL,
    client_id text NOT NULL,
    device_type_id text NOT NULL,
    country_id text NOT NULL REFERENCES countries,
    first_interaction date NOT NULL,
    total_base_client_purchase numeric NOT NULL DEFAULT '0.00',
    total_base_developer_proceeds numeric NOT NULL DEFAULT '0.00',

    PRIMARY KEY (account_id, client_id),

    FOREIGN KEY (provider_id, device_type_id)
        REFERENCES device_types
);

CREATE INDEX ON clients (account_id, first_interaction);

GRANT SELECT, INSERT, UPDATE, DELETE ON clients TO "subscription-worker";

CREATE TABLE applications (
    account_id uuid NOT NULL,
    application_id text NOT NULL,
    name text NOT NULL,
    provider_id text NOT NULL REFERENCES providers,

    PRIMARY KEY (account_id, application_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON applications TO "subscription-worker";

CREATE TABLE subscription_packages (
    subscription_duration interval NOT NULL,
    account_id uuid NOT NULL,
    subscription_package_id text NOT NULL,
    subscription_group_id text NOT NULL,
    application_id text NOT NULL,
    name text NOT NULL,

    PRIMARY KEY (account_id, subscription_package_id),
    UNIQUE (account_id, subscription_group_id, subscription_duration, subscription_package_id),

    FOREIGN KEY (account_id, application_id)
        REFERENCES applications
);

GRANT SELECT, INSERT, UPDATE, DELETE ON subscription_packages TO "subscription-worker";

CREATE TABLE client_subscriptions (
    subscription_duration interval NOT NULL,
    free_trial_duration interval NOT NULL DEFAULT '00:00:00',
    account_id uuid NOT NULL,
    active_period daterange NOT NULL DEFAULT 'empty',
    total_base_client_purchase numeric NOT NULL DEFAULT '0.00',
    total_base_developer_proceeds numeric NOT NULL DEFAULT '0.00',
    client_id text NOT NULL,
    application_id text NOT NULL,
    subscription_package_id text NOT NULL,
    subscription_group_id text NOT NULL,

    PRIMARY KEY (account_id, subscription_package_id, client_id),

    FOREIGN KEY (account_id, subscription_group_id, subscription_duration, subscription_package_id)
        REFERENCES subscription_packages (account_id, subscription_group_id, subscription_duration, subscription_package_id),

    FOREIGN KEY (account_id, client_id)
        REFERENCES clients,

    EXCLUDE USING gist (
        account_id WITH =,
        active_period WITH &&,
        subscription_group_id WITH =,
        client_id WITH =
    )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON client_subscriptions TO "subscription-worker";

CREATE TABLE client_transactions (
    transaction_type transaction_type NOT NULL,
    event_date date NOT NULL,
    account_id uuid NOT NULL,
    client_purchase numeric NOT NULL DEFAULT '0.00',
    developer_proceeds numeric NOT NULL DEFAULT '0.00',
    base_client_purchase numeric NOT NULL DEFAULT '0.00',
    base_developer_proceeds numeric NOT NULL DEFAULT '0.00',
    subscription_group_id text NOT NULL,
    subscription_package_id text NOT NULL,
    client_id text NOT NULL,
    application_id text NOT NULL,
    client_currency_id text NOT NULL REFERENCES currencies (currency_id),
    developer_currency_id text NOT NULL REFERENCES currencies (currency_id),
    base_currency_id text NOT NULL REFERENCES currencies (currency_id),

    FOREIGN KEY (account_id, subscription_package_id, client_id)
        REFERENCES client_subscriptions,

    FOREIGN KEY (account_id, client_id)
        REFERENCES clients,

    FOREIGN KEY (account_id, application_id)
        REFERENCES applications,

    UNIQUE (account_id, client_id, event_date, transaction_type, subscription_group_id, subscription_package_id)
);

CREATE INDEX ON client_transactions (account_id, event_date);

GRANT SELECT, INSERT, UPDATE, DELETE ON client_transactions TO "subscription-worker";

CREATE OR REPLACE FUNCTION client_transactions_update_subscription()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE client_subscriptions
        SET active_period = daterange(
				LEAST(lower(active_period), NEW.event_date),
				GREATEST(
					upper(active_period),
						CASE NEW.transaction_type
						WHEN 'trial' THEN (NEW.event_date + free_trial_duration)::date
						WHEN 'renewal' THEN (NEW.event_date + subscription_duration)::date
						WHEN 'refund' THEN (NEW.event_date + interval '1 day')::date
					END
				)
			),
            total_base_client_purchase = total_base_client_purchase + NEW.base_client_purchase,
            total_base_developer_proceeds = total_base_developer_proceeds + NEW.base_developer_proceeds
        WHERE account_id = NEW.account_id AND
              client_id = NEW.client_id AND
              subscription_package_id = NEW.subscription_package_id;

        RETURN NEW;
    END;
$$;

CREATE TRIGGER client_transactions_after_insert
    AFTER INSERT ON client_transactions
    FOR EACH ROW
    EXECUTE FUNCTION client_transactions_update_subscription();

CREATE OR REPLACE FUNCTION client_transactions_set_client_interaction_date()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE clients
        SET first_interaction = LEAST(first_interaction, NEW.event_date),
            total_base_client_purchase = total_base_client_purchase + NEW.base_client_purchase,
            total_base_developer_proceeds = total_base_developer_proceeds + NEW.base_developer_proceeds
        WHERE account_id = NEW.account_id AND
              client_id = NEW.client_id;

        RETURN NEW;
    END;
$$;

CREATE TRIGGER client_transactions_after_insert_update_client
    AFTER INSERT ON client_transactions
    FOR EACH ROW
    EXECUTE FUNCTION client_transactions_set_client_interaction_date();

CREATE TABLE vendor_fetch_logs (
    account_id text NOT NULL,
    vendor_id text NOT NULL,
    fetch_date date NOT NULL,
    successful boolean NOT NULL DEFAULT true,
    payload json,

    PRIMARY KEY (account_id, vendor_id, fetch_date, successful)
);

GRANT SELECT, INSERT ON vendor_fetch_logs TO "subscription-worker";

CREATE TABLE account_provider_preferences (
    account_id uuid NOT NULL,
    provider_id text NOT NULL,
    vendor_id text NOT NULL,
    available_vendor_ids text[] NOT NULL,

    PRIMARY KEY (account_id, provider_id),

    FOREIGN KEY (provider_id)
        REFERENCES providers
);

GRANT SELECT, INSERT, UPDATE ON account_provider_preferences TO "subscription-worker";
