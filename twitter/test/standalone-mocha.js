/*
 * Totally brain-dead standalone subset of Mocha for convenient test debugging 
 */
require('should')

var standaloneDescribe = function(suiteName, closure) {
	console.log(suiteName)
	closure()
}

var standaloneIt = function(testName, closure) {
	console.log('    ' + testName)
	closure()
}

exports.describe = typeof describe === 'undefined' ? standaloneDescribe : describe
exports.it = typeof it === 'undefined' ? standaloneIt : it