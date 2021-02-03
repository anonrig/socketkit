SET ROLE store;

CREATE TABLE application_ratings (
  application_id text NOT NULL,
  country_id text NOT NULL,
  rating_histogram int[] NOT NULL DEFAULT '{}',

  PRIMARY KEY (application_id, country_id),
  FOREIGN KEY (application_id) REFERENCES applications
);

GRANT SELECT, INSERT, UPDATE ON application_ratings TO "store-worker";
