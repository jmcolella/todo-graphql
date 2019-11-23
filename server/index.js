const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const redisConnect = require('connect-redis');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { prisma } = require('./db/generated/prisma-client');
const apolloServer = require('./apollo');

dotenv.config();

const redisClient = redis.createClient();
const redisStore = redisConnect(session);

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use(session({
  name: process.env.SESSION_NAME,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new redisStore({
    host: 'localhost',
    port: 6379,
    client: redisClient,
    ttl: 86400
  }),
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 1209600000
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async({ id }, done) => {
  const user = await prisma.user({ id });

  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
}, async(username, password, done) => {
  const user = await prisma.user({ email: username });

  if (!user) {
    return done(null, false, { message: 'Incorrect username or password.' });
  }

  const passwordCheck = bcrypt.compareSync(password, user.password);

  if (!passwordCheck) {
    return done(null, false, { message: 'Incorrect username or password.' });
  }

  done(null, user);
}));

passport.use(new JwtStrategy.Strategy({
  jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
}, async(jwtPayload, done) => {
  const user = await prisma.user({ id: jwtPayload.id });

  if (!user) {
    return done(null, false, { message: 'You must be logged in to perform that action.' });
  }

  done(null, user);
}));

app.use(passport.initialize());
app.use(passport.session());

apolloServer.applyMiddleware({ app, path: '/graphql', cors: false });

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});