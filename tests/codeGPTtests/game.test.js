const Game = require('../models/Game');
const Player = require('../models/Player');

describe('Game class', () => {
  let game;
  const numRounds = 3;
  const playerIds = ['player1', 'player2', 'player3'];
  const mockImageService = {
    generateQuestionImage: jest.fn(() => ({
      image: 'mock-image',
      answerColor: 'mock-color',
    })),
  };

  beforeEach(() => {
    game = new Game(numRounds, playerIds);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should have correct initial properties', () => {
      expect(game.numRounds).toBe(numRounds);
      expect(game.players).toHaveLength(3);
      game.players.forEach(player => {
        expect(player).toBeInstanceOf(Player);
      });
      expect(game.currentRound).toBe(0);
      expect(game.questionImages).toHaveLength(0);
      expect(game.correctAnswers).toHaveLength(0);
      expect(game.roundStartTime).toHaveLength(0);
      expect(game.roundJitter).toHaveLength(3);
      expect(game.isStarted).toBe(false);
      expect(game.isFinished).toBe(false);
      expect(game.reactionTimes).toHaveLength(3);
      game.reactionTimes.forEach(round => {
        expect(round).toHaveLength(3);
        expect(round.every(item => item === 0)).toBe(true);
      });
    });
  });

  describe('start method', () => {
    test('should create question images and set isStarted to true', async () => {
      await game.start(mockImageService);
      expect(mockImageService.generateQuestionImage).toBeCalledTimes(3);
      expect(game.questionImages).toHaveLength(3);
      expect(game.correctAnswers).toHaveLength(3);
      expect(game.isStarted).toBe(true);
    });

    test('should throw error if game is already started or finished', async () => {
      game.isStarted = true;
      await expect(game.start(mockImageService)).rejects.toThrow();
      game.isStarted = false;
      game.isFinished = true;
      await expect(game.start(mockImageService)).rejects.toThrow();
    });
  });

  describe('stop method', () => {
    test('should set isStarted to false and isFinished to true', () => {
      game.isStarted = true;
      game.stop();
      expect(game.isStarted).toBe(false);
      expect(game.isFinished).toBe(true);
    });

    test('should throw error if game is not started or already finished', () => {
      expect(() => game.stop()).toThrow();
      game.isFinished = true;
      expect(() => game.stop()).toThrow();
    });
  });

  describe('getCurrentQuestion method', () => {
    test('should return null if game is not started or already finished', () => {
      expect(game.getCurrentQuestion()).toBe(null);
      game.isStarted = true;
      game.isFinished = true;
      expect(game.getCurrentQuestion()).toBe(null);
    });

    test('should return an object with image and answerColor properties', () => {
      game.isStarted = true;
      const question = game.getCurrentQuestion();
      expect(question).toHaveProperty('image');
      expect(question).toHaveProperty('answerColor');
    });
  });

  describe('submitAnswer method', () => {
         test('should return false if game is not started or already finished', () => {
           expect(game.submitAnswer('player1', 'mock-color')).toBe(false);
           game.isStarted = true;
           game.isFinished = true;
           expect(game.submitAnswer('player1', 'mock-color')).toBe(false);
         });
       
         test('should increment player score and return true if answer is correct', () => {
           game.isStarted = true;
           game.correctAnswers = ['mock-color', 'mock-color', 'mock-color'];
           const result = game.submitAnswer('player1', 'mock-color');
           expect(result).toBe(true);
         });
       });
}); 