var MovingObject = require ("./movingObject");
var Util = require ("./utils");
var Asteroid = require("./asteroid");
var Game = require("./game");
var GameView = require("./gameView");
var Ship = require("./ship");


var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');
var game = new Game(6);
var gameView = new GameView(ctx,game);

canvas.width  = game.dimX;
canvas.height = game.dimY + 50;

gameView.start();
