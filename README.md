#Asteroids written in Javascript
*Javascript, canvas, HTML*
The classic arcade game remade for your browser.
[Click here to play](http://medubin.github.io/asteroidsJS/)

##Features
- Keeps track of current score.
- Full range of ship rotation
- Ship accelerates in given direction, adding impulse to its current velocity.
- Limited number of lives

##Implementation Details

###Asteroids, the ship and bullets all extend the moving object class.
Inheritance is set up using an inherits utility function:

 inherits: function (ChildClass, ParentClass) {
   function Surrogate() {}
   Surrogate.prototype = ParentClass.prototype;
   ChildClass.prototype = new Surrogate();
   ChildClass.prototype.constructor = ChildClass;
 }

###The game iterates over all objects to check for collisions and to draw on the canvas.
For every frame objects positions are checked, and if any two objects centerpoints closer than their combined radii, their internal collision logic fires:

  Game.prototype.checkCollisons = function () {
    for (var i = this.allObjects().length - 1; i >= 0; i--) {
      for(var j = i - 1; j >= 0; j--){
        if (this.objectsCollided(this.allObjects()[i],this.allObjects()[j])) {
          this.allObjects()[i].collideWith(this.allObjects()[j]);
        }
        if (this.objectsCollided(this.allObjects()[j],this.allObjects()[i])){
          this.allObjects()[j].collideWith(this.allObjects()[i]);
        }
      }
    }
  };


###All objects are circles, so collision detection is done by distance between two object centerpoints.
Objects radii are added together and checked against the distance between two objects:

  MovingObject.prototype.isCollidedWith = function(otherObject) {
    return utils.distanceBetween(this.pos, otherObject.pos) < (this.radius + otherObject.radius);
  };

###Thrust is generated in the direction the ship is facing.
  Impulse is provided by the up key, which then adds to the ships current velocity:

  Ship.prototype.power = function (impulse) {
    var xVel = impulse * Math.cos(this.direct) + this.vel[0];
    var yVel = impulse * Math.sin(this.direct) + this.vel[1];

    this.vel = [
     xVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : xVel,
     yVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : yVel
   ];

  };


##Gameplay photos

###Gameplay
  ![Gameplay](/Screenshots/gameplay.png)

###Game over
  ![Game Over](/Screenshots/gameover.png)


##Todo
- Make splash screen
- restart game when losing
- validate that new life doesn't begin on an asteroid
- Persistent high scores
