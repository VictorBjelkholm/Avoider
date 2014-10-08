(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var VAction;

VAction = (function() {
  VAction.prototype.type = null;
  VAction.prototype.namespace = null;
  VAction.prototype.action = null;
  VAction.prototype.fullName = null;
  VAction.prototype.el = null;

  function VAction(el, fullName) {
    var self = this;
    this.el = el;
    this.fullName = fullName;

    var argArr = this.fullName.split(':');
    if(argArr.length !== 3) {
      throw new Error("You need type:namespace:action to create an action");
    }
    this.type = argArr[0];
    this.namespace = argArr[1];
    this.action = argArr[2];
    var actionArgumentMatch = this.action.match(/\((.*)\)/i);
    if(actionArgumentMatch !== null) {
      this.action = this.action.substr(0, actionArgumentMatch.index);
      this.argument = actionArgumentMatch[1];
    }
    if(this.el !== null) {
      this.el.addEventListener(this.type, function(ev){
        VMediator.publish(self.namespace + ':' + self.action, ev);
      }, false);
    }
  }
  return VAction;
})()

root = typeof exports !== "undefined" && exports !== null ? exports : window;
root.VAction = VAction;

var VActionRoot;

VActionRoot = (function() {
  VActionRoot.actionsEls = [];

  VActionRoot.actions = [];

  VActionRoot.document;

  function VActionRoot(document) {
    var action, actionAttr, actionInstance, _i, _len, _ref;
    this.document = document;
    var self = this;
    this.actions = [];
    this.actionsEls = this.document.querySelectorAll('[action]');
    _ref = this.actionsEls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      action = _ref[_i];
      actionAttr = action.getAttribute('action');
      if(actionAttr.indexOf(',') !== -1) {
        var manyActions = actionAttr.split(',');
        for (var i = 0; i < manyActions.length; i++) {
          actionAttr = manyActions[i];
          var actionInstance = new VAction(action, actionAttr);
          self.actions.push(actionInstance);
        };
      } else {
        actionInstance = new VAction(action, actionAttr);
        this.actions.push(actionInstance);
      }
    }
  }

  return VActionRoot;

})();

root = typeof exports !== "undefined" && exports !== null ? exports : window;

root.VActionRoot = VActionRoot;


var VMediator;

VMediator = (function() {
  var self = this;
  function VMediator() {
  }

  VMediator.channels = {};

  VMediator.install = function(obj) {
    obj.subscribe = VMediator.subscribe;
    obj.publish = VMediator.publish;
  }

  VMediator.subscribe = function(channelName, callback) {
    if (!VMediator.channels[channelName]) {
      VMediator.channels[channelName] = [];
    }
    VMediator.channels[channelName].push({
      context: VMediator,
      callback: callback
    });
  };

  VMediator.resetChannels = function() {
    VMediator.channels = {};
  }

  VMediator.removeSubscribers = function(channelName) {
    if(!VMediator.channels[channelName]) {
      throw new Error('No channel like that');
    } else {
      VMediator.channels[channelName] = null;
    }
  }

  VMediator.publish = function(channelName) {
    if(!VMediator.channels[channelName]) {
      throw new Error('No channel like that');
    }
    var channel = VMediator.channels[channelName];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, l = VMediator.channels[channelName].length; i < l; i ++) {
      var subscription = VMediator.channels[channelName][i];
      subscription.callback.apply(subscription.context, args);
    }
  };
  return VMediator;

})()

root = typeof exports !== "undefined" && exports !== null ? exports : window;
root.VMediator = VMediator;
module.exports = root

},{}],2:[function(require,module,exports){
module.exports = require('./build/LightYear');

},{"./build/LightYear":1}],3:[function(require,module,exports){
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

},{"lightyear":2}],4:[function(require,module,exports){
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

},{"./enemy.js":3,"lightyear":2}],5:[function(require,module,exports){
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

},{"./enemy.js":3,"./enemy_tower.js":4,"./player.js":6,"./score.js":7,"lightyear":2}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var lightyear = require('lightyear').VMediator;

var Score = function(game) {
    this.game = game;
    this.sprite = null;
    this.score = 0;
    this.clock = 0;
    this.clockInterval = null;
}


Score.prototype = {
    preload: function() {
    },
    updateScore: function() {
	if(this.clock > 10) {
	    this.score = this.score + Math.floor(this.clock / 10);
	    this.updateText();
	}
    },
    checkIfGameOver: function() {
	if(this.score <= -10 || this.clock >= 60) {
	    this.game.state.start('ScoreState');
	}
    },
    onPlayerHit: function() {
	console.log(Math.floor(this.clock / 10));
	if(this.clock > 10) {
	    this.score = this.score - Math.floor(this.clock / 10);
	} else {
	    this.score = this.score - 3;
	}
	this.updateText();
    },
    updateText: function() {
	this.text.setText("Score: " + this.score)
	this.checkIfGameOver();
    },
    updateClock: function() {
	this.time.setText("Time: " + this.clock)
	this.checkIfGameOver();
    },
    sendScoreDetails: function() {
	lightyear.publish('scorestate:update', {
	    score: this.score,
	    seconds: this.clock
	});
    },
    stopClock: function() {
	this.sendScoreDetails();
	clearInterval(this.clockInterval);
    },
    create: function() {
	this.score = 0;
	this.clock = 0;

	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	this.text = this.game.add.text(10, 10, "Score: 0", style);

	this.time = this.game.add.text(10, 520, "Time: 0", style);

	this.clockInterval = setInterval(function() {
	    this.clock = this.clock + 1;
	    this.updateClock();
	}.bind(this), 1000)

	lightyear.subscribe('score:stop', function() {
	    this.stopClock();
	}.bind(this));

	lightyear.subscribe('score:update', function() {
	    this.updateScore();
	}.bind(this));

	lightyear.subscribe('score:player_hit', function() {
	    this.onPlayerHit();
	}.bind(this));
    }
}

module.exports = Score;

},{"lightyear":2}]},{},[5]);
