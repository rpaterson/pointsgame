var EventEmitter = new require('events').EventEmitter;

/**
 * Mock version of 'Twitter' module
 */

var __ = function() {};

__.create = function(options) {
	var instance = new __();

  instance._options = {};

  instance._stream = new EventEmitter();

  return instance;
};

/**
 * Emit a tweet
 * 
 * @param {string} idStr ID string
 * @param {string} text 
 * @param {string} screenName screen name of author
 */
__.prototype.tweet = function(idStr, text, screenName) {
	
	var tweet = {
		'id_str': idStr,
		text: text,
		user: {
			'screen_name': screenName
			}
		};
	
	this._stream.emit('tweet',tweet);
};

__.prototype.verifyCredentials = function(callback) {
	callback({});
};

__.prototype.stream = function(method, params, callback) {

	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	
	if (method === 'filter') {
		
		var trackRegExps = params.track.split(',').map(function(track) {
      return new RegExp('\b' + track + '\b');
    });
		
		var filteredStream = new EventEmitter();
		this._stream.on('tweet', function(tweet) {
			var filterPass = trackRegExps.some(function(trackRegExp) {
        return trackRegExp.test(tweet.text);
      });
      if (filterPass)
				filteredStream.emit('data', tweet);
		});
		
		callback(filteredStream);

	} else {
		throw('Only "filter" streams mocked');
	}
	
};

module.exports = __;
