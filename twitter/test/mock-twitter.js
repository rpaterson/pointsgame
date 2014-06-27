var EventEmitter = new require('events').EventEmitter

/**
 * Mock version of 'Twitter' module
 */
function MockTwitter(options) {
	
	this.options = options;
	
	MockTwitter.instances.push(this)
	
}

MockTwitter.instances = []

/**
 * The global Twitter stream
 */
var stream = new EventEmitter()
var tweetEvent = 'tweet'

/**
 * Emit a tweet on the global stream
 * 
 * @param {string} id_str ID string
 * @param {string} text 
 * @param {string} screen_name screen name of author
 */
MockTwitter.tweet = function(id_str, text, screen_name) {
	
	var tweet = {
		id_str:id_str,
		text:text,
		user:{
			screen_name:screen_name
			}
		}
	
	stream.emit(tweetEvent,tweet)
}

MockTwitter.prototype.verifyCredentials = function(callback) {
	callback({})
}

MockTwitter.prototype.stream = function(method, params, streamCallback) {

	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	
	if (method === 'filter') {
		
		var trackRegExps = params.track.split(',').map(function(track) { return new RegExp('\b' + track + '\b')});
		
		var filteredStream = new EventEmitter()
		stream.on(tweetEvent, function(tweet) {
			if (trackRegExps.some(function(trackRegExp) { return trackRegExp.test(tweet.text) })) {
				filteredStream.emit('data', tweet)
			}
		})
		
		streamCallback(filteredStream)

	} else {
		throw('Only "filter" streams mocked')
	}
	
}

module.exports=MockTwitter
