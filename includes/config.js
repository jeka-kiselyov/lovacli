var rfr = require('rfr');
var _ = require('lodash');

var config = rfr('config/global.js')();

config.updateConfig = function(options) {
	_.merge(config, options);
};

module.exports = config;