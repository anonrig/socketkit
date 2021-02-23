SET ROLE subscription;

CREATE TABLE integrations (
    last_fetch date NOT NULL,
    account_id uuid NOT NULL,
    provider_id text NOT NULL,
    access_token text NOT NULL,
    vendor_ids text[] NOT NULL,
    last_error_message text,

    PRIMARY KEY (account_id, provider_id),
    CHECK (
        array_length(vendor_ids, 1) > 0 AND
        array_length(vendor_ids, 2) IS NULL
    )
);

GRANT SELECT, INSERT, UPDATE ON integrations TO "subscription-worker";
