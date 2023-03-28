## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

****************************************************************************************************************************************************************

# Project - Create a REST API with NestJS

## Goal

Create a Bookmarks App

## Phase I

### Create the first set of folders and files for the logic

We need some sort of authentication, users and bookmarks. Create folders for each:
  - /auth
  - /bookmark
  - /user

### Create a DB

- make sure you use spaces and not tabs when creating the .yml file
- create a Docker container for our DB use docker compose
- postgres 13
- use this command: 'docker-compose up -d dev-db'

### Install Prisma CLI

- Start by checking prisma.io and getting familiar with the library; then install the CLI and the client
- invoke prisma like this: 'npx prisma'
- setup the prisma project: 'npx prisma init'
- Define the schema for the project

### Populate and connect to the DB

- To create the DB tables run: 'npx prisma migrate dev'
- You can preview the DB by using the following command: 'npx prisma studio'

- TODO: later I can also connect to the DB by using HeidiSQL

### Integrate Prisma

- Create a new module for prisma logic: 'nest g module prisma'
- import in the other modules

***************************************************************************************************************

## Phase II - Modules

### Sign up module 

We need to send the email and password in the POST request.

- add validation to the input
- add a filter to strip out non-existent fields (for example: {email: cat@cat.com, password: 123, id: 1}) where id is not a field in our auth dto, so it will get stripped out before being passed into the API
- add encryption lib to hash the password
- add hashing function to signup method
- update Prisma model so we don't end up with duplicate signups, email should be unique in the db
- use a try/catch block to handle the duplicate email error

### Sign-in module

- Update the auth controller and then complete the method in the auth service
- Find the user by email, compare the password and return the usr, otherwise throw an exception

### Add some npm scripts to handle the dev DB operations

- add some scripts to package.json to automate some of the database operations

### Authentication with Passport (Epress pkg) and JWT

- created a new branch to implement the authentication and user authorization functionality
- install passport and jwt packages
- Implement JWT's for signup and signin methods
- Add a folder: /strategy to implement a jwt strategy

### User Module

- add a useers/me route and some basi logic for testing
- add a NestJS Guard to the route, check for the strategy we are using
- in the validate method inside the jwt.strategy get the user info from the DB
- clean up the user controller by
  - abstracting away the AuthGuard into it's own class, create a new folder 
  - create a custom decorator to GetUser()

*************************************************************************************************************

## Phase III - E2E Testing

We will use Jest as the test runner and Pactum for the requests to test the api.

- setup a Test DB for testing, it will be created and destroyed on every run of the testing suite
- you can also add the --watch flag to the test:e2e script to run the tests every time a new one is added
- and you should also add the --no-cache flag if you do the previous one

- the idead behind this is to emulate our server in the testing suite, we create an instance of the Nest application and make sure it has all the features and options defined in the ./src/main.ts file

### Setup the Testing DB

- add one more db to the docker-compose file
- update the package.json scripts with commands for the test db, should be similar to the ones we have for the dev db
- add npm package 'dotenv-cli' to help prisma manage different environments, in this case dev and test.
- this is beacuse Prisma only grabs the environment variables from the '.env' file
- add 'dotenv -e .env.test -- jest ...' to the e2e testing script
- and also to the test db related scripts

For some reason this script doesn't work: "prisma:test:deploy": "dotenv -e .env.test -- prisma migrate deploy" when I run the command 'npm run prisma:test:deploy', same error with: 'npx prisma:test:deploy'
  - it runs corrently if I write the comand directly on the terminal: 'npx dotenv -e .env.test -- prisma migrate deploy'

- we use a new method in the prisma.service to clar the Db after every test run

- I don't see the need to remove and then re-create the docker container for the Test DB, so I removed that script.


### Write the tests for the Auth Module

- Test Signup and Signin functionality and possible errors.
- use a pactum feature where we can grab and store the access_toekn for a user, so we can use it in other tests: '.stores('nameOfTheVariable', 'access_token'

### Write the tests for the User Module

- write a method to editUsers() and use it in the tests
- cover the possible use cases for the user

### Complete the controller, service and then write the tests for the Bookmark Module

- create a controller and service for the bookmark
- define the routes and implement similar logic to that of the user Module
- write the methods for the bookmarks service
- import these into the controller
- write the logic for the tests
