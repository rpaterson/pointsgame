var util = require('util');
var twitter = require('twitter');

var twit = new twitter({
    consumer_key: 'JmBMbdsE5rgdaAOz5WpwIw',
    consumer_secret: process.env.npm_package_config_pointsgame_consumer_secret,
    access_token_key: '90783985-8yRGeGRWngZNBOa3hhsjJROXbmca2D8pSobNNJ0D5',
    access_token_secret: process.env.npm_package_config_pointsgame_access_token_secret
});

twit.get('/statuses/home_timeline.json', {include_entities:true}, function(data) {
    console.log(util.inspect(data));
});