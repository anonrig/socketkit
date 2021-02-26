SET ROLE core;

CREATE TYPE account_role AS ENUM ('owner');

CREATE TABLE accounts (
    account_id uuid NOT NULL,

    PRIMARY KEY (account_id)
);

GRANT SELECT, INSERT, DELETE ON accounts TO "core-worker";

CREATE TABLE account_integrations (
    created_at timestamptz NOT NULL DEFAULT now(),
    requirement_set_at timestamptz NOT NULL DEFAULT now(),
    failed_since timestamptz,
    account_id uuid NOT NULL,
    integration_id text NOT NULL,
    requirement_payload jsonb NOT NULL,

    PRIMARY KEY (account_id, integration_id),
    FOREIGN KEY (account_id) REFERENCES accounts,
    FOREIGN KEY (integration_id) REFERENCES integrations,

    CONSTRAINT account_integrations_requirement_set_at_check
        CHECK (created_at <= requirement_set_at),
    CONSTRAINT account_integrations_failed_since_check
        CHECK (requirement_set_at < failed_since)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON account_integrations TO "core-worker";

CREATE TABLE account_identities (
    account_role account_role NOT NULL DEFAULT 'owner',
    created_at timestamptz NOT NULL DEFAULT now(),
    account_id uuid NOT NULL,
    identity_id text NOT NULL,

    PRIMARY KEY (account_id, identity_id),
    FOREIGN KEY (account_id) REFERENCES accounts
);

GRANT SELECT, INSERT, DELETE ON account_identities TO "core-worker";
