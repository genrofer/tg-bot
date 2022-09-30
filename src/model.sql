CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     user_id TEXT NOT NULL,
     name TEXT NOT NULL,
     username TEXT NOT NULL,
     is_active BOOLEAN NOT NULL,
     connected TEXT
);

insert into users(user_id, name, username, is_active, connected)
values (1564651, 'Hakuna <<', 'matata', false, 0); 