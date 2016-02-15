'use strict';

process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , UnivCtrl = require('../../../lib/controller/university')
  , status = require('../../../lib/server/status')
  , mongoInit = require('../../init/mongo-init')
  , univInit = require('../../init/universitys-init')
  ;

describe('UniversityController', () => {
  describe('#getUniversityFromEmail', () => {

    var config = require('../../../config/config');
    var mongoose = require('mongoose');
    var wasConnected = mongoose.connection.readyState;

    before((done) => {
      mongoInit.connect().then(univInit).catch(console.log).fin(done);
    });

    after((done) => {
      univInit().then(mongoInit.disconnect).catch(console.log).fin(done);
    });

    it('should reject invalid email address', (done) => {
      UnivCtrl.getUniversityFromEmail('shouldreject')
        .should.be.rejectedWith(status.codes.InvalidEmailAddress.code)
        .notify(done);
    });

    it('should reject more badass email address', (done) => {
      UnivCtrl.getUniversityFromEmail('shouldreject@shouldreject@shouldreject.com')
        .should.be.rejectedWith(status.codes.InvalidEmailAddress.code)
        .notify(done);
    });

    it('should reject email domain where no university accepts', (done) => {
      UnivCtrl.getUniversityFromEmail('test@surelynosuchdomaingetsaccepted.com')
        .should.be.rejectedWith(status.codes.NotAcceptedEmailAddress.code)
        .notify(done);
    });

    it('should reject email domain where more than 2 universities accepts', (done) => {
      UnivCtrl.getUniversityFromEmail('test@test2.com')
        .should.be.rejectedWith(status.codes.MultipleAcceptedEmailAddress.code)
        .notify(done);
    });

    it('should accept valid email domain', (done) => {
      UnivCtrl.getUniversityFromEmail('test@test.com')
        .should.eventually.equal('56ac6f7b9b0d0b0457673daf')
        .notify(done);
    });

  });
});

