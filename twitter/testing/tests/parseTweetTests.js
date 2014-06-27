var describe = require('./standalone-mocha').describe
var it = require('./standalone-mocha').it

var PointsGame = require('../lib/pointsgame.js')


describe('PointsGame.parseTweet()', function() {

	// negative paths
	
	it('should return null when passed empty', function() {
		(PointsGame.parseTweet('') === null).should.be.ok
	})	
	
	it('should return null if no user @mentioned', function() {
		(PointsGame.parseTweet('give 10 #points to Roy_Paterson') === null).should.be.ok
	})
	
	it('should return null if no #points hashtag metioned', function() {
		(PointsGame.parseTweet('give 10 points to @Roy_Paterson') === null).should.be.ok
	})

	it('should return null if no number of points metioned', function() {
		(PointsGame.parseTweet('give some #points to @Roy_Paterson') === null).should.be.ok
	})

	// positive paths
	
	it('should return an assignment for "<number> #points to @<user>"', function() {
		var assignment = PointsGame.parseTweet('10 #points to @Roy_Paterson')
		assignment.should.have.property('toUsername', 'Roy_Paterson')
		assignment.should.have.property('points', 10);
	})
	
	it('should return an assignment for "-<number> #points to @<user>"', function() {
		var assignment = PointsGame.parseTweet('-10 #points to @Roy_Paterson')
		assignment.should.have.property('toUsername', 'Roy_Paterson')
		assignment.should.have.property('points', -10);
	})
	
	it('should return an assignment for "+<number> #points to @<user>"', function() {
		var assignment = PointsGame.parseTweet('+10 #points to @Roy_Paterson')
		assignment.should.have.property('toUsername', 'Roy_Paterson')
		assignment.should.have.property('points', 10);
	})

	it('should return an assignment for "@<user> <number> #points"', function() {
		var assignment = PointsGame.parseTweet('@Roy_Paterson 10 #points')
		assignment.should.have.property('toUsername', 'Roy_Paterson')
		assignment.should.have.property('points', 10);
	})
	
	it('should return an assignment for "@<user> -<number> #points"', function() {
		var assignment = PointsGame.parseTweet('@Roy_Paterson -10 #points')
		assignment.should.have.property('toUsername', 'Roy_Paterson')
		assignment.should.have.property('points', -10);
	})
	
	it('should return an assignment for "@<user> +<number> #points"', function() {
		var assignment = PointsGame.parseTweet('@Roy_Paterson +10 #points')
		assignment.should.have.property('toUsername', 'Roy_Paterson')
		assignment.should.have.property('points', 10);
	})
	
	it('should ignore case', function() {
		var assignment = PointsGame.parseTweet('@Roy_Paterson 10 #POINTS')
		assignment.should.have.property('toUsername', 'Roy_Paterson')
		assignment.should.have.property('points', 10);
	})

});