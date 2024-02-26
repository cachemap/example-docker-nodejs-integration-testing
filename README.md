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

# The Most Important Files

Besides this README file, the most important files for humans to read to understand what the code in this repo seeks to accomplish are its `package.json` and `Dockerfile`. Not every NodeJS project will have a `Dockerfile`, but basically any serious project will have a `package.json`.

## `package.json` - the most helpful metadata

When you first open a project like this one, you'll want to check out this file. It's supposed to contain useful information such as:
- `"description"` - what is this project?
- `"main"` - which source file is the "entrypoint" of this application (what gets the gears turning)
- `"scripts"` - the keys of this object are commands you can run with `npm run {command_name}`. In this repo, they're commands we will run in our Docker containers
- `"dependencies"` - which (usually 3rd party and open source) npm packages our source code uses to provide its intended purpose
- `"devDependencies"` - which dependencies are used only for testing purposes and not for the main intended purpose
- `"peerDependencies"` - other packages that must be installed alongside your other dependencies, but whose version can't be nailed down specifically by some dependency that uses these peerDependencies (these are rarer than the other 2)

Talk about owning the "keys to the kingdom"! If you've read this file, you typically know incredibly useful things like what useful purpose this repo is achieves and what kinds of external libraries it leverages. For example, our `dependencies` lists a library called `express`, which is a dead giveaway this repository represents an Express API Server. See Client-Server Model.

## 🐋 `Dockerfile` - how to "build" this application and launch it within a container

Docker (and more specifically containerization) has a lot of benefits. To convince you, here are some:
- It's a technology that helps solve a problem with complex development: **dependency management**. Two different developers on two different machines must install an application's dependencies correctly and according to the platform (Linux, MacOS, Windows) it will be executing on, or else you encounter a frustrating problem where the code runs just fine on one dev's machine while it fails with a bunch of mysterious error codes on another's. Docker containers "embed" dependencies in a shareable way that elimantes this problem that has plagued development teams for decades.
- Containers execute according to a standard that ensures the repeatability of the code contained within it. This enables an entire ecosystem of effective methods to deploy your code to production that support desirable qualities like fault tolerance, high service uptime, observability, and more!

Ultimately, the presence of a Dockerfile indicates Docker is in use. It's included in this repository because it facilitates a demonstration of the power of containers. The Dockerfile is responsible for listing the "instructions" to build a Linux filesystem prepped with all dependencies installed appropriately so that your application is ready to go and guaranteed to "just work". In this repo's Dockerfile, all instructions except the last accomplish this goal. Then, the final `CMD` instruction specifies the command necessary to "launch" our application the *official* way.

Pretty useful, eh?

That is, until you need to start running Docker containers at the command line, by hand:

`docker build docker-nodejs-testing`

`docker run docker-nodejs-testing -v .:/usr/src/app -v /usr/src/app/node_modules -e MYSQL_DATABASE=test -p 3000:3000 ...`

Isn't that just a mess?

Luckily, there is a solution.
