SET ROLE store;

CREATE TABLE applications (
  application_id text NOT NULL,
  developer_id text NOT NULL,
  bundle_id text NOT NULL,

  PRIMARY KEY (application_id),
  UNIQUE (bundle_id),
  FOREIGN KEY (developer_id) REFERENCES developers
);

GRANT SELECT, INSERT ON applications TO "store-worker";
