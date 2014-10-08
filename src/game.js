var Player = require('./player.js');
var EnemyTower = require('./enemy_tower.js');
var Enemy = require('./enemy.js');
var Score = require('./score.js');
var VMediator = require('lightyear')
var lightyear = require('lightyear').VMediator;

var Avoider = function(game) {
  this.game = game;
}

Avoider.prototype = {
  preload: function() {
    console.log('Loading')
  },
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
};

Preload = function(game) {};
Preload.prototype = {
	preload: function() {
		player = new Player(game);
		player.preload();

		enemy_tower = new EnemyTower(game, player);
		enemy_tower.preload();

		enemy = new Enemy(game, player);
		enemy.preload();

		score = new Score(game);

		this.game.load.image('button_start', 'assets/button_start.png');
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};

MainMenu = function(game) {};
MainMenu.prototype = {
  create: function() {
  var style = { font: "34px Arial", fill: "#ff0044", align: "left" };
  var text = "Avoid the lame red circles\nAlways have a score above -10\n\nYou have 100 seconds to show\nwho is the best at avoiding stuff"
   this.game.add.text(10, 10, text, style);
    this.startButton = this.game.add.button(
	this.game.world.centerX,
	this.game.world.centerY,
	'button_start',
	this.startGame,
	this, 1, 0, 2);
  },
  startGame: function() {
    this.game.state.start('Game');
  }
}

ScoreState = function(game) {};
ScoreState.prototype = {
  create: function() {
    var score = "Something";
    var seconds = 40;
    lightyear.subscribe('scorestate:update', function(details) {
      var style = { font: "34px Arial", fill: "#ff0044", align: "left" };
      var text = "You got the score " + details.score + " after " + details.seconds + " seconds.";
      this.game.add.text(10, 10, text, style);
    }.bind(this));

    clearInterval(towerInterval)
    lightyear.publish('score:stop');
    towers.forEach(function(tower) {
      tower.remove();
    });

    lightyear.resetChannels();


    towers = [];

    this.startButton = this.game.add.button(
	this.game.world.centerX,
	this.game.world.centerY,
	'button_start',
	this.startGame,
	this, 1, 0, 2
    );
  },
  startGame: function() {
    this.game.state.start('Game');
  }
}

var towers = [];
var towerInterval = null;
Game = function(game) {};
Game.prototype = {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player.create();

    first_tower = new EnemyTower(game, player);
    first_tower.create();
    first_tower.startShooting();
    towers.push(first_tower)

    towerInterval = setInterval(function() {
      tower = new EnemyTower(game, player);
      tower.create();
      tower.startShooting();
      towers.push(tower)
    }, 20000)

    score.create();
  },
  update: function() {
    player.update();
    enemy_tower.update();
    towers.forEach(function(tower) {
      tower.update();
    });
  }
}


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
var avoider = new Avoider(game);

game.state.add('Preloader', Preload);
game.state.add('MainMenu', MainMenu);
game.state.add('ScoreState', ScoreState);
game.state.add('Game', Game);

game.state.start('Preloader');


var player = null;
