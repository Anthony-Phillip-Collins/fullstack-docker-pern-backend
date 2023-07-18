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
heroku pg:psql < commands.sql
```

5. Confirm the entry exists

```bash
heroku pg:psql -c 'SELECT * FROM blogs;'
```

6. Set stack to container

```bash
heroku stack:set container -a appname
```

7. Open second terminal window for logging

```bash
heroku logs -t --app appname
```

8. Push to Heroku

```bash
git push heroku main
```

9. Open app

```bash
heroku open api/blogs
```

## Gotchas

If you get the error that `bcrypt` can’t be found then try `npm rebuild`. Otherwise try [these fixes](https://www.codefari.com/2019/11/common-issue-cant-find-module-bcrypt-in.html).

## Tips

Run bash in the container

```bash
heroku run bash -a appname
```
