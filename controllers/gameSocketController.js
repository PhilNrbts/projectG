// controllers/gameSocketController.js

const GameController = require('./gameController');

class GameSocketController extends GameController {
  constructor(numRounds = 5, playerIds, socket) {
    super(numRounds, playerIds);
    this.socket = socket;
    this.game.createInDatabase();
  }

  async startGame() {
    await super.startGame();
    this.sendCurrentQuestion();
  }

  sendCurrentQuestion() {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      this.socket.emit('question', currentQuestion);
    } else {
      this.socket.emit('game-finished');
    }
  }

  async submitAnswer(playerId, answerColor) {
    const isCorrect = super.submitAnswer(playerId, answerColor);
    await this.game.updateInDatabase(); // Add this line
    this.sendCurrentQuestion();
    return isCorrect;
  }  
}

module.exports = GameSocketController;