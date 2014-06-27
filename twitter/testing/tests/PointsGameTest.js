var mockery = require('mockery');
var MockTwitter = require('../mocks/MockTwitter');
var PointsGame = require('../../lib/PointsGame');

exports.setUp = function(callback) {

  this.twitter = MockTwitter.create();

  this.db = {};

  this.pointsgame = PointsGame.create(this.twitter, this.db);

  callback();

};

//setup
exports['should connect to Twitter as "pointsgame"'] = function(test) {

  test.expect(1);

  this.twitter.verifyCredentials = function(callback) {
    test.ok('verified');
    test.done();
    callback();
  };

  this.pointsgame.start();
};
	
//start
exports['should filter tweets for #points'] = function(test) {

  test.expect(2);

  this.twitter.stream = function(method, params, callback) {
    test.equal(method, 'filter');
    test.equal(params.track, '#points');
    test.done();
  };

  this.pointsgame.start();
};
	
exports["should ignore tweets that don't contain an assignment"] = function(test) {

  this.pointsgame.start();

  this.twitter.tweet('Welcome to the Game of #Points');

  //TODO verify nothing happened

  test.done();
};

exports._parseTweet = {

	// negative paths

  'should return null when passed empty': function(test) {
		test.equal(PointsGame._parseTweet(''), null);
    test.done();
	},

	'should return null if no user @mentioned': function(test) {
		test.equal(PointsGame._parseTweet('give 10 #points to Roy_Paterson'), null);
    test.done();
	},

	'should return null if no #points hashtag metioned': function(test) {
		test.equal(PointsGame._parseTweet('give 10 points to @Roy_Paterson'), null);
    test.done();
	},

	'should return null if no number of points metioned': function(test) {
		test.equal(PointsGame._parseTweet('give #points to @Roy_Paterson'), null);
    test.done();
	},

	// positive paths

  'should return an assignment for "<number> #points to @<user>"': function(test) {
		test.deepEqual(
      PointsGame._parseTweet('10 #points to @Roy_Paterson'),
      {toUsername: 'Roy_Paterson', points: 10}
    );
    test.done();
	},

	'should return an assignment for "-<number> #points to @<user>"': function(test) {
		test.deepEqual(
      PointsGame._parseTweet('-10 #points to @Roy_Paterson'),
      {toUsername: 'Roy_Paterson', points: -10}
    );
    test.done();
	},

	'should return an assignment for "+<number> #points to @<user>"': function(test) {
    test.deepEqual(
      PointsGame._parseTweet('+10 #points to @Roy_Paterson'),
      {toUsername: 'Roy_Paterson', points: 10}
    );
    test.done();
  },

	'should return an assignment for "@<user> <number> #points"': function(test) {
    test.deepEqual(
      PointsGame._parseTweet('@Roy_Paterson 10 #points'),
      {toUsername: 'Roy_Paterson', points: 10}
    );
    test.done();
  },

	'should return an assignment for "@<user> -<number> #points"': function(test) {
		test.deepEqual(
      PointsGame._parseTweet('@Roy_Paterson -10 #points'),
      {toUsername: 'Roy_Paterson', points: -10}
    );
    test.done();
	},

	'should return an assignment for "@<user> +<number> #points"': function(test) {
		test.deepEqual(
      PointsGame._parseTweet('@Roy_Paterson +10 #points'),
      {toUsername: 'Roy_Paterson', points: 10}
    );
    test.done();
	},

	'should ignore case': function(test) {
		test.deepEqual(
      PointsGame._parseTweet('@Roy_Paterson 10 #POINTS'),
      {toUsername: 'Roy_Paterson', points: 10}
    );
		test.done();
	}

};