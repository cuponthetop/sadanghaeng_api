'use strict';

process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai');
var UnivCtrl = require('../../../lib/controller/university');

describe('UniversityController', () => {
  describe('#getUniversityFromEmail', () => {

    var config = require('../../../config/config');
    var mongoose = require('mongoose');
    var wasConnected = mongoose.connection.readyState;

    before(() => {
      if (wasConnected === 0) {

        // 몽고 db 연결
        var dbUri = config.db.uri + config.db.dbName;
        var dbOptions = { username: config.db.username, password: config.db.password };
        mongoose.connect(dbUri, dbOptions);
      }
    });

    after(() => {
      if (wasConnected === 0) {
        mongoose.disconnect();
      }
    });

    it('should reject invalid email address', (done) => {
      UnivCtrl.getUniversityFromEmail('shouldreject')
        .should.be.rejectedWith('not valid email address')
        .notify(done);
    });

    it('should reject invalid email address 2', (done) => {
      UnivCtrl.getUniversityFromEmail('shouldreject@shouldreject@shouldreject.com')
        .should.be.rejectedWith('not valid email address')
        .notify(done);
    });

    it('should reject email domain where no university accepts', (done) => {
      UnivCtrl.getUniversityFromEmail('test@test3.com')
        .should.be.rejectedWith('none of universities we support have ' + 'test3.com')
        .notify(done);
    });

    it('should reject email domain where more than 2 universities accepts', (done) => {
      UnivCtrl.getUniversityFromEmail('test@test2.com')
        .should.be.rejectedWith('many of universities we support have ' + 'test2.com' + ' as their email!!')
        .notify(done);
    });

    it('should accept valid email domain', (done) => {
      UnivCtrl.getUniversityFromEmail('test@test.com')
        .should.eventually.equal('56ac6f7b9b0d0b0457673daf')
        .notify(done);
    });

  });
});

