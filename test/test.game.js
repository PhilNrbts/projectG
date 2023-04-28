const assert = require('assert');
const Game = require('../models/Game');
const Player = require('../models/Player');

describe('Game and Player classes', () => {
  const numRounds = 5;
  const playerIds = ['player1', 'player2'];
  let game;

  beforeEach(() => {
    game = new Game(numRounds, playerIds);
  });

  describe('Player', () => {
    it('should create a new player with given id', () => {
      const player = new Player('player1');
      assert.strictEqual(player.id, 'player1');
    });

    it('should toggle player readiness', () => {
      const player = new Player('player1');
      player.toggleReady();
      assert.strictEqual(player.isReady, true);
    });

    it('should increment player score', () => {
      const player = new Player('player1');
      player.incrementScore();
      assert.strictEqual(player.score, 1);
    });
  });

  describe('Game', () => {
    it('should create a new game with given number of rounds and player ids', () => {
      assert.strictEqual(game.numRounds, numRounds);
      assert.strictEqual(game.players.length, playerIds.length);
    });

    it('should set player as ready and start the game when all players are ready', () => {
      game.setPlayerReady('player1');
      game.setPlayerReady('player2');
      assert(game.allPlayersReady());
      assert.strictEqual(game.roundStartTime.length, 1);
    });

    it('should get player reaction times for a given player id', () => {
      const reactionTimes = game.getPlayerReactionTimes('player1');
      assert.strictEqual(reactionTimes.length, numRounds);
    });
  });
});
