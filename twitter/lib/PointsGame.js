var util = require('util');

/**
 * The Game of Points on Twitter
 *
 * @param twitter twitter
 * @param db database
 */
var PointsGame = function PointsGame(twitter, db)  {

  this._db = db;

  this._twitter = twitter;

};

PointsGame.create = function create(twitter, db) {
  return new PointsGame(twitter, db);
};

PointsGame.prototype._processTweet = function _processTweet(idStr, text, screenName) {
	
  var assignment = PointsGame.parseTweet(text);
  if (assignment) {
    this._processAssignment(screenName, assignment.toUsername, assignment.points);
  }

};

PointsGame.prototype._processAssignment = function _processAssignment(
    fromUsername,
    toUsername,
    points
    ) {
			
  console.log(fromUsername + ' gives ' + points + ' to ' + toUsername);
};

	
PointsGame.prototype.start = function start() {

  var that = this;

  this._twitter.verifyCredentials(function credentialsVerified() {

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
PointsGame._parseTweet = function parseTweet(text) {
	
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


module.exports = PointsGame;