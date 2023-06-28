# Fullstack PERN - backend git submodule

Clone parent repo and follow instructions to run the fullstack app.

```
git clone https://github.com/Anthony-Phillip-Collins/fullstack-docker-pern.git
```

# Heroku

Create service

```
heroku create fullstack-docker-pern-backend
```

Add Buildpack

```
heroku buildpacks:set heroku/nodejs
```

Add remote (should it not exist yet)

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
