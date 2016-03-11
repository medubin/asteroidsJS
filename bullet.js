var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Ship = require("./ship");
var Asteroid = require("./asteroid");

var COLOR = "rgba(255, 255, 255, 0.5)";
var RADIUS = 3;
var SPEED = 8;

function Bullet (options) {
  this.pos = options.pos;
  this.game = options.game;
  this.ship = options.ship;
  this.vel = this.initialVelocity();
  this.radius = RADIUS;
  this.color = COLOR;

}
utils.inherits(Bullet, MovingObject);

Bullet.prototype.initialVelocity = function () {
  return [this.ship.vel[0] + SPEED * Math.cos(this.ship.direct),
          this.ship.vel[1] + SPEED * Math.sin(this.ship.direct)];
};

Bullet.prototype.collideWith = function (otherObject) {
};

module.exports = Bullet;
