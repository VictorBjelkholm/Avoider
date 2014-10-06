var Player = require('./player.js');
var EnemyTower = require('./enemy_tower.js');
var Enemy = require('./enemy.js');
var Score = require('./score.js');

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

Game = function(game) {};
Game.prototype = {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player.create();

    enemy_tower.create();
    enemy_tower.startShooting();

    setInterval(function() {
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

function MainMenu() {
  console.log('Hehe')
}

game.state.add('Preloader', Preload);
game.state.add('MainMenu', MainMenu);
game.state.add('Game', Game);

game.state.start('Preloader');

var towers = [];

var debug = true;

var player = null;

function log(msg) {
  if(debug) {
    console.log(msg)
  }
}

function create() {
}

function update() {
}

function render() {
    game.debug.body(player);
    game.debug.body(enemy_tower);
}
