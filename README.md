# Fullstack Docker PERN - backend git submodule

Parent project: https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/

To run the full project locally visit the parent project and follow the instructions of the [README.md](https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/blob/main/README.md).

# Heroku

1. Create an account with [Heroku](https://www.heroku.com) and log in via cli

```
$ heroku login
```

2. Create app

```
$ heroku create appname
```

3. Create postgress database

```
$ heroku addons:create heroku-postgresql:mini
```

4. Use [psql](https://devcenter.heroku.com/articles/managing-heroku-postgres-using-cli) on the database server

```
$ heroku pg:psql
```

5. Create a table with an entry

```sql
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    likes INTEGER NOT NULL
);

INSERT INTO blogs (title, author, url, likes) VALUES ('Some Blog', 'Some Author', 'https://google.com/', 1);
```

6. Confirm the entry exists

```sql
SELECT * FROM blogs;
```

7. Exit database server

```
\q
```

8. Set stack to container

```
$ heroku stack:set container -a appname
```

9. Open second terminal window for logging

```
$ heroku logs -t --app appname
```

10. Push to Heroku

```
$ git push heroku main
```

11. Open app

```
$ heroku open api/blogs
```
