var util = require('util')

/**
 * The Game of Points on Twitter
 * @constructor
 * @param {twitter} twitter
 * @param db database
 * @author rpaterson
 */
var PointsGame = function PointsGame(twitter, db) {

	var pointsgameTwitter = new twitter({
	    consumer_key: 'JmBMbdsE5rgdaAOz5WpwIw',
	    consumer_secret: process.env.npm_package_config_pointsgame_consumer_secret,
	    access_token_key: '90783985-8yRGeGRWngZNBOa3hhsjJROXbmca2D8pSobNNJ0D5',
	    access_token_secret: process.env.npm_package_config_pointsgame_access_token_secret
	});

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
	
	var match;
	if (match = text.match(/([+-]?\d+)\s.*?#points\s.*?@(\w+)/i)) {
		return { 'toUsername': match[2], 'points': parseInt(match[1]) }
	} else if (match = text.match(/@(\w+)\s.*?([+-]?\d+)\s+.*?#points/i)) {
		return { 'toUsername': match[1], 'points': parseInt(match[2]) }
	} else {
		util.log('No assignment parsed from tweet "' + text + '"')
		return null;
	}
	
}


module.exports = PointsGame