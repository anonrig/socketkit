SET ROLE subscription;

CREATE TABLE revenues (
  account_id uuid NOT NULL,
  for_date date NOT NULL,
  application_id text NOT NULL,
  country_id text NOT NULL,

  weekly_recurring money_value NOT NULL DEFAULT 0.0,
  monthly_recurring money_value NOT NULL DEFAULT 0.0,
  yearly_recurring money_value NOT NULL DEFAULT 0.0,

  total_revenue money_value NOT NULL DEFAULT 0.0,

  mrr_gained money_value NOT NULL DEFAULT 0.0, -- Additional MRR from new customers
  mrr_expansion money_value NOT NULL DEFAULT 0.0, -- Additional MRR from existing customers upgrades
  mrr_churn money_value NOT NULL DEFAULT 0.0, -- MRR lost from cancellations
  mrr_contraction money_value NOT NULL DEFAULT 0.0, -- MRR lost from existing customers downgrades

  is_valid bool NOT NULL DEFAULT false,

  PRIMARY KEY (account_id, for_date, application_id, country_id),

  CONSTRAINT revenue_country_id_check
    CHECK (country_id ~ '\A[a-z]{2}\Z')
);

CREATE INDEX ON revenues (for_date) WHERE NOT is_valid;

GRANT SELECT, INSERT, UPDATE ON revenues TO "subscription-worker";

CREATE OR REPLACE FUNCTION validate_revenues (
  _account_id uuid,
  _for_date date,
  _application_id text,
  _country_id text
)
  RETURNS void
  STRICT LANGUAGE sql
  AS $$
    WITH t AS (
      SELECT sum(t.base_developer_proceeds) AS total_revenue
      FROM transactions t
        JOIN subscribers s USING (account_id, subscriber_id)
      WHERE
        t.account_id = _account_id AND
        t.event_date = _for_date AND
        t.application_id = _application_id AND
        s.country_id = _country_id
    )
    UPDATE revenues r
    SET
      total_revenue = COALESCE(t.total_revenue, 0.0),
      is_valid = true
    FROM t
    WHERE
      r.account_id = _account_id AND
      r.for_date = _for_date AND
      r.application_id = _application_id AND
      r.country_id = _country_id;
  $$;
