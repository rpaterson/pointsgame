var util = require('util');
var twitter = require('twitter');

var PointsGame = require('./lib/pointsgame.njs')
new PointsGame(twitter, {/*db*/}).start()