// 'use-strict';

// process.env.NODE_ENV = 'test';

// var chai = require('../../helper/setup-chai');
// var PostCtrl = require('../../../lib/controller/post');

// describe('PostController', () => {
//   describe('#getCommtsOnPost', () => {

//     var config = require('../../../config/config');
//     var mongoose = require('mongoose');

//     before(() => {
//       var dbUri = config.db.uri + config.db.dbName;
//       var dbOptions = { username: config.db.username, password: config.db.password };
//       mongoose.connect(dbUri, dbOptions); // what is 'dbOptions' for?
//     });
//     after(() => {
//       mongoose.disconnect();
//     });

//     it('should reject an invalid pid', (done) => {
//       PostCtrl.getCommentsOnPost(/* req, res */)
//         .should.be.rejectedWith('not valid post ID')
//         .notify(done);
//     });

//     it('should return right comments', (done) => {
//       PostCtrl.getCommentsOnPost(/* req, res */)
//         .should.equal(/* comments */)
//         .notify(done);
//     });



//   });
// });