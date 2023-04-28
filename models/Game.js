// models/Game.js
const fs = require('fs');
const { promisify } = require('util');
const { generateQuestionImage } = require('../services/imageService.js');
const Player = require('./Player.js');
const GameModel = require('./GameSchema');
const GameHistory = require('./GameHistory');
const User = require('./User');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

class Game {
  constructor(numRounds, playerIds) {
    this.numRounds = numRounds;
    this.players = playerIds.map(id => new Player(id));
    this.currentRound = 0;
    this.questionImages = [];
    this.correctAnswers = [];
    this.roundStartTime = [];
    this.roundJitter = [];
    this.isStarted = false;
    this.isFinished = false;
    this.reactionTimes = Array.from({ length: numRounds }, () =>
      playerIds.map(() => 0)
    );
    for (let i = 0; i < numRounds; i++) {
      this.roundJitter.push(Math.floor(Math.random() * 4) + 3);
    }
    this.givenAnswers = Array.from({ length: numRounds }, () =>
      playerIds.map(() => null)
    );
    for (let i = 0; i < numRounds; i++) {
      this.roundJitter.push(Math.floor(Math.random() * 4) + 3);
    }
    this.correctAnswersMatrix = Array.from({ length: numRounds }, () =>
      playerIds.map(() => false)
    );

    this.totalPoints = this.players.map(player => player.score);

  }

  async createInDatabase() {
    const gameData = {
      numRounds: this.numRounds,
      players: this.players.map(player => player.id),
      currentRound: this.currentRound,
      questionImages: this.questionImages,
      correctAnswers: this.correctAnswers,
      roundStartTime: this.roundStartTime,
      roundJitter: this.roundJitter,
      isStarted: this.isStarted,
      isFinished: this.isFinished,
      reactionTimes: this.reactionTimes,
      givenAnswers: this.givenAnswers,
      correctAnswersMatrix: this.correctAnswersMatrix,
      totalPoints: this.totalPoints,
    };

    const gameDoc = new GameModel(gameData);
    await gameDoc.save();
    this._id = gameDoc._id;
  }

  async updateInDatabase() {
    const gameData = {
      numRounds: this.numRounds,
      players: this.players.map(player => player.id),
      currentRound: this.currentRound,
      questionImages: this.questionImages,
      correctAnswers: this.correctAnswers,
      roundStartTime: this.roundStartTime,
      roundJitter: this.roundJitter,
      isStarted: this.isStarted,
      isFinished: this.isFinished,
      reactionTimes: this.reactionTimes,
      givenAnswers: this.givenAnswers,
      correctAnswersMatrix: this.correctAnswersMatrix,
      totalPoints: this.totalPoints,
    };

    await GameModel.findByIdAndUpdate(this._id, gameData);
  }

  async start() {
    if (this.isStarted || this.isFinished) {
      throw new Error('Game is already started or finished');
    }

    const folderName = `${Date.now()}-${this.numRounds}`;
    const folderPath = `public/question-images/${folderName}`;

    await mkdirAsync(folderPath, { recursive: true });

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
    this.gameEnd = Date.now(); // Add this line to save the game end timestamp
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

  submitAnswer(playerId, answerColor) {
    if (!this.isStarted || this.isFinished) {
      return false;
    }
  
    const player = this.players.find(p => p.id === playerId);
    const playerIndex = this.players.findIndex(p => p.id === playerId);
  
    const isCorrect = player.submitAnswer(answerColor, this.correctAnswers[this.currentRound]);
    const reactionTime = Date.now() - this.roundStartTime[this.currentRound];
    this.reactionTimes[this.currentRound][playerIndex] = reactionTime;
  
    this.currentRound++;
  
    if (this.currentRound === this.numRounds) {
      this.stop();
    }
  
    return isCorrect;
  }

  setPlayerReady(playerId) {
    const player = this.players.find(p => p.id === playerId);
    player.toggleReady();

    if (this.allPlayersReady()) {
      this.saveRoundStartTime();
    }
  }
  setPlayerNotReady(playerId) {
    const player = this.players.find(p => p.id === playerId);
    player.toggleReady(false); // Assuming 'toggleReady' accepts a boolean parameter
  }
  
  allPlayersReady() {
    return this.players.every(player => player.isReady);
  }

  saveRoundStartTime() {
    const roundJitterSeconds = this.roundJitter[this.currentRound] * 1000;
    const currentTime = Date.now();
    this.roundStartTime.push(currentTime + roundJitterSeconds + 3000);
  }

  getPlayerReactionTimes(playerId) {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    return this.reactionTimes.map(round => round[playerIndex]);
  }
  async saveGameHistory() {
    if (!this.isFinished) {
      throw new Error('Game is not finished');
    }

    // Fetch the game data from the database using GameSchema
    const gameData = await GameModel.findById(this._id);

    // Calculate the winners
    const maxPoints = Math.max(...this.totalPoints);
    const winners = this.players
      .filter((player, index) => this.totalPoints[index] === maxPoints)
      .map(player => player.id);

    // Calculate playerStats
    const playerStats = this.players.map((player, index) => {
      const playerReactionTimes = this.reactionTimes.map(round => round[index]);
      const playerCorrectAnswers = this.correctAnswersMatrix.map(round => round[index]);
      const correctAnswersCount = playerCorrectAnswers.filter(answer => answer).length;

      const percentCorrect = (correctAnswersCount / this.numRounds) * 100;
      const avgReactionTime = playerReactionTimes.reduce((a, b) => a + b, 0) / this.numRounds;
      const avgReactionTimeCorrect = playerReactionTimes
        .filter((_, i) => playerCorrectAnswers[i])
        .reduce((a, b) => a + b, 0) / correctAnswersCount;

      return {
        playerID: player.id,
        percentCorrect,
        avgReactionTime,
        avgReactionTimeCorrect,
      };
    });

    // Transform the game data into the format required by gameHistorySchema
    const gameHistoryData = {
      numRounds: gameData.numRounds,
      players: gameData.players,
      reactionTimes: gameData.reactionTimes,
      correctAnswers: this.correctAnswersMatrix,
      winners,
      playerStats,
    };

    // Create and save the game history
    const gameHistory = new GameHistory(gameHistoryData);
    await gameHistory.save();

    // Update the user records
    for (const player of this.players) {
      const user = await User.findById(player.id);
      if (user) {
        // Find the player's stats
        const playerStat = playerStats.find(stat => stat.playerID === player.id);

        // Calculate the new overall statistics
        const totalRoundsPlayed = user.overallRoundsPlayed + this.numRounds;
        const totalRoundsWon = user.overallRoundsWon + (winners.includes(player.id) ? 1 : 0);
        const totalMistakes = user.overallAverageMistakes * user.overallRoundsPlayed + (this.numRounds - playerStat.percentCorrect * this.numRounds / 100);
        const totalReactionTime = user.overallAverageReactionTime * user.overallRoundsPlayed + playerStat.avgReactionTime * this.numRounds;
        const totalReactionTimeRight = user.overallAverageReactionTimeRight * user.overallRoundsPlayed + playerStat.avgReactionTimeCorrect * this.numRounds;

        // Update the user's game history and overall statistics
        user.gameHistory.push({
          gameId: this._id,
          roundsPlayed: this.numRounds,
          averageMistakes: (this.numRounds - playerStat.percentCorrect * this.numRounds / 100),
          averageReactionTime: playerStat.avgReactionTime,
          averageReactionTimeRight: playerStat.avgReactionTimeCorrect,
          roundsWon: winners.includes(player.id) ? 1 : 0,
          overallPlace: winners.indexOf(player.id) + 1
        });

        // Update the overall statistics
        user.overallRoundsPlayed = totalRoundsPlayed;
        user.overallRoundsWon = totalRoundsWon;
        user.overallAverageMistakes = totalMistakes / totalRoundsPlayed;
        user.overallAverageReactionTime = totalReactionTime / totalRoundsPlayed;
        user.overallAverageReactionTimeRight = totalReactionTimeRight / totalRoundsPlayed;
        user.overallAveragePlace = (user.overallAveragePlace * user.overallRoundsPlayed + winners.indexOf(player.id) + 1) / (user.overallRoundsPlayed + this.numRounds);

        await user.save();
      }
    }
  }
}

module.exports = Game;