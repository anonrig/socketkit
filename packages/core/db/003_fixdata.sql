INSERT INTO integrations (integration_id, title, description, requirement_schema)
    VALUES (
        'appstore-connect',
        'AppStore Connect',
        'Transactions and Sales support for Apple',
        '{"type": "object", "required": ["access_token"], "properties": {"access_token": {"type": "string"}}}'
    );
