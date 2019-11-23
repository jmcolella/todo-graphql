const jwt = require('jsonwebtoken');

function refreshJwtSign(data) {
  return jwt.sign(
    data,
    process.env.REFRESH_JWT_SECRET_KEY,
    { expiresIn: process.env.REFRESH_JWT_TOKEN_EXPIRES }
  );
}

module.exports = refreshJwtSign;