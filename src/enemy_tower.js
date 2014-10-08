var Enemy = require('./enemy.js');
var lightyear = require('lightyear').VMediator;

var EnemyTower = function(game, player) {
	this.game = game;
	this.player = player;
	this.sprite = null;
	this.shooting_speed = 1000;
	this.bullets = [];
}

EnemyTower.prototype = {
	preload: function() {
	    this.game.load.image('enemy_tower', 'assets/enemy_tower.png');
	},
	remove: function() {
	    this.stopShooting();
	    this.bullets = [];
	},
	update: function() {
	    this.bullets.forEach(function(bullet) {
		bullet.update();
		this.game.physics.arcade.collide(
			this.player.sprite,
			bullet.sprite,
			this.onPlayerCollision,
			null,
			this
		);
	    }.bind(this))
	},
	onPlayerCollision: function(player, enemy) {
	    lightyear.publish('score:player_hit');
	    enemy.kill();
	},
	create: function() {
	    this.sprite = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'enemy_tower');
	},
	shoot: function() {
	    console.log('Shooting!');
	    enemy = new Enemy(this.game, this.player, this.sprite);
	    this.bullets.push(enemy);
	    enemy.create();
	},
	startShooting: function() {
		this.shooting_interval = setTimeout(function() {
			if(this.shooting_speed > 600) {
			    this.shooting_speed -= 100;
			}
			this.shoot();
			this.startShooting();
		}.bind(this), this.shooting_speed)
	},
	stopShooting: function() {
	    clearInterval(this.shooting_interval);
	}
}

module.exports = EnemyTower;
