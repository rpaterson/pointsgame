/**
 * Mock version of 'Twitter' module
 */
function MockTwitter(options) {
	
	this.options = options;
	
	MockTwitter.instances.push(this)
	
}

MockTwitter.instances = []

MockTwitter.prototype.verifyCredentials = function(callback) {
	callback({})
}

module.exports=MockTwitter
