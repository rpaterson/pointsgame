var util = require('util');
var twitter = require('twitter');

var pointsgame = {
	
	'processTweet': function processTweet(id_str, text, screen_name) {
		console.log('id_str: ' + id_str)	
		console.log('text: ' + text)
		console.log('screen_name: ' + screen_name)	
	}
}

var twit = new twitter({
    consumer_key: 'JmBMbdsE5rgdaAOz5WpwIw',
    consumer_secret: process.env.npm_package_config_pointsgame_consumer_secret,
    access_token_key: '90783985-8yRGeGRWngZNBOa3hhsjJROXbmca2D8pSobNNJ0D5',
    access_token_secret: process.env.npm_package_config_pointsgame_access_token_secret
});

twit.stream('filter', {track:'#points'}, function onPointsStream(stream) {
    stream.on('data', function onData(data) {
        pointsgame.processTweet(data.id, data.text, data.user.screen_name)
    });
});