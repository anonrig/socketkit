CREATE ROLE subscription;
CREATE ROLE "subscription-worker" LOGIN PASSWORD 'change-this';

CREATE DATABASE subscription OWNER subscription
TEMPLATE template0 ENCODING "UTF-8" LC_COLLATE "C" LC_CTYPE "C";
