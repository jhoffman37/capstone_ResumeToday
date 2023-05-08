DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;

CREATE TABLE users
(
    id   SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL
);

CREATE TABLE resumes
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    shared_users Text[] NOT NULL,
    title TEXT NOT NULL,
    html TEXT NOT NULL
);

-- password: 'password'
insert into users (first_name, last_name, username, password_hash, salt) values
    ('Test', 'User', 'testusername',
     '$2a$10$juW0X0tmLTm/09PHXqfcqe2EXUv80Qw/whkWO1fPwN5ENwLtg6w.K',
     '$2a$10$juW0X0tmLTm/09PHXqfcqe');