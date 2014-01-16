var mockery = require('mockery')

var pointsgamejs = '../lib/pointsgame.js'
var twitterjs = 'twitter';

describe('PointsGame', function() {
	
	var Twitter = null, PointsGame = null 
	
	beforeEach(function() {
		
		mockery.enable({useCleanCache:true})
		mockery.registerAllowable('../lib/pointsgame.js', true)
		mockery.registerAllowable('util')

		//setup mock Twitter
		mockery.registerSubstitute('twitter', '../test/mock-twitter.js')
		
		//init
		Twitter = require('twitter')
		PointsGame = require('../lib/pointsgame.js')
		
		//baseline
		Twitter.instances.should.have.length(0)
	})
	
	//setup
	it('should connect to Twitter as "pointsgame"', function(done) {
		
		Twitter.prototype.verifyCredentials = function(callback) {
			callback();
			done();
		}
		
		new PointsGame();
		
		Twitter.instances.should.have.length(1)
		
	})
	
	afterEach(function() {
		
		//cleanup mockery
		mockery.disable()
	})
})