SET ROLE core;

CREATE TYPE account_role AS ENUM ('owner');

CREATE TABLE account_identities (
    account_role account_role NOT NULL DEFAULT 'owner',
    created_at timestamptz NOT NULL DEFAULT now(),
    account_id uuid NOT NULL,
    identity_id text NOT NULL,

    PRIMARY KEY (account_id, identity_id)
);

GRANT SELECT, INSERT, DELETE ON account_identities TO "core-worker";
