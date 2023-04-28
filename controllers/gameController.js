const Game = require('../models/Game');
const User = require('../models/User');

class GameController {
  constructor(playerIds = [], numRounds = 5) {
    this.game = new Game(numRounds, playerIds);
  }

  async createInDatabase() {
    await this.game.createInDatabase();
  }

  async startGame() {
    await this.game.start();
  }

  async stopGame() {
    this.game.stop();
    await this.game.saveGameHistory();
  }

  getCurrentQuestion() {
    return this.game.getCurrentQuestion();
  }

  async submitAnswer(playerId, answerColor) {
    const isCorrect = this.game.submitAnswer(playerId, answerColor);
    await this.game.updateInDatabase();
    return isCorrect;
  }

  setPlayerReady(playerId) {
    this.game.setPlayerReady(playerId);
  }

  setPlayerNotReady(playerId) {
    this.game.setPlayerNotReady(playerId);
  }

  allPlayersReady() {
    return this.game.allPlayersReady();
  }

  getPlayerReactionTimes(playerId) {
    return this.game.getPlayerReactionTimes(playerId);
  }

  isGameFinished() {
    return this.game.isFinished;
  }
}

// controllers/gameController.js
const createGame = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const numRounds = 5; // You can change this value or get it from req.body

    // Get playerIds from request body or default to the current user
    const playerIds = req.body.playerIds ? req.body.playerIds : [userId];

    const gameControllerInstance = new GameController(playerIds, numRounds);
    await gameControllerInstance.createInDatabase();
    await gameControllerInstance.startGame();

    const gameData = {
      _id: gameControllerInstance.game._id,
      numRounds,
      players: playerIds.map((playerId) => ({ playerId })),
      ...req.body,
      user: userId,
    };

    res.status(201).json({ game: gameData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { createGame };