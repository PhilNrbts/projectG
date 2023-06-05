const Datastore = require('nedb');
const path = require('path');

const gameHistoryDB = new Datastore({ filename: path.join(__dirname, '../data/gameHistory.db'), autoload: true });
const gameSchemaDB = new Datastore({ filename: path.join(__dirname, '../data/gameSchema.db'), autoload: true });
const userDB = new Datastore({ filename: path.join(__dirname, '../data/user.db'), autoload: true });

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

module.exports = {
  gameHistoryDB,
  gameSchemaDB,
  userDB,
  UserModel,
};