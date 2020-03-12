const { authenticate } = require('@feathersjs/authentication').hooks;
const isBoardOwner = require('../../hooks/autholization');

module.exports = {
  before: {
    all: [ authenticate('jwt'), isBoardOwner() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
