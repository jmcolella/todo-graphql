# Todo GraphQL

A development backend for building a client-side Todo App with GraphQL.

## Context
I'm always interested in trying out different client-side frameworks and languages to build out my engineering toolkit. What is one of the best (ok, maybe not best) ways to do so? That's right, the good ol' Todo App.

In order to understand how these new tools handle server requests, I've had to think about building out a backend infrastructure for each time I want to work on a new framework/language. I decided that I didn't want to recreate that every time, so this project was created.

In short, this is an attempt to create a single, reusable backend service, complete with a persisting datastore, GraphQL API, and user authentication, for learning new client-side tools.


## Getting Started
1. Clone the repository to your local machine
2. Install dependencies
```bash
yarn install
```
3. Ensure you have Docker installed and running
a. Follow instructions for Mac [here](https://docs.docker.com/docker-for-mac/install/) and Windows [here](https://docs.docker.com/docker-for-windows/install/)
4. Install the `prisma` CLI
a. For more information on `prisma`, view [What's included](#whats-included) below
```bash
brew tap prisma/prisma
brew install prisma
```

5. Launch the database with docker-compose
```bash
docker-compose up -d
```
6. Initialize the `prisma` API endpoint
```bash
prisma init --endpoint http://localhost:5000
```
7. Deploy the `prisma` datamodel
```bash
prisma deploy
```
8. Create a `.env` file and configure the following secret values:
a. PORT
b. JWT_SECRET_KEY
c. REFRESH_JWT_SECRET_KEY
d. JWT_TOKEN_EXPIRES
e. REFRESH_JWT_TOKEN_EXPIRES
f. SESSION_SECRET
g. SESSION_NAME
h. CLIENT_URL
i. COOKIE_MAX_AGE
9. Start the server
```bash
yarn start:dev
```

At this point, the server should be running on the `PORT` specified in your configuration.

## API

> `/graphql`

This is the only ednpoint exposed by the server. It is the entry point into the GraphQL schema.

## GraphQL Schema

Please view the following files for the detailed GraphQL schema:
* `./server/graphql/typeDefs/query.js`
* `./server/graphql/typeDefs/mutation.js`


## How to make requests

### Sign up or Log in
In order to query for user data, update user data, or add todos, you **must sign up or login a user to create a session and generate a JWT**.

You **cannot add, update, or delete todos without a logged in user**. This is because a JWT will not be generated unlessa user is in session via signing up or logging in.

After signing up or logging in, the `user` record from the database will be returning along with the JWT. It is **up to you how to manage the JWT client-side for future requests**. Please see the `Auth` GraphQL type to understand this return value structure from signing up or logging in.

### Pass the JWT in headers

The JWT **must be placed in the `Authorization` header of every request**. This is because all user and todo actions check for the JWT in order to authorize the request.

The `Authorization` header must use the `Bearer` designation:
```json
Authorization: Bearer {YOUR_JWT}
```

## What's included?

This backend service uses the following tools:

* [Express](https://expressjs.com/)
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
* [Prisma](https://www.prisma.io/docs)
* [Docker](https://www.docker.com/)
* [PassportJS](http://www.passportjs.org/)
* [JSON Web Token](https://github.com/auth0/node-jsonwebtoken)






