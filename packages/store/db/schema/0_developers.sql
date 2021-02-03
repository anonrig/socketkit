SET ROLE store;

CREATE TABLE developers (
  developer_id text NOT NULL,
  name text NOT NULL,
  store_url text NOT NULL,
  website text,

  PRIMARY KEY (developer_id)
);
