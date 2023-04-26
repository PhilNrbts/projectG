//tests/testSingleGame.js

const assert = require('assert');
const SinglePlayerGameController = require('../controllers/singlePlayerGameController');

(async () => {
  try {
    // Test the single-player game flow
    const gameController = new SinglePlayerGameController();

    // Test starting a game
    await gameController.startGame();
    assert(!gameController.isGameFinished());

    // Test the ready status of the player
    gameController.setPlayerReady();
    assert(gameController.allPlayersReady());

    // Test saving round start time
    gameController.saveRoundStartTime();

    // Test getting the current question
    const question = gameController.getCurrentQuestion();
    assert(question);

    // Test submitting an answer (whether correct or incorrect) in a loop until the game is finished
    const answerColor = 'red'; // Replace 'red' with a color depending on the test scenario
    let round = 1;
    while (!gameController.isGameFinished()) {
      const currentQuestion = gameController.getCurrentQuestion();
      const correctAnswer = currentQuestion.answerColor;
      console.log(`Round ${round} correct answer:`, correctAnswer);
      
      const isCorrect = gameController.submitAnswer(answerColor);
      console.log(`Round ${round} answer submitted:`, isCorrect ? 'Correct' : 'Incorrect');
      round++;
    }

    // Check if the game is finished
    assert(gameController.isGameFinished());

    console.log('All tests passed');
  } catch (error) {
    console.error('Error during tests:', error);
  }
})();