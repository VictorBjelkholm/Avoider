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
