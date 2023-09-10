# Fullstack Docker PERN - backend

This is a submodule of its parent project:  
https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/

## Local development

To run the full project locally visit the [parent project](https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/) and follow the instructions of the [README.md](https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern/blob/main/README.md).  
Once the project is up and running you can test the all endpoints with [Postman](https://www.postman.com/) by importing _postman-collection.json_.

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
heroku addons:create heroku-postgresql:mini -a appname
```

4. Create redis database

```bash
 heroku addons:create heroku-redis:mini -a appname
```

5. Set stack to container

```bash
heroku stack:set container -a appname
```

6. Open second terminal window for logging

```bash
heroku logs -t --app appname
```

7. Push to Heroku

```bash
git push heroku main
```

8. Open app

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

Run psql to query the database

```bash
heroku pg:psql -c 'SELECT * FROM blogs;' -a appname
```

Execute sql commands from a file

```bash
heroku pg:psql < commands.sql
```

Run redis-cli in dev container

```bash
docker exec -it dev.redis redis-cli
```
