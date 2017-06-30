var rfr = require('rfr');
var fs = require('fs');
var expect = require('chai').expect;
var assert = require('chai').assert;
var db = rfr('includes/db.js');

describe('We gonna test everything', function() {

		it('should be cool', function(done) {
			expect('awesome').to.equal('awe'+'some');
			done();
		});

});