var Asteroid = require('./asteroid');
var Ship = require('./ship');
var utils = require ("./utils");
function Game(numAsteroids) {
  this.numAsteroids = numAsteroids;
  this.dimX = 1000;
  this.dimY = 600;
  this.asteroids = [];
  this.addAsteroid();
  this.ship = new Ship({game: this, pos: this.randPosition()});
  this.bullets = [];
}

Game.prototype.addAsteroid = function () {
  for (var i = 0; i < this.numAsteroids; i++) {
    this.asteroids.push(new Asteroid({pos: this.randPosition(), game: this, gen: 0}));
  }
};

Game.prototype.randPosition = function() {
  return [Math.floor(this.dimX * Math.random()),
          Math.floor(this.dimY * Math.random())];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0,0,this.dimX , this.dimY + 50);
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].draw(ctx);
  }
  this.drawBottom(ctx);

};

Game.prototype.drawBottom = function(ctx) {
  ctx.fillStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0,this.dimY);
  ctx.lineTo(this.dimX,this.dimY);
  ctx.stroke();


};


Game.prototype.moveObjects = function() {
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].move();
    this.allObjects()[i].wrap();
  }
};

Game.prototype.wrap = function (pos) {
  var xpos = pos[0] % this.dimX;
  var ypos = pos[1] % this.dimY;
  if (xpos < 0) xpos = this.dimX - 1;
  if (ypos < 0) ypos = this.dimY - 1;

  return [xpos, ypos];
};

Game.prototype.checkCollisons = function () {
  for (var i = this.allObjects().length - 1; i >= 0; i--) {
    for(var j = i - 1; j >= 0; j--){
      if (this.allObjects()[i] && this.allObjects()[j] && this.allObjects()[i].isCollidedWith(this.allObjects()[j])) {
        this.allObjects()[i].collideWith(this.allObjects()[j]);
        if (this.allObjects()[i] && this.allObjects()[j]) {
          this.allObjects()[j].collideWith(this.allObjects()[i]);
        }
      }
    }
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisons();
  this.ship.applyFriction(0.03);
  if (this.ship.bulletCounter > 0) this.ship.bulletCounter -= 1;
};


Game.prototype.remove = function(object) {
  if (object instanceof Asteroid) {
    this.asteroids.splice(this.asteroids.indexOf(object), 1);
  } else if (object.constructor.name === "Bullet") {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  }
};
Game.prototype.allObjects = function() {
  return this.asteroids.concat(this.ship).concat(this.bullets);
};

Game.prototype.isOutOfBounds = function (pos) {
  if ( pos[0] > this.dimX || pos[0] < 0
    || pos[1] > this.dimY || pos[1] < 0)
    return true;

  return false;

};

module.exports = Game;
