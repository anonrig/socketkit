SET ROLE store;

CREATE TABLE reviews_watchlist (
  application_id text NOT NULL,
  country_id text NOT NULL,
  last_fetch timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL default true,
  last_error_message text,
  
  PRIMARY KEY (application_id, country_id),
  CHECK (country_id ~ '\A[a-z]{2}\Z'),
  FOREIGN KEY (application_id) REFERENCES applications
);

GRANT SELECT, INSERT, UPDATE ON reviews_watchlist TO "store-worker";


CREATE TABLE reviews (
  review_id text NOT NULL,
  application_id text NOT NULL,
  version_number text NOT NULL,
  country_id text NOT NULL,
  score int NOT NULL,
  username text NOT NULL,
  user_url text NOT NULL,
  review_url text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,

  PRIMARY KEY (review_id),
  FOREIGN KEY (application_id, country_id) REFERENCES reviews_watchlist
);

GRANT SELECT, INSERT, UPDATE ON reviews TO "store-worker";
