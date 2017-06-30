var rfr = require('rfr');
var _ = require('lodash');

var env = process.env.NODE_ENV || 'development';
var config = rfr('config/global.js')();

var envConfig = {};
try {
    rfr('config/env/'+env+'.js');
	envConfig = rfr('config/env/'+env+'.js')();
} catch(e) {

}

_.merge(config, envConfig);

config.env = env;

config.updateConfig = function(options) {
	_.merge(config, options);	
}

module.exports = config;