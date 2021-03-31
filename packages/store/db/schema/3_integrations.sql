SET ROLE store;

CREATE TABLE integrations (
  account_id text NOT NULL,
  application_id text NOT NULL,
  country_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (account_id, application_id, country_id),
  FOREIGN KEY (application_id, country_id) REFERENCES reviews_watchlist
);

GRANT SELECT, INSERT, UPDATE, DELETE ON integrations TO "store-worker";
