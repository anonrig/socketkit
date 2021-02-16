SET ROLE subscription;

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
