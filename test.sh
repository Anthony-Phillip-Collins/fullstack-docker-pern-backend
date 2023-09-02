#!/bin/bash

# This is just a helper for running tests in the backend container and retrieving the exit code.
# It is used with husky to run tests at pre-push.

docker exec -t dev.backend npm run test
