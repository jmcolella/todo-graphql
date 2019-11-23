const { authorizeRequest } = require('../../util/authorize');
const userWithTodos = require('../fragments/userWithTodos');

const Query = {
  user: async(_, __, context) => {
    const authUser = await authorizeRequest(context.req, context.res);

    if (context.req.user.id !== authUser.id) {
      throw Error('You are not authorized to perform that action.!');
    }

    return context.prisma.user({ id: authUser.id }).$fragment(userWithTodos);
  }
};

module.exports = Query;