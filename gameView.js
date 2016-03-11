var Game = require('./game');
var key = require('./keymaster.js');

function GameView(ctx,game) {
  this.game = game;
  this.ctx = ctx;
  this.ship = this.game.ship;

}
GameView.prototype.start = function() {
  var gameLoop = setInterval(function(renderLose) {
    this.checkKey();
    this.game.step();
    this.game.draw(this.ctx);
    if (this.game.over()){
      console.log('???');
      this.renderLose();
      clearInterval(gameLoop);
     }
  }.bind(this), 20);
  console.log('what');
};

GameView.prototype.renderLose = function () {
  console.log('test');
  this.ctx.fillStyle = 'black';
  this.ctx.rect(0,0,this.game.dimX,this.game.dimY + 50);
  this.ctx.fill();

  this.ctx.font="50px Courier";
  this.ctx.fillStyle = "white";
  this.ctx.fillText('Game Over!', this.game.dimX / 3, this.game.dimY / 2);
  this.ctx.fillText('You scored ' + this.game.points + ' points!', this.game.dimX / 5, this.game.dimY / 2 + 50);

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
