// models/GameHistory.js

const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  gameID: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  players: {
    type: [String],
    required: true
  },
  roundsPlayed: {
    type: Number,
    required: true
  },
  jitter: {
    type: [Number],
    required: true
  },
  correctColors: {
    type: [String],
    required: true
  },
  reactionTimes: {
    type: [[Number]],
    required: true
  },
  correctAnswers: {
    type: [[Boolean]],
    required: true
  },
  winners: {
    type: [String],
    required: true
  },
  playerStats: {
    type: [{
      playerID: {
        type: String,
        required: true
      },
      percentCorrect: {
        type: Number,
        required: true
      },
      avgReactionTime: {
        type: Number,
        required: true
      },
      avgReactionTimeCorrect: {
        type: Number,
        required: true
      }
    }],
    required: true
  }
});

const modelName = 'GameHistory';
const GameHistoryModel = mongoose.models[modelName] || mongoose.model(modelName, gameHistorySchema);

module.exports = GameHistoryModel;