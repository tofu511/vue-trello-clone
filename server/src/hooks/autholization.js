// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let { boardId } = context.params.query || context.data.boardId;

    if (!boardId) {
      return context;
    }

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
};
