SET ROLE subscription;

CREATE TABLE subscription_packages (
    subscription_duration interval NOT NULL,
    account_id uuid NOT NULL,
    subscription_package_id text NOT NULL,
    subscription_group_id text NOT NULL,
    application_id text NOT NULL,
    name text NOT NULL,

    PRIMARY KEY (account_id, subscription_package_id),
    UNIQUE (account_id, subscription_group_id, subscription_duration, subscription_package_id)
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
