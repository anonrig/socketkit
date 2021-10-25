SET ROLE store;

CREATE TABLE applications (
  last_fetch timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz NOT NULL,
  application_id text NOT NULL,
  developer_id text NOT NULL,
  bundle_id text NOT NULL,
  default_country_id text NOT NULL,
  failed_fetches int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL default true,
  last_error_message text,

  PRIMARY KEY (application_id),
  UNIQUE (bundle_id),
  FOREIGN KEY (developer_id) REFERENCES developers,
  CONSTRAINT applications_last_fetch_check
    CHECK (last_fetch >= released_at),
  CONSTRAINT applications_last_error_message_check
    CHECK (is_active OR last_error_message IS NOT NULL),
  CONSTRAINT applications_failed_fetches_check
    CHECK (
      CASE 
        WHEN failed_fetches = 0 THEN last_error_message IS NULL
        WHEN failed_fetches > 0 THEN last_error_message IS NOT NULL
        ELSE false -- Negative values are not allowed
      END
    )
);

CREATE INDEX applications_last_fetch_idx ON applications (last_fetch);

GRANT SELECT, INSERT, UPDATE ON applications TO "store-worker";


-- Her ulkedeki veri
CREATE TABLE application_releases (
  reviews int NOT NULL,
  score float4 NOT NULL,
  price numeric(2) NOT NULL,
  application_id text NOT NULL,
  country_id text NOT NULL,
  store_url text NOT NULL,
  currency_id text NOT NULL,
  default_language_id text NOT NULL,
  latest_version_number text NOT NULL,
  rating_histogram int[] NOT NULL DEFAULT '{0,0,0,0,0}',

  PRIMARY KEY (application_id, country_id),
  CONSTRAINT application_releases_application_fkey
    FOREIGN KEY (application_id) REFERENCES applications,
  CHECK (country_id ~ '\A[a-z]{2}\Z')
);

ALTER TABLE applications
  ADD CONSTRAINT applications_application_releases_fkey
    FOREIGN KEY (application_id, default_country_id)
    REFERENCES application_releases (application_id, country_id)
    DEFERRABLE INITIALLY DEFERRED;

GRANT SELECT, INSERT, UPDATE ON application_releases TO "store-worker";


-- Her versiyon icin
CREATE TABLE application_versions (
  released_at timestamptz NOT NULL,
  application_id text NOT NULL,
  version_number text NOT NULL,
  icon text NOT NULL,
  size text NOT NULL,
  required_os_version text NOT NULL,
  language_ids text[] NOT NULL DEFAULT '{}',
  website text,
  content_rating text NOT NULL,
  default_language_id text NOT NULL,

  PRIMARY KEY (application_id, version_number),
  CONSTRAINT application_versions_applications_fkey
    FOREIGN KEY (application_id) REFERENCES applications,
  CONSTRAINT application_versions_language_ids_check
    CHECK (
      array_length(language_ids, 1) > 0 AND
      array_length(language_ids, 2) IS NULL AND
      default_language_id = ANY (language_ids)
    )
);

GRANT SELECT, INSERT, UPDATE ON application_versions TO "store-worker";


-- Her dil icin
CREATE TABLE application_version_contents (
  application_id text NOT NULL,
  fetched_country_id text NOT NULL,
  language_id text NOT NULL,
  version_number text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  release_notes text NOT NULL,
  screenshots json NOT NULL,

  PRIMARY KEY (application_id, version_number, language_id),
  CONSTRAINT application_version_contents_application_releases_fkey
    FOREIGN KEY (application_id, fetched_country_id)
    REFERENCES application_releases (application_id, country_id),
  CONSTRAINT application_version_contents_application_versions_fkey
    FOREIGN KEY (application_id, version_number)
    REFERENCES application_versions,
  CHECK (language_id ~ '\A[A-Z]{2}\Z')
);

ALTER TABLE application_releases
  ADD CONSTRAINT application_releases_application_version_contents_fkey
    FOREIGN KEY (application_id, latest_version_number, default_language_id)
    REFERENCES application_version_contents (application_id, version_number, language_id)
    DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE application_versions
  ADD CONSTRAINT application_version_application_version_contents_fkey
    FOREIGN KEY (application_id, version_number, default_language_id)
    REFERENCES application_version_contents (application_id, version_number, language_id)
    DEFERRABLE INITIALLY DEFERRED;

GRANT SELECT, INSERT, UPDATE ON application_version_contents TO "store-worker";
