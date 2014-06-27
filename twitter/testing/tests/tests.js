var mockery = require('mockery')

var pointsgamejs = '../lib/pointsgame.js'
var twitterjs = 'twitter';

describe('PointsGame', function() {
	
	var Twitter = null, PointsGame = null 
	
	beforeEach(function() {
		
		mockery.enable({useCleanCache:true})
		mockery.registerAllowable('../lib/pointsgame.js', true)
		mockery.registerAllowables(['util', 'events'])

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
	
	//start
	it('should filter tweets for #points', function(done) {
		
		Twitter.prototype.stream = function(method, params, callback) {
			method.should.equal('filter')
			params.should.have.property('track','#points')
			done()
		}
		
		new PointsGame().start()
	})
	
	it('should ignore tweets that don\'t contain an assignment', function() {
		
		new PointsGame().start()
		
		Twitter.tweet('Welcome to the Game of #Points')
		
		//TODO verify nothing happened

	})
	
	afterEach(function() {
		
		//cleanup mockery
		mockery.deregisterAll()
		mockery.disable()
	})
})