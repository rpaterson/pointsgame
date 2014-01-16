var util = require('util')
var Twitter = require('twitter')

/**
 * The Game of Points on Twitter
 * @constructor
 * @param db database
 * @author rpaterson
 */
var PointsGame = function PointsGame(db) {

	var pointsgameTwitter = new Twitter({
	    consumer_key: 'JmBMbdsE5rgdaAOz5WpwIw',
	    consumer_secret: process.env.npm_package_config_pointsgame_consumer_secret,
	    access_token_key: '90783985-8yRGeGRWngZNBOa3hhsjJROXbmca2D8pSobNNJ0D5',
	    access_token_secret: process.env.npm_package_config_pointsgame_access_token_secret
	});
	
	pointsgameTwitter.verifyCredentials(function() {
		console.log('PointsGame Twitter credentials verified')
	})

	function processTweet(id_str, text, screen_name) {
	
		var assignment = PointsGame.parseTweet(text)
		if (assignment) {
			processAssignment(screen_name, assignment.toUsername, assignment.points)
		}
	
	}
	
	function processAssignment(fromUsername, toUsername, points) {
			
		console.log(fromUsername + ' gives ' + points + ' to ' + toUsername)		
	}	

	
	return {
		
		start: function() {

//			pointsgameTwitter.stream('filter', {track:'#points'}, function onPointsStream(stream) {
//			    stream.on('data', 
			pointsgameTwitter.search('#points', {count:3}, function onData(result) {
				var data = result.statuses[0]
			    processTweet(data.id, data.text, data.user.screen_name)
			});
//			});
		}				
	}

};

/**
 * Parse tweet text
 * @param {string} text tweet text 
 * @returns {?{toUsername: string, points: number}} assignment or null if none parsed from text
 */
PointsGame.parseTweet = function parseTweet(text) {
	
	var toUsername, pointsStr;
	if (match = text.match(/([+-]?\d+)\s.*?#points\s.*?@(\w+)/i)) {
		
		toUsername = match[2]
		pointsStr = match[1]
		
	} else if (match = text.match(/@(\w+)\s.*?([+-]?\d+)\s+.*?#points/i)) {
		
		toUsername = match[1]
		pointsStr = match[2]
		
	} else {
		
		util.log('No assignment parsed from tweet "' + text + '"')
		return null;
	}
	
	var points = parseInt(pointsStr, 10);
	
	return {toUsername: toUsername, points:points}
}


module.exports = PointsGame