const assert = require('assert');
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const Game = require('../src/Game');

describe('Game', () => {
  describe('#start', () => {
    it('should throw an error if the game is already started or finished', async () => {
      const game = new Game();
      await assert.rejects(() => { game.start(); }, { message: 'Game is already started or finished' });
    });
  });
});

const fs = require('fs').promises; // Import only the promises module
const sinon = require('sinon');
const assert = require('assert');
const Game = require('../models/Game');
const { generateQuestionImage } = require('../services/imageService');

describe('Game', () => {
  const players = ['player1', 'player2'];
  const numRounds = 3;
  let game;

  beforeEach(() => {
    game = new Game(numRounds, players);
  });

  describe('Constructor', () => {
    it('should initialize properties with default values', () => {
      const numPlayers = Object.keys(game.playerScores).length;
      assert.strictEqual(game.numRounds, numRounds);
      assert.deepStrictEqual(game.players, players);
      assert.strictEqual(game.currentRound, 0);
      assert.deepStrictEqual(game.questionImages, []);
      assert.deepStrictEqual(game.correctAnswers, []);
      assert.deepStrictEqual(game.roundStartTime, []);
      assert.deepStrictEqual(game.roundJitter, []); // corrected property name
      assert.deepStrictEqual(numPlayers, players.length);
      assert.strictEqual(game.isStarted, false); // assert.strictEqual only for primitive (non-object) types
      assert.strictEqual(game.isFinished, false); // assert.strictEqual only for primitive (non-object) types
    });
  });

  describe('Method start', () => {
    const fsPromisesMkdirStub = sinon.stub(fs, 'mkdir'); // stub the promises module
    const fsPromisesWriteFileStub = sinon.stub(fs, 'writeFile'); // stub the promises module
    let generateQuestionImageStub;

    beforeEach(() => {
      generateQuestionImageStub = sinon.stub().resolves({
        image: Buffer.from('test-image'),
        answerColor: 'answerColor'
      });
      sinon.stub(generateQuestionImage, 'generateQuestionImage').callsFake(generateQuestionImageStub);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should create the question-images directory and save all question images and return a resolved promise', async () => {
      const expectedFolderPath = `public/question-images/${game.folderName}`;

      fsPromisesMkdirStub.resolves();

      await game.start();

      sinon.assert.calledWith(fsPromisesMkdirStub, sinon.match(expectedFolderPath));
      sinon.assert.callCount(fsPromisesMkdirStub, 1);
      sinon.assert.calledThrice(generateQuestionImageStub);
      sinon.assert.calledWith(fsPromisesWriteFileStub, sinon.match(`public/question-images/${game.folderName}/q1.jpg`), sinon.match.any);
      sinon.assert.calledWith(fsPromisesWriteFileStub, sinon.match(`public/question-images/${game.folderName}/q2.jpg`), sinon.match.any);
      sinon.assert.calledWith(fsPromisesWriteFileStub, sinon.match(`public/question-images/${game.folderName}/q3.jpg`), sinon.match.any);
      sinon.assert.callCount(fsPromisesWriteFileStub, 3);
    });

    it('should throw an error if the game is already started', async () => {
      game.isStarted = true;

      await assert.rejects(() => { game.start(); }, { message: 'Game is already started or finished' });

    });
  });
});