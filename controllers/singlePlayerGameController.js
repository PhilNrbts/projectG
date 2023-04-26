// singlePlayerGameController.js

const Game = require('../models/Game');

class SinglePlayerGameController {
  constructor() {
    this.game = null;
  }

  async startGame(numRounds = 5) {
    this.game = new Game(numRounds, ['player1']);
    await this.game.start();
  }

  submitAnswer(answerColor) {
    return this.game.submitAnswer(answerColor); // Pass answerColor to the submitAnswer() function
  }
  
  getCurrentQuestion() {
    return this.game.getCurrentQuestion();
  }

  isGameFinished() {
    return this.game.isFinished;
  }

  setPlayerReady() {
    this.game.setPlayerReady('player1');
  }

  setPlayerNotReady() {
    this.game.setPlayerNotReady('player1');
  }

  allPlayersReady() {
    return this.game.allPlayersReady();
  }

  saveRoundStartTime() {
    this.game.saveRoundStartTime();
  }
}

module.exports = SinglePlayerGameController;