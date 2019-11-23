const { gql } = require('apollo-server-express');

const query = gql`
  type User {
    id: ID!
    name: String
    email: String
    todos: [Todo!]
  }

  type Todo {
    id: ID!
    body: String
    completed: Boolean
    updatedAt: String
  }

  type Auth {
    user: User!
    token: String!
  }

  type Logout {
    id: ID!
  }

  type Query {
    user: User!
  }
`;

module.exports = query;