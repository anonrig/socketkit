SET ROLE subscription;

CREATE TABLE revenues (
  account_id uuid NOT NULL,
  for_date date NOT NULL,
  country_id text NOT NULL,

  weekly_recurring numeric NOT NULL DEFAULT '0.00',
  monthly_recurring numeric NOT NULL DEFAULT '0.00',
  yearly_recurring numeric NOT NULL DEFAULT '0.00',

  total_revenue numeric NOT NULL DEFAULT '0.00',

  mrr_gained numeric NOT NULL DEFAULT '0.00', -- Additional MRR from new customers
  mrr_expansion numeric NOT NULL DEFAULT '0.00', -- Additional MRR from existing customers upgrades
  mrr_churn numeric NOT NULL DEFAULT '0.00', -- MRR lost from cancellations
  mrr_contraction numeric NOT NULL DEFAULT '0.00', -- MRR lost from existing customers downgrades

  refetch_needed bool NOT NULL DEFAULT false,

  PRIMARY KEY (account_id, for_date, country_id),

  CONSTRAINT revenue_country_id_check
    CHECK (country_id ~ '\A[a-z]{2}\Z')
);

CREATE INDEX ON revenues (for_date) WHERE refetch_needed;

CREATE FUNCTION update_revenues (_account_id uuid, _for_date text, _country_id text)
  RETURNS void
  STRICT LANGUAGE sql
  AS $$
    UPDATE revenues
    SET refetch_needed = false
    WHERE account_id = _account_id AND
      for_date = _for_date AND
      country_id = _country_id;
  $$;

GRANT SELECT, INSERT ON revenues TO "subscription-worker";
