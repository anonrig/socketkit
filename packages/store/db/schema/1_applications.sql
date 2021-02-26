SET ROLE store;


CREATE TABLE applications (
  last_fetch timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz NOT NULL,
  application_id text NOT NULL,
  developer_id text NOT NULL,
  bundle_id text NOT NULL,

  PRIMARY KEY (application_id),
  UNIQUE (bundle_id),
  FOREIGN KEY (developer_id) REFERENCES developers,
  CONSTRAINT applications_last_fetch_check
    CHECK (last_fetch >= released_at)
);

CREATE INDEX applications_last_fetch_idx ON applications (last_fetch);

GRANT SELECT, INSERT, UPDATE ON applications TO "store-worker";


CREATE TABLE application_versions (
  score int NOT NULL,
  reviews int NOT NULL,
  released_at timestamptz NOT NULL,
  price numeric(2) NOT NULL,
  release_notes text NOT NULL,
  application_id text NOT NULL,
  country_id text NOT NULL,
  version text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  size text NOT NULL,
  required_os_version text NOT NULL,
  store_url text NOT NULL,
  currency_id text NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  screenshots json NOT NULL,
  website text,
  content_rating text NOT NULL,

  PRIMARY KEY (application_id, country_id, version),
  FOREIGN KEY (application_id) REFERENCES applications,
  CHECK (country_id ~ '\A[a-z]{2}\Z'::text)
);

GRANT SELECT, INSERT, UPDATE ON application_versions TO "store-worker";


CREATE TABLE application_ratings (
  application_id text NOT NULL,
  country_id text NOT NULL,
  rating_histogram int[] NOT NULL DEFAULT '{}',

  PRIMARY KEY (application_id, country_id),
  FOREIGN KEY (application_id) REFERENCES applications
);

GRANT SELECT, INSERT, UPDATE ON application_ratings TO "store-worker";

