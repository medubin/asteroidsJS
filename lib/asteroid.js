var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Ship = require("./ship");
var Bullet = require("./bullet");

var COLOR = "rgba(255, 255, 255, 0.0)";
var RADIUS = [35, 20, 10];
var SPEED = 2;

function Asteroid (options) {
  this.gen = options.gen;
  this.pos = options.pos;
  this.game = options.game;
  this.vel = options.vel || utils.randomVect(SPEED + (this.gen * 0.5));
  this.radius = RADIUS[this.gen];
  this.color = COLOR;
  this.wrappable = true;
}
utils.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function (otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
  } else if (otherObject instanceof Bullet) {
    this.game.remove(otherObject);
    this.game.remove(this);
    this.split();
  }
};

Asteroid.prototype.split = function () {
  if (this.gen >= RADIUS.length - 1) return;
  for (var i = 0; i < 2; i++) {
    this.game.asteroids.push(new Asteroid({
      pos: [this.pos[0] + i, this.pos[1] + i],
      game: this.game, gen: this.gen + 1,
      vel: utils.randomVect(SPEED + ((this.gen + 1) * 0.5))}));
  }
};

module.exports = Asteroid;
