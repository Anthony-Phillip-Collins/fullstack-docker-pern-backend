# Fullstack Docker PERN - backend

This is a submodule of its parent project:  
https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/

## Local development

To run the full project locally visit the [parent project](https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/) and follow the instructions of the [README.md](https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/blob/main/README.md).

## Deploy to Heroku

Follow these steps to create an app on Heroku that serves the backend.

1. Create an account with [Heroku](https://www.heroku.com) and log in via cli

```bash
heroku login
```

2. Create app

```bash
heroku create appname
```

3. Create postgress database

```bash
heroku addons:create heroku-postgresql:mini
```

4. Create initial table and entries

```bash
heroku pg:psql < init.sql
```

5. Use [psql](https://devcenter.heroku.com/articles/managing-heroku-postgres-using-cli) on the database server

```bash
heroku pg:psql
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

```bash
heroku stack:set container -a appname
```

9. Open second terminal window for logging

```bash
heroku logs -t --app appname
```

10. Push to Heroku

```bash
git push heroku main
```

11. Open app

```bash
heroku open api/blogs
```
