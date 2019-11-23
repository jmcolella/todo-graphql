const jwt = require('jsonwebtoken');

function jwtSign(data) {
  return jwt.sign(
    data,
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_TOKEN_EXPIRES }
  );
}

module.exports = jwtSign;