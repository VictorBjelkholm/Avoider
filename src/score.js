var lightyear = require('lightyear').VMediator;

var Score = function(game) {
    this.game = game;
    this.sprite = null;
    this.score = 0;
}

var clock = 0;

Score.prototype = {
    preload: function() {
    },
    updateScore: function() {
	if(clock > 10) {
	    this.score = this.score + Math.floor(clock / 10);
	    this.updateText();
	}
    },
    onPlayerHit: function() {
	if(clock > 10) {
	    this.score = this.score - Math.floor(clock / 10);
	} else {
	    this.score = this.score - 3;
	}
	this.updateText();
    },
    updateText: function() {
	this.text.setText("Score: " + this.score)
    },
    updateClock: function() {
	this.time.setText("Time: " + clock)
    },
    update: function() {
    },
    create: function() {
	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	this.text = this.game.add.text(10, 10, "Score: 0", style);

	this.time = this.game.add.text(10, 520, "Time: 0", style);

	setInterval(function() {
	    clock = clock + 1;
	    this.updateClock();
	}.bind(this), 1000)

	lightyear.subscribe('score:update', function() {
	    this.updateScore();
	}.bind(this));

	lightyear.subscribe('score:player_hit', function() {
	    this.onPlayerHit();
	}.bind(this));
    }
}

module.exports = Score;
