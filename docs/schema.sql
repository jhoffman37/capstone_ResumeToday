DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
);

