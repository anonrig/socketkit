CREATE ROLE notification;
CREATE ROLE "notification-worker" LOGIN PASSWORD 'change-this';

CREATE DATABASE notification OWNER notification
TEMPLATE template0 ENCODING "UTF-8" LC_COLLATE "C" LC_CTYPE "C";
