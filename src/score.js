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
