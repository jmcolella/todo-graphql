const { ApolloServer } = require('apollo-server-express');

const { prisma } = require('./db/generated/prisma-client');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

module.exports = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req, res) => ({
    ...req,
    ...res,
    prisma
  })
});