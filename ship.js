var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Bullet = require("./bullet");

var COLOR = "rgba(255, 255, 255, 0.0)";
var RADIUS = 15;
var SPEED = [0,0];
var DIRECTION = 0;


function Ship (options) {
  this.game = options.game;
  this.vel = SPEED;
  this.radius = RADIUS;
  this.color = COLOR;
  this.pos = options.pos;
  this.direct = 0;
  this.wrappable = true;
  this.bulletCounter = 20;
  this.lives = 3;

}
utils.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.vel = [0,0];
  this.pos = this.game.randPosition();
  this.lives--;

};
Ship.prototype.MAX_VELOCITY = 10;
Ship.prototype.power = function (impulse) {
  var xVel = impulse * Math.cos(this.direct) + this.vel[0];
  var yVel = impulse * Math.sin(this.direct) + this.vel[1];

  this.vel = [
   xVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : xVel,
   yVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : yVel
 ];

};



Ship.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.lineTo(this.pos[0],this.pos[1]);
  ctx.arc(this.pos[0],this.pos[1],this.radius,this.direct +
      0.6*Math.PI,this.direct + 1.4*Math.PI, true);
  ctx.lineTo(this.pos[0],this.pos[1]);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};

Ship.prototype.turn = function (angle) {
  this.direct += angle;
};

Ship.prototype.fireBullet = function () {
  if (this.bulletCounter !== 0) return;
  var bullet = new Bullet({pos: this.pos.slice(),
                          game: this.game,
                          ship: this,
                          vel: this.vel});
  this.game.bullets.push(bullet);
  this.bulletCounter += 20;


};

Ship.prototype.applyFriction = function (factor) {
  this.vel[0] -= this.vel[0] * factor;
  this.vel[1] -= this.vel[1] * factor;

};




module.exports = Ship;
