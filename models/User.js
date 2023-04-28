// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gameHistory: [{
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    roundsPlayed: {
      type: Number,
      required: true
    },
    averageMistakes: {
      type: Number,
      required: true
    },
    averageReactionTime: {
      type: Number,
      required: true
    },
    averageReactionTimeRight: {
      type: Number,
      required: true
    },
    roundsWon: {
      type: Number,
      required: true
    },
    overallPlace: {
      type: Number,
      required: true
    }
  }],
  overallAverageReactionTime: {
    type: Number,
    default: 0
  },
  overallAverageReactionTimeRight: {
    type: Number,
    default: 0
  },
  overallAverageMistakes: {
    type: Number,
    default: 0
  },
  overallRoundsWon: {
    type: Number,
    default: 0
  },
  overallRoundsPlayed: {
    type: Number,
    default: 0
  },
  overallAveragePlace: {
    type: Number,
    default: 0
  }
});

const modelName = 'User';
const UserModel = mongoose.models[modelName] || mongoose.model(modelName, UserSchema);

module.exports = UserModel;
