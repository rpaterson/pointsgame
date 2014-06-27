var util = require('util');

var __ = function()  {};

/**
 * The Game of Points on Twitter
 *
 * @param twitter twitter
 * @param db database
 */
__.create = function(twitter, db) {

  var instance = new __();

  instance._db = db;

  instance._twitter = twitter;

  return instance;
};

__.prototype._processTweet = function(idStr, text, screenName) {
	
  var assignment = __.parseTweet(text);
  if (assignment) {
    this._processAssignment(screenName, assignment.toUsername, assignment.points);
  }

};

__.prototype._processAssignment = function(fromUsername, toUsername, points) {
			
  console.log(fromUsername + ' gives ' + points + ' to ' + toUsername);
};

	
__.prototype.start = function() {

  var that = this;

  this._twitter.verifyCredentials(function() {

    console.log('PointsGame Twitter credentials verified');

    that._twitter.stream('filter', {track:'#points'}, function onPointsStream(stream) {
        stream.on('data', function onData(data) {
          console.puts(data);
          that._processTweet(data['id_str'], data.text, data.user['screen_name']);
      });
    });

  });

};

/**
 * Parse tweet text
 * @param {string} text tweet text 
 * @returns {?{toUsername: string, points: number}} assignment or null if none parsed from text
 */
__._parseTweet = function(text) {
	
	var toUsername, pointsStr, match;
	if ((match = text.match(/([+-]?\d+)\s.*?#points\s.*?@(\w+)/i))) {
		
		toUsername = match[2];
		pointsStr = match[1];
		
	} else if ((match = text.match(/@(\w+)\s.*?([+-]?\d+)\s+.*?#points/i))) {
		
		toUsername = match[1];
		pointsStr = match[2];
		
	} else {
		
		util.log('No assignment parsed from tweet "' + text + '"');
		return null;
	}
	
	var points = parseInt(pointsStr, 10);
	
	return {toUsername: toUsername, points: points};
};


module.exports = __;