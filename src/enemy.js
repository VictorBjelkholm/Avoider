var lightyear = require('lightyear').VMediator;

var Enemy = function(game, player, position) {
    this.game = game;
    this.player = player;
    this.position = position;
    this.sprite = null;
    this.ticks = 40;
}

Enemy.prototype = {
    preload: function() {
	this.game.load.image('enemy', 'assets/enemy.png');
    },
    update: function() {
	if(this.ticks > 0) {
	    newPos = {
		x: this.player.sprite.x,
		y: this.player.sprite.y,
	    }
	    this.game.physics.arcade.moveToObject(this.sprite, newPos, 500);
	    this.ticks = this.ticks - 1;
	}
    },
    onOutOfBounds: function() {
	lightyear.publish('score:update');
    },
    create: function() {
	this.sprite = this.game.add.sprite(this.position.x, this.position.y, 'enemy');

	this.game.physics.arcade.enable(this.sprite);

	this.sprite.enableBody = true;

	this.sprite.checkWorldBounds = true;

	this.sprite.events.onOutOfBounds.add(this.onOutOfBounds, this)
	this.sprite.outOfBoundsKill = true;

	newPos = {
	    x: this.player.sprite.x,
	    y: this.player.sprite.y,
	}
	this.game.physics.arcade.moveToObject(this.sprite, newPos, 500);
    }
}

module.exports = Enemy;
