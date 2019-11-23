const jwt = require('jsonwebtoken');
const { prisma } = require('../db/generated/prisma-client');
const jwtSign = require('./jwtSign');

const refreshToken = async(req, res, error) => {
  if (error.name === 'TokenExpiredError') {
    const refreshJwtCookie = req.cookies.todo_refresh_jwt;
    const refreshJwtPayload = jwt.verify(refreshJwtCookie, process.env.REFRESH_JWT_SECRET_KEY);

    const user = await prisma.user({ email: refreshJwtPayload.email });

    const token = jwtSign({ id: user.id });

    res.cookie('todo_jwt', token);

    return user;
  }
};

module.exports = refreshToken;