var nodemailer = require('nodemailer');
var rfr = require('rfr');
var path = require('path');
var fs = require('fs');
var config = rfr('includes/config.js');
var Promise = require("bluebird");
var _ = require('lodash');

var logger = rfr('includes/logger.js')();

var transporter = null;
var filterExampleDotComEmails = false;

if (config && config.smtp) {
	if (config.smtp.use_env_variables) {
		transporter = nodemailer.createTransport({
			host: process.env[config.smtp.host],
			port: process.env[config.smtp.port],
			secure: config.smtp.secure,
			auth: {
				user: process.env[config.smtp.username],
				pass: process.env[config.smtp.password]
			}
		});
	} else {
		transporter = nodemailer.createTransport({
			host: config.smtp.host,
			port: config.smtp.port,
			secure: config.smtp.secure,
			auth: {
				user: config.smtp.username,
				pass: config.smtp.password
			}
		});
	}

	if (config.default_from_email) {
		transporter.default_from_email = config.default_from_email;
	}

	if (config.smtp.filterExampleDotComEmails) {
		filterExampleDotComEmails = true;
	}
}

var default_replaces = {};
if (config.site_path)
	default_replaces.site_path = config.site_path;

var __mailtemplates_cache = {};

var sendMail = function(to, subject, html, callback) {
	return new Promise(function(resolve, reject) {
		if (transporter !== null) {
			logger.info('Sending email to: ' + to + ' with ' + transporter.transporter.name);

			if (filterExampleDotComEmails) {
				if (to.indexOf('@example.com') !== -1) {
					logger.info('Filtering example.com email as per config settings');
					return resolve(true);
				}
			}

			try {
				transporter.sendMail({
					from: transporter.default_from_email,
					to: to,
					subject: subject,
					html: html
				}, function(error, info) {
					if (error) {
						logger.info('Message error: ' + error);
						return reject(error);
					}
					logger.info('Message sent: ' + info.response);
					return resolve(true);
				});
			} catch (e) {
				return reject(error);
			}
		} else {
			return reject('No transport defined');
		}
	});
};

var loadTemplate = function(templateName) {
	return new Promise(function(resolve, reject) {
		if (typeof(__mailtemplates_cache[templateName]) === 'undefined') {
			fs.readFile(path.join(rfr.root, 'data/mailtemplates/' + templateName + '.template'), function(err, data) {
				var subject = '';
				var body = '';
				if (!err) {
					var lines = ("" + data).split("\n");
					subject = lines.shift();
					body = lines.join("\n");
				}

				__mailtemplates_cache[templateName] = {
					subject: _.template(subject),
					body:  _.template(body)
				};

				resolve(__mailtemplates_cache[templateName]);
			});
		} else {
			resolve(__mailtemplates_cache[templateName]);			
		}
	});
};

var makeReplaces = function(template, replaces) {
	return {
		subject: template.subject(replaces),
		body: template.body(replaces)
	};
};


var sendTemplate = function(template, to, replaces) {
	return new Promise(function(resolve, reject) {
		if (template.subject && template.body) {
			/// template is template :)
			var templateWithReplaces = makeReplaces(template, replaces);

			sendMail(to, templateWithReplaces.subject, templateWithReplaces.body).then(function(){
				resolve(true);
			}).catch(function(e){
				resolve(false);
			});
		} else {
			/// template is templateName
			var templateName = ''+template; 

			loadTemplate(templateName).then(function(template){
				var templateWithReplaces = makeReplaces(template, replaces);
				sendMail(to, templateWithReplaces.subject, templateWithReplaces.body).then(function(){
					resolve(true);
				}).catch(function(e){
					resolve(false);
				});
			});
		}
	});
};


exports.loadTemplate = loadTemplate;
exports.transporter = transporter;
exports.send = sendMail;
exports.sendTemplate = sendTemplate;