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
