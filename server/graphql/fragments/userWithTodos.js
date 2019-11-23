const userWithTodos = `
  fragment UserWithTodos on User {
    id
    name
    email
    todos {
      id
      body
      completed
      updatedAt
    }
  }
`;

module.exports = userWithTodos;