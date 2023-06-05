// models/Player.js

/**
 * The Player class represents a player in the game.
 */
class Player {
  /**
   * Constructs a new Player instance with the given ID.
   * @param {string} id - The player ID.
   */
  constructor(id) {
    this.id = id;
    this.score = 0;
    this.isReady = false;
  }

  /**
   * Toggles the ready status of the player.
   * @param {boolean} [isReady=!this.isReady] - The new ready status.
   */
  toggleReady(isReady = !this.isReady) {
    this.isReady = isReady;
  }

  /**
   * Increments the player's score by 1.
   */
  incrementScore() {
    this.score++;
  }

  /**
   * Submits an answer for the player and updates their score if the answer is correct.
   * @param {string} answerColor - The submitted answer color.
   * @param {string} correctAnswer - The correct answer color.
   * @returns {boolean} - Whether the submitted answer is correct.
   */
  submitAnswer(answerColor, correctAnswer) {
    const isCorrect = answerColor === correctAnswer;
    if (isCorrect) {
      this.incrementScore();
    }
    return isCorrect;
  }
}

module.exports = Player;