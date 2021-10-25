SET ROLE subscription;

CREATE DOMAIN money_value AS numeric
  CHECK (VALUE != 'NaN');
