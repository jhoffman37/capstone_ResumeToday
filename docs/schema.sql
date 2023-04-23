DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL
);

insert into users (name, username, password_hash, salt) values
                                                            ('Test User', 'testusername',
                                                             '$2a$10$juW0X0tmLTm/09PHXqfcqe2EXUv80Qw/whkWO1fPwN5ENwLtg6w.K',
                                                             '$2a$10$juW0X0tmLTm/09PHXqfcqe');
