// models/GameSchema.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * The schema for the Game model.
 */
const GameSchema = new mongoose.Schema({
  numRounds: {
    type: Number,
    required: true,
  },
  players: {
    type: [String],
    required: true,
  },
  currentRound: {
    type: Number,
    required: true,
  },
  questionImages: {
    type: [String],
    required: true,
  },
  correctAnswers: {
    type: [String],
    required: true,
  },
  roundStartTime: {
    type: [Number],
    required: true,
  },
  roundJitter: {
    type: [Number],
    required: true,
  },
  isStarted: {
    type: Boolean,
    required: true,
  },
  isFinished: {
    type: Boolean,
    required: true,
  },
  reactionTimes: {
    type: [[Number]],
    required: true,
  },
  givenAnswers: {
    type: [[String]],
    required: true,
  },
  correctAnswersMatrix: {
    type: [[Boolean]],
    required: true,
  },
  totalPoints: {
    type: [[Number]],
    required: true,
  },
});

const modelName = 'Game';
const GameModel = mongoose.models[modelName] || mongoose.model(modelName, GameSchema);

module.exports = GameModel;