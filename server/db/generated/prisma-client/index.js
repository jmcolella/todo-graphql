'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const prisma_lib_1 = require('prisma-client-lib');
const { typeDefs } = require('./prisma-schema');

const models = [
  {
    name: 'User',
    embedded: false
  },
  {
    name: 'Todo',
    embedded: false
  }
];

exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: 'http://localhost:5000'
});
exports.prisma = new exports.Prisma();
