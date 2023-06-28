CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    likes INTEGER NOT NULL
);

INSERT INTO blogs (title, author, url, likes) VALUES ('Kent C. Dodds’s Blog', 'Kent C. Dodds', 'https://kentcdodds.com/blog', 1);

INSERT INTO blogs (title, author, url, likes) VALUES ('Robin Wieruch’s Blog', 'Robin Wieruch', 'https://www.robinwieruch.de/blog/', 4);