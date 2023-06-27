# Fullstack PERN - backend git submodule

# Heroku

Create service

```
heroku create fullstack-docker-pern-backend
```

Add Buildpack

```
heroku buildpacks:set heroku/nodejs
```

Add remote

```
git remote add heroku https://git.heroku.com/fullstack-docker-pern-backend.git
```

Push to heroku

```
git push heroku main
```

Container

login

```
heroku container:login
```

set stack to container

```
heroku stack:set container -a fullstack-docker-pern-backend
```

attach (existing) postgress addon to app

```
heroku addons:attach postgresql-slippery-61961 -a fullstack-docker-pern-backend
```

push changes

```
git push heroku main
```

stop dyno

```
heroku ps:stop fullstack-docker-pern-backend
```

restart dyno

```
heroku ps:restart fullstack-docker-pern-backend
```
