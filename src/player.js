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

    this.sprite.immovable = true;

    this.sprite.anchor.setTo(0.5, 0.5);
  }
}

module.exports = Player;
