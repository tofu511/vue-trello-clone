const { authenticate } = require('@feathersjs/authentication').hooks;
const mongoose = require('mongoose');

const isBoardOwner = async (context) => {
  const { boardId } = context.params.query;
  const { _id } = context.params.user._id;
  const boards = mongoose.model('boards');
  const board = await boards.findOne({ _id: boardId });

  if (board) {
    if (board.ownerId.toString() === _id.toString()) {
      return context;
    } else {
      throw new Error('Un-Authorized');
    }
  }
  return context;
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ isBoardOwner ],
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
