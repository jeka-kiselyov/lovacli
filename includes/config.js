const _ = require('lodash');
const path = require('path');

let config =  require(path.join(__dirname, '../config/global.js'))();

config.updateConfig = function(options) {
	_.merge(config, options);
};

module.exports = config;