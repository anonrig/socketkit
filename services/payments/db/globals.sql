CREATE ROLE payment;
CREATE ROLE "payment-worker" LOGIN PASSWORD 'EC3Vov_e38qWMRXC';

CREATE DATABASE payment OWNER payment TEMPLATE template0 ENCODING "UTF-8" LC_COLLATE "C" LC_CTYPE "C";
