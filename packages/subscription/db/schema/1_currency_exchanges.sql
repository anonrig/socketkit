SET ROLE subscription;

CREATE TABLE currency_exchanges (
  currency_id text NOT NULL,
  exchange_date date NOT NULL,
  amount numeric NOT NULL,

  PRIMARY KEY (currency_id, exchange_date),
  CHECK (currency_id ~ '\A[A-Z]{3}\Z')
);

CREATE INDEX ON currency_exchanges (exchange_date);

GRANT SELECT, INSERT ON currency_exchanges TO "subscription-worker";
