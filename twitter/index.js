var util = require('util');
var Twitter = require('twitter');
var DB = require('tingodb')().Db;
var PointsGame = require('./lib/PointsGame');

var twitter = new Twitter({
    'consumer_key': 'JmBMbdsE5rgdaAOz5WpwIw',
    'consumer_secret': process.env['npm_package_config_pointsgame_consumer_secret'],
    'access_token_key': '90783985-8yRGeGRWngZNBOa3hhsjJROXbmca2D8pSobNNJ0D5',
    'access_token_secret': process.env['npm_package_config_pointsgame_access_token_secret']
});

var db = new DB(__dirname + '/db', {});

new PointsGame(twitter, db).start();