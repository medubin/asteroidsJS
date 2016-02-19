var Game = require('./game');
var key = require('./keymaster.js');

function GameView(ctx,game) {
  this.game = game;
  this.ctx = ctx;
  this.ship = this.game.ship;

}
GameView.prototype.start = function() {
  var gameLoop = setInterval(function() {
    this.checkKey();
    this.game.step();
    this.game.draw(this.ctx);
    if (this.game.over()) clearInterval(gameLoop);
  }.bind(this), 20);
};

GameView.prototype.checkKey = function () {

  if (key.isPressed('right')) {
    this.ship.turn(Math.PI/32);
  }
  if (key.isPressed('up')) {
    this.ship.power(0.3);
  }
  if (key.isPressed('left')) {
    this.ship.turn(-Math.PI/32);
  }
  if (key.isPressed('space')) {
    this.ship.fireBullet();
  }
};

module.exports = GameView;
