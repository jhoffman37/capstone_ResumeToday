DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (name, username, password) VALUES ('Test User', 'testusername', 'testpassword');
