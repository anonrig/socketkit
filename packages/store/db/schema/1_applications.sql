SET ROLE store;

CREATE TABLE applications (
  created_at timestamptz NOT NULL DEFAULT now(),
  last_fetch timestamptz NOT NULL DEFAULT now(),
  application_id text NOT NULL,
  developer_id text NOT NULL,
  bundle_id text NOT NULL,

  PRIMARY KEY (application_id),
  UNIQUE (bundle_id),
  FOREIGN KEY (developer_id) REFERENCES developers,
  CONSTRAINT applications_last_fetch_check
    CHECK (last_fetch >= created_at)
);

CREATE INDEX applications_last_fetch_idx ON applications (last_fetch);

GRANT SELECT, INSERT, UPDATE ON applications TO "store-worker";
