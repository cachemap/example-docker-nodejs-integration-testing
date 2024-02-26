# docker-nodejs-testing

# Intro

This repository shows an exemplary approach to containerizing a NodeJS Express Server project with the following notable features:
- `docker compose`d server, development server, unit tests, and integration tests (complete with Dockerfile, docker-compose.yml for development, env file configuration)
- `mocha` + `chai` with `chai-http` for integration tests
- controller -> service -> data-access-object (dao) pattern
- containerized MySQL database during testing
- nodemon code live-reloading in development
- prettier config

This README's ultimate purpose is to help quickly familiarize newer developers with the considerations necessary to understand effective codebase design in NodeJS.

In it, we will walk through how to "orient" ourselves in many codebases like this one. Careful consideration has been taken to make reasonable choices every step of the way in building this repo, as there are many decisions to be made.

Take, for example, the various config files in the top level directory:
- .prettierrc
- .mocha.json
- package.json

These files express within themselves many configuration options that can be "tweaked" as best seen fit by development teams, in general. People will always argue and debate what is best for these settings. It is desirable that the decisions made in this repo about these settings strive for following the "principle of least surprise" by adhering to conventions that make sense for many projects.

The remained of this README attempts to provide a fully-encapsulated exposure to this repo's most salient point with just enough detail to explain the nitty-gritty of backend web application development with NodeJS.
