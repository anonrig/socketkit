SET ROLE store;

CREATE TABLE application_versions (
  score int NOT NULL,
  reviews int NOT NULL,
  released_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
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
  FOREIGN KEY (application_id) REFERENCES applications
);
