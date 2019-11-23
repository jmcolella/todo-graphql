const { gql } = require('apollo-server-express');
const query = require('./query');
const mutation = require('./mutation');

const typeDefs = gql`
  ${query}
  
  ${mutation}
`;

module.exports = typeDefs;