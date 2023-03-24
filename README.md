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

