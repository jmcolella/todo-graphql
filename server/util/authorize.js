const passport = require('passport');
const refreshToken = require('./refreshToken');

const authorizeRequest = (req, res) =>
  new Promise(
    (resolve) =>
      passport.authenticate('jwt', (_, authUser, error) => {
        if (error) {
          throw error;
        }

        return resolve(authUser);
      })(req, res)
  ).then((user) => {
    if (!user) {
      throw Error('You must be logged in to perform that action');
    }

    return user;
  }).catch((error) => refreshToken(req, res, error));

module.exports = {
  authorizeRequest,
};