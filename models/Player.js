// models/Player.js
class Player {
  constructor(id) {
    this.id = id;
    this.score = 0;
    this.isReady = false;
  }

  toggleReady(isReady = !this.isReady) {
    this.isReady = isReady;
  }

  incrementScore() {
    this.score++;
  }

  submitAnswer(answerColor, correctAnswer) {
    const isCorrect = answerColor === correctAnswer;
    if (isCorrect) {
      this.incrementScore();
    }
    return isCorrect;
  }
}

module.exports = Player;