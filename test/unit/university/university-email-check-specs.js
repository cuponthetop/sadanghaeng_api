'use strict';

process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var UnivCtrl = require('../../../lib/controller/university');

describe('UniversityController', function () {
  describe('#getUniversityFromEmail', function () {

    it('should reject invalid email address', function (done) {
      done();
    });

    it('should reject email domain where no university accepts', function (done) {
      done();
    });

    it('should reject email domain where more than 2 universities accepts', function (done) {
      done();
    });

    it('should accept valid email domain', function (done) {
      done();
    });

  });
});

