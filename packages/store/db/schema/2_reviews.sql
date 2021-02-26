SET ROLE store;

CREATE TABLE application_reviews (
  review_id text NOT NULL,
  application_id text NOT NULL,
  version text NOT NULL,
  country_id text NOT NULL,
  score int NOT NULL,
  username text NOT NULL,
  user_url text NOT NULL,
  url text NOT NULL,
  title text NOT NULL,
  text text NOT NULL,

  PRIMARY KEY (review_id),
  FOREIGN KEY (application_id) REFERENCES applications
);

GRANT SELECT, INSERT, UPDATE ON application_reviews TO "store-worker";
