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
