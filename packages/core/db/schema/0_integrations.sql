SET ROLE core;

CREATE TABLE integrations (
    integration_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    requirement_schema jsonb NOT NULL,

    PRIMARY KEY (integration_id)
);

GRANT SELECT ON integrations TO "core-worker";

INSERT INTO integrations (integration_id, title, description, requirement_schema)
    VALUES (
        'appstore-connect',
        'AppStore Connect',
        'Transactions and Sales support for Apple',
        '{"type": "object", "required": ["access_token"], "properties": {"access_token": {"type": "string"}}}'
    );
