'use strict';

process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , UnivCtrl = require('../../../lib/controller/university')
  ;

describe('UniversityController', () => {
  describe('#isValidEmailDomain', () => {

    it('should reject invalid email domain', (done) => {
      UnivCtrl.isValidEmailDomain('shouldreject')
        .should.be.not.ok;
        done();
    });

    it('should reject more badass email domain', (done) => {
      UnivCtrl.isValidEmailDomain('shouldreject@shouldreject.com')
        .should.be.not.ok;
        done();
    });

    it('should reject more badass email domain #2', (done) => {
      UnivCtrl.isValidEmailDomain('$!#..shouldreject.com')
        .should.be.not.ok;
        done();
    });

    it('should reject more badass email domain #3', (done) => {
      UnivCtrl.isValidEmailDomain('shouldreject@shouldreject....com')
        .should.be.not.ok;
        done();
    });

    it('should accept valid email domain', (done) => {
      UnivCtrl.isValidEmailDomain('test.com').should.be.ok;
      done();
    });

  });
});

