# docker-nodejs-testing

### Table of Contents
1. [Intro](#Intro)
2. [The Most Important Files](#the-most-important-files)
    - [package.json](#packagejson---the-most-helpful-metadata)
    - [Dockerfile](#🐋-Dockerfile---how-to-"build"-this-application-and-launch-it-within-a-container)
3. [Docker Compose](#docker-compose)
4. [Integration Testing with `mocha`, `chai`, and `chai-http`]()

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
- It's a technology that helps solve a problem with complex development: **dependency management**. Two different developers on two different machines must install an application's dependencies correctly and according to the platform (Linux, MacOS, Windows) it will be executing on, or else you encounter a frustrating problem where the code runs just fine on one dev's machine while it fails with a bunch of mysterious error codes on another's (or worse, it fails *in production*!). Docker containers "embed" dependencies in a shareable way that eliminates this problem that has plagued development teams for decades.
- Containerized applications execute according to a standard that ensures the repeatability/reproducibility of the code executing within it. This standard enables an entire ecosystem of methods to deploy your code to production that provides desirable application qualities such as fault tolerance (application restarts automatically after crashes), high service uptime (application is available consistently), observability (you can inspect your application's components through an interface), and more!

Ultimately, the presence of a Dockerfile indicates Docker is in use. It's included in this repository because it facilitates a demonstration of the power of containers. The Dockerfile is responsible for listing the "instructions" to build a Linux filesystem prepped with all dependencies installed appropriately so that your application is ready to go and guaranteed to "just work". In this repo's Dockerfile, all instructions except the last accomplish this goal. Then, the final `CMD` instruction specifies the command necessary to "launch" our application the *official* way.

Pretty useful, eh?

That is, until you need to start running Docker containers at the command line, by hand:

`docker build docker-nodejs-testing`

`docker run docker-nodejs-testing -v .:/usr/src/app -v /usr/src/app/node_modules -e MYSQL_DATABASE=test -p 3000:3000 ...`

Isn't that just a mess?

Luckily, there is a solution.

# Docker Compose

## `docker-compose.yml` - allows specifying Docker behavior via a human readable YAML configuration file

This file allows us to define containerized "services" that can be launched individually like this: `docker compose up {service_name}`

```
services:
  # Development service
  dev:
    build: . 
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
    command: npm run start:development
```

In this snippet, we have defined a service specification running our API server in "development mode" for local development. This means we want our API server to run in a container on the machine we're executing our `docker compose` commands.

We set environment variables that are present at container runtime (and thus read with `process.env` inside our Node code) with the `environment` key-value pair. The `build` key tells Docker Compose where the `Dockerfile` to be used for this service exists. 

You'll notice that we can override the default `CMD` specified in our Dockerfile with the `command: npm run start:development`. This means that this service will instead run the `start:development` run script defined in the `"scripts"` section of our `package.json`.

Crucially, this distinction here is useful because it launches our program via a `nodemon` "dev server" that has a useful trick up its sleeve: as we're writing our new code and saving our changes, `nodemon` listens for file changes and responds by relaunching the web server executing in its container so our changes are automatically reflected as we edit our source files. This speeds up the pace of development and saves us time because you don't need to keep manually restarting your container(s) when making changes to your application's source code.

We'll discuss other configuration details of the `docker-compose.yml` file at a later time, but suffice it to say that this file exists to improve the developer experience when working with Docker containers. Docker Compose is a tool to "orchestrate" containers running on the same "host" machine. This tends to be particularly handy for our application development purposes.

You can start up all services defined in this file at once by typing `docker compose up` into your terminal command prompt (so long as your working directory is the top-level directory of this repo). Similarly, you can bring everything back down with `docker compose down`.

There's obviously more to know than just this, but isn't that a breath of fresh air compared to the lengthy Docker commands shown earlier?

# Integration Tests 

There are many possible approaches to authoring tests. Some common setups are:
- Jest (All in one test runner + assertions)
- Mocha (+ Chai, Sinon, and Istanbul)
- Cypress or Playwright for browser E2E testing

This code repository uses `mocha` + `chai`. What are they for?

## `mocha`

Mocha is a "test runner" library: it is used for ingesting the tests defined in your source files, identifying which of your source files contain tests, and executing your tests while watching for errors... among other things. If you run `npm run test:integration` (or `docker compose up integrationtest`), you'll see the output `mocha` produces:

```
> mocha --spec ./test/integration


  Integration Tests for User API
    GET /api/users
      ✔ should return all users
    POST /api/users
      ✔ should add a new user
```

You can see in `users.test.js` that this test is defined like so (in JavaScript!): 

```js
describe('Integration Tests for User API', () => {
  describe('GET /api/users', () => {
    it('should return all users', (done) => {
      ...
    })
  })

  describe('POST /api/users', () => {
    it('should add a new user', async () => {
      ...
    })
  })
})
```

See how the code closely mirrors the output? That is on purpose! Also, if any tests ***do*** fail, you won't see a ✔ next to the tests that failed. And, what's more... you'll see further error output that can be used to understand why the test may be failing:

```

1) Integration Tests for User API
       POST /api/users
         should add a new user:

      AssertionError: expected {{}} to have status code 400 but got 200
      + expected - actual

      -200 # (This is what we should have seen...)
      +400 # (This is what we observed...)
```

You can thank `mocha` for all this nifty functionality!

## chai

Now, `chai` is what is known as an "assertion library". It is used within the body of our testing code to assert (or verify the truth of) certain expectations that we can make about the way our application code behaves.

In fact, this is a fundamental concept in testing! Abstractly, we tend to define test code according to a special pattern. It is often referred to as "Arrange, Act, and Assert" (and it has many other names):

``` js
// 1) Arrange objects
const a = 1, b = 2;

// 2) Take an action that we want to test
const total = sum(a, b)

// 3) Assert that the effect of the tested logic actually happened
expect(total).equals(3)

```

