// models/Game.js

const fs = require('fs');
const { promisify } = require('util');
const { generateQuestionImage } = require('../services/imageService.js');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

class Game {
  constructor(numRounds, players) {
    this.numRounds = numRounds;
    this.players = players;
    this.currentRound = 0;
    this.questionImages = [];
    this.correctAnswers = [];
    this.roundStartTime = [];
    this.roundJitter = [];
    this.activeReadyButton = {};
    this.playerScores = {};
    this.playerAnswers = {};
    this.isStarted = false;
    this.isFinished = false;

    // Initialize the activeReadyButton and roundJitter
    players.forEach((player) => {
      this.activeReadyButton[player] = false;
    });

    for (let i = 0; i < numRounds; i++) {
      this.roundJitter.push(Math.floor(Math.random() * 4) + 3);
    }
  }

  async start() {
    if (this.isStarted || this.isFinished) {
      throw new Error('Game is already started or finished');
    }

    const folderName = `${Date.now()}-${this.numRounds}`;
  const folderPath = `public/question-images/${folderName}`;

  // Create the folder to store the question images (including any missing parent directories)
  await fs.promises.mkdir(folderPath, { recursive: true });

  // Generate question images for all rounds and save them to the folder
  for (let i = 0; i < this.numRounds; i++) {
    const { image, answerColor } = await generateQuestionImage();
    const imageFileName = `q${i + 1}.jpg`;
    const imagePath = `${folderPath}/${imageFileName}`;

    await writeFileAsync(imagePath, image);
    console.log('Image saved:', imagePath);

    this.questionImages.push(`/question-images/${folderName}/${imageFileName}`);
    this.correctAnswers.push(answerColor);
  }

    this.isStarted = true;
  }

  stop() {
    if (!this.isStarted || this.isFinished) {
      throw new Error('Game is not started or already finished');
    }

    this.isStarted = false;
    this.isFinished = true;
  }

  getCurrentQuestion() {
    if (!this.isStarted || this.isFinished) {
      return null;
    }

    return {
      image: this.questionImages[this.currentRound],
      answerColor: this.correctAnswers[this.currentRound]
    };
  }

  submitAnswer(answerColor) {
    if (!this.isStarted || this.isFinished) {
      return false;
    }
  
    const isCorrect = answerColor === this.correctAnswers[this.currentRound];
    
    this.currentRound++; // Move this line outside of the 'if (isCorrect)' block
  
    if (isCorrect) {
      // No need to increment the currentRound here, as it has been moved outside the 'if (isCorrect)' block
    }
  
    if (this.currentRound === this.numRounds) {
      this.stop();
    }
  
    return isCorrect;
  }

  setPlayerReady(player) {
    this.activeReadyButton[player] = true;
  }

  setPlayerNotReady(player) {
    this.activeReadyButton[player] = false;
  }

  allPlayersReady() {
    return Object.values(this.activeReadyButton).every((status) => status);
  }

  saveRoundStartTime() {
    const roundJitterSeconds = this.roundJitter[this.currentRound] * 1000;
    const currentTime = Date.now();
    this.roundStartTime.push(currentTime + roundJitterSeconds + 3000);
  }
}

module.exports = Game;