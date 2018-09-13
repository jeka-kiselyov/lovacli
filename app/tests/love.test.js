const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const assert = require('chai').assert;
const db = require(path.join(__dirname, '../../includes/db.js'));

describe('We gonna test everything', function() {

		it('should be cool', function(done) {
			expect('awesome').to.equal('awe'+'some');
			done();
		});

});