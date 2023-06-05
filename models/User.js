const userDB = require('../database/userDB');

const UserModel = {
  find: function (query, callback) {
    userDB.find(query, callback);
  },

  findOne: function (query, callback) {
    userDB.findOne(query, callback);
  },

  create: function (data, callback) {
    userDB.insert(data, callback);
  },

  update: function (query, update, options, callback) {
    userDB.update(query, update, options, callback);
  },

  remove: function (query, options, callback) {
    userDB.remove(query, options, callback);
  },
};

module.exports = UserModel;