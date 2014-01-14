var describe = require('./standalone-mocha').describe
var it = require('./standalone-mocha').it

var PointsGame = require('../lib/pointsgame.njs')


describe('PointsGame.parseTweet()', function() {

	it('should return null when passed empty', function() {
		(PointsGame.parseTweet("") === null).should.not.be.ok
	})	
	
});