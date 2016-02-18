/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__ (1);
	var Util = __webpack_require__ (2);
	var Asteroid = __webpack_require__(3);
	var Game = __webpack_require__(6);
	var GameView = __webpack_require__(7);
	var Ship = __webpack_require__(4);


	var canvas = document.getElementById('game-canvas');
	var ctx = canvas.getContext('2d');
	var game = new Game(6);
	var gameView = new GameView(ctx,game);

	canvas.width  = game.dimX;
	canvas.height = game.dimY + 50;

	gameView.start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (2);


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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (2);
	var MovingObject = __webpack_require__ (1);
	var Ship = __webpack_require__(4);
	var Bullet = __webpack_require__(5);

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
	    this.game.points += (40 - RADIUS[this.gen]) * 100;
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (2);
	var MovingObject = __webpack_require__ (1);
	var Bullet = __webpack_require__(5);

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (2);
	var MovingObject = __webpack_require__ (1);
	var Ship = __webpack_require__(4);
	var Asteroid = __webpack_require__(3);

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(3);
	var Ship = __webpack_require__(4);
	var utils = __webpack_require__ (2);
	function Game(numAsteroids) {
	  this.numAsteroids = numAsteroids;
	  this.dimX = 1000;
	  this.dimY = 600;
	  this.asteroids = [];
	  this.addAsteroid();
	  this.ship = new Ship({game: this, pos: this.randPosition()});
	  this.bullets = [];
	  this.points = 0;
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
	  this.drawLives(ctx);
	  this.drawPoints(ctx);

	};

	Game.prototype.drawPoints = function(ctx) {
	  ctx.font="50px Times";
	  ctx.fillStyle = "white";
	  ctx.fillText(this.points,this.dimX - 300, this.dimY + 40);

	};

	Game.prototype.drawBottom = function(ctx) {
	  ctx.fillStyle = 'white';
	  ctx.lineWidth = 1;
	  ctx.beginPath();
	  ctx.moveTo(0,this.dimY);
	  ctx.lineTo(this.dimX,this.dimY);
	  ctx.stroke();
	};

	Game.prototype.drawlife = function(ctx, offset) {
	  ctx.fillStyle = 'rgba(255, 255, 255, 0.0)';
	  ctx.strokeStyle = 'white';
	  ctx.lineWidth = 1;
	  ctx.beginPath();
	  ctx.lineTo(15 + offset,this.dimY + 25);
	  ctx.arc(15 + offset,this.dimY + 25,this.ship.radius,
	      0.6*Math.PI, 1.4*Math.PI, true);
	  ctx.lineTo(15 + offset,this.dimY + 25);
	  ctx.fill();
	  ctx.stroke();
	};

	Game.prototype.drawLives = function(ctx) {
	  for (var i = 0; i < this.ship.lives; i++) {
	    this.drawlife(ctx, i * 25);
	  }
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
	      if (this.objectsCollided(this.allObjects()[i],this.allObjects()[j])) {
	        this.allObjects()[i].collideWith(this.allObjects()[j]);
	      }
	      if (this.objectsCollided(this.allObjects()[j],this.allObjects()[i])){
	        this.allObjects()[j].collideWith(this.allObjects()[i]);
	      }
	    }
	  }
	};

	Game.prototype.objectsCollided = function (obj1, obj2) {
	  return (obj1 && obj2 && obj1.isCollidedWith(obj2));
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(6);
	var key = __webpack_require__(8);

	function GameView(ctx,game) {
	  this.game = game;
	  this.ctx = ctx;
	  this.ship = this.game.ship;

	}
	GameView.prototype.start = function() {
	  setInterval(function() {
	    this.checkKey();
	    this.game.step();
	    this.game.draw(this.ctx);
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ }
/******/ ]);