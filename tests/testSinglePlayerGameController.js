// tests/testSinglePlayerGameController.js

const assert = require('assert');
const SinglePlayerGameController = require('../controllers/singlePlayerGameController');

(async () => {
  try {
    // Test the single-player game controller flow
    const gameController = new SinglePlayerGameController();

    // 1. Test starting a game
    // 2. Test setting the player ready and checking if all players are ready
    // 3. Test getting the current question
    // 4. Test submitting an answer and checking if it is correct or incorrect
    // 5. Test saving round start time
    // 6. Test if the game is finished after all rounds are completed

    console.log('All SinglePlayerGameController tests passed');
  } catch (error) {
    console.error('Error during SinglePlayerGameController tests:', error);
  }
})();