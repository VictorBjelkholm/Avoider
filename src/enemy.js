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
