const bcrypt = require('bcrypt');
const passport = require('passport');
const jwtSign = require('../../util/jwtSign');
const refreshJwtSign = require('../../util/refreshJwtSign');

const { authorizeRequest } = require('../../util/authorize');

const Mutation = {
  user: () => ({
    signup: async({ input }, context) => {
      const hashedPassword = bcrypt.hashSync(
        input.password,
        10
      );

      const user = await context.prisma.createUser({
        name: input.name,
        email: input.email,
        password: hashedPassword,
      });

      if (!user) {
        throw Error('Error trying to sign up, please try again');
      }

      context.req.login(user, (err) => {
        if (err) {
          throw Error('Error trying to sign up, please try again');
        }
      });

      const token = jwtSign({ id: user.id });

      context.res.cookie('todo_jwt', token);
      context.res.cookie('todo_refresh_jwt', refreshJwtSign({ id: user.id }), {
        httpOnly: true,
      });

      return {
        user,
        token,
      };
    },
    login: async({ input }, context) => {
      const authOptions = {
        email: input.email,
        password: input.password
      };

      const user = await new Promise(
        (resolve, reject) => passport.authenticate('local', (err, authUser) => {
          if (err) {
            return reject(err);
          }

          return resolve(authUser);
        })(
          { ...context.req, body: { ...context.req.body, ...authOptions } },
          context.res
        )
      );

      if (!user) {
        throw Error('Error trying to login, please try again');
      }

      context.req.login(user, (err) => {
        if (err) {
          throw Error('Error trying to login, please try again');
        }
      });

      const token = jwtSign({ id: user.id });

      context.res.cookie('todo_jwt', token);
      context.res.cookie('todo_refresh_jwt', refreshJwtSign({ id: user.id }), {
        httpOnly: true,
      });

      return {
        user,
        token,
      };
    },
    logout: ({ input }, context) => {
      context.req.logout();

      context.res.clearCookie('todo_jwt');
      context.res.clearCookie('todo_refresh_jwt', { httpOnly: true });
      context.res.clearCookie('todo_app', { httpOnly: true });

      return {
        id: input.id
      };
    },
  }),
  todo: () => ({
    add: async({ input }, context) => {
      const user = await authorizeRequest(context.req, context.res);

      if (input.userId !== user.id) {
        throw Error('You are not authorized to perform that action.!');
      }

      const newTodo = await context.prisma.createTodo({
        body: input.body,
        user: {
          connect: { id: input.userId }
        }
      });

      if (!newTodo) {
        throw Error('Error creating the todo');
      }

      return newTodo;
    },
    update: async({ input }, context) => {
      const user = await authorizeRequest(context.req, context.res);

      if (input.userId !== user.id) {
        throw Error('You are not authorized to perform that action.!');
      }

      const foundTodoUserId = await context.prisma.todo({ id: input.id }).user().id();

      if (foundTodoUserId !== user.id) {
        throw Error('You are not authorized to perform that action.!');
      }

      const updatedTodo = await context.prisma.updateTodo({
        data: { body: input.body },
        where: { id: input.id }
      });

      if (!updatedTodo) {
        throw Error('Error updating the todo');
      }

      return updatedTodo;
    },
    delete: async({ input }, context) => {
      const user = await authorizeRequest(context.req, context.res);

      if (input.userId !== user.id) {
        throw Error('You are not authorized to perform that action.!');
      }

      const foundTodoUserId = await context.prisma.todo({ id: input.id }).user().id();

      if (foundTodoUserId !== user.id) {
        throw Error('You are not authorized to perform that action.!');
      }

      const deletedTodo = await context.prisma.deleteTodo({
        id: input.id,
      });

      if (!deletedTodo) {
        throw Error('Error deleting the todo');
      }

      return deletedTodo;
    },
  })
};

module.exports = Mutation;