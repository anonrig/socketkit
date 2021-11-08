CREATE ROLE accounts;
CREATE ROLE "accounts-worker" LOGIN PASSWORD 'change-this';

CREATE DATABASE accounts OWNER accounts TEMPLATE template0 ENCODING "UTF-8" LC_COLLATE "C" LC_CTYPE "C";
