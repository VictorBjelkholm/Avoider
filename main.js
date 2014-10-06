(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Enemy = function(game, player, position) {
	this.game = game;
	this.player = player;
	this.position = position;
	this.sprite = null;
}

Enemy.prototype = {
	preload: function() {
		this.game.load.image('enemy', 'assets/enemy.png');
	},
	update: function() {
	},
	create: function() {
    this.sprite = this.game.add.sprite(this.position.x, this.position.y, 'enemy');

    this.game.physics.arcade.enable(this.sprite);

    this.sprite.enableBody = true;

		newPos = {
			x: this.player.sprite.x,
			y: this.player.sprite.y,
		}

    this.game.physics.arcade.moveToObject(this.sprite, newPos, 500);
	}
}

module.exports = Enemy;

},{}],2:[function(require,module,exports){
var Enemy = require('./enemy.js');

var EnemyTower = function(game, player) {
	this.game = game;
	this.player = player;
	this.sprite = null;
}

EnemyTower.prototype = {
	preload: function() {
		this.game.load.image('enemy_tower', 'assets/enemy_tower.png');
	},
	update: function() {
	},
	create: function() {
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'enemy_tower');
	},
	startShooting: function() {
		this.shooting_interval = setInterval(function() {
			enemy = new Enemy(this.game, this.player, this.sprite);
			enemy.create();
		}.bind(this), 1000)
	}
}

module.exports = EnemyTower;

},{"./enemy.js":1}],3:[function(require,module,exports){
var Player = require('./player.js');
var EnemyTower = require('./enemy_tower.js');
var Enemy = require('./enemy.js');


console.log(Player);

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
  update: update,
  preload: preload,
  create: create
});

var debug = true;

var player = null;

function log(msg) {
  if(debug) {
    console.log(msg)
  }
}

function preload() {
  player = new Player(game);
  player.preload();

	enemy_tower = new EnemyTower(game, player);
	enemy_tower.preload();

	enemy = new Enemy(game, player);
	enemy.preload();
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  player.create();

	enemy_tower.create();

	enemy_tower.startShooting();
}

function update() {
  player.update();
	enemy.update();
}

},{"./enemy.js":1,"./enemy_tower.js":2,"./player.js":4}],4:[function(require,module,exports){
var Player = function(game) {
  this.game = game;
  this.sprite = null;
}

Player.prototype = {
  preload: function() {
    this.game.load.image('player', 'assets/player.png');
  },
  update: function() {
    this.sprite.x = this.game.input.mousePointer.worldX;
    this.sprite.y = this.game.input.mousePointer.worldY;
  },
  create: function() {
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');

    this.game.physics.arcade.enable(this.sprite);

    this.sprite.inputEnabled = true;
    this.sprite.enableBody = true;
    this.sprite.body.collideWorldBounds = true;

    this.sprite.anchor.setTo(0.5, 0.5);
  }
}

module.exports = Player;

},{}]},{},[3]);
