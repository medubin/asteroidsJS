  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

var Utils = {
  inherits: function (ChildClass, ParentClass) {
    function Surrogate() {}
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
    ChildClass.prototype.constructor = ChildClass;
  },

  randomVect: function (length) {
    var randX = length * Math.random();
    var randY = Math.sqrt(Math.pow(length, 2) - Math.pow(randX, 2));
    randY = randY * [-1,1][getRandomIntInclusive(0,1)];
    randX = randX * [-1,1][getRandomIntInclusive(0,1)];
    return [randX,randY];
  },

  distanceBetween: function(pos1, pos2) {
    var xDistance = Math.abs(pos1[0] - pos2[0]);
    var yDistance = Math.abs(pos1[1] - pos2[1]);
    var tDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    return tDistance;
  }
};






module.exports = Utils;
