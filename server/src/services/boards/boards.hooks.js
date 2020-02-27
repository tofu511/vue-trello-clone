const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      setField({
        from: 'params.user._id',
        as: 'ownerId'
      })
    ],
    get: [
      setField({
        from: 'params.user._id',
        as: 'ownerId'
      })
    ],
    create: [
      setField({
        from: 'params.user._id',
        as: 'ownerId'
      })
    ],
    update: [
      setField({
        from: 'params.user._id',
        as: 'ownerId'
      })
    ],
    patch: [
      setField({
        from: 'params.user._id',
        as: 'ownerId'
      })
    ],
    remove: [
      setField({
        from: 'params.user._id',
        as: 'ownerId'
      })
    ]
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
