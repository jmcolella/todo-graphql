const { gql } = require('apollo-server-express');

const mutation = gql`
  type Mutation {
    user: UserMutation
    todo: TodoMutation
  }

  type UserMutation {
    signup(input: UserSignupInput!): Auth!
    login(input: UserLoginInput!): Auth!
    logout(input: UserLogoutInput!): Logout!
  }
  
  type TodoMutation {
    add(input: TodoAddInput!): Todo!
    update(input: TodoUpdateInput!): Todo!
    delete(input: TodoDeleteInput!): Todo!
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  input UserSignupInput {
    name: String!
    email: String!
    password: String!
  }

  input UserLogoutInput {
    id: ID!
  }

  input TodoAddInput {
    body: String!
    userId: ID!
  }

  input TodoUpdateInput {
    id: ID!
    body: String!
    userId: ID!
  }

  input TodoDeleteInput {
    id: ID!
    userId: ID!
  }
`;

module.exports = mutation;