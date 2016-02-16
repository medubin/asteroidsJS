var utils = require ("./utils");


function MovingObject(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
  this.wrappable = true;
}

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0],this.pos[1],this.radius,2*Math.PI,0, true);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};


MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};

MovingObject.prototype.wrap = function () {
  if (this.game.isOutOfBounds(this.pos)) {
    if (this.wrappable) {
      this.pos = this.game.wrap(this.pos);

    } else {
      this.game.remove(this);
    }
  }
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  return utils.distanceBetween(this.pos, otherObject.pos) <
                              (this.radius + otherObject.radius);

};

MovingObject.prototype.collideWith = function (otherObject) {
  // this.game.remove(otherObject);
  // this.game.remove(this);

};

 module.exports = MovingObject;
