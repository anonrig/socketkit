SET ROLE subscription;

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

    PRIMARY KEY (account_id, provider_id)
);

GRANT SELECT, INSERT, UPDATE ON account_provider_preferences TO "subscription-worker";
