// 'use-strict';

// process.env.NODE_ENV = 'test';

// var chai = require('../../helper/setup-chai');
// var PostCtrl = require('../../../lib/controller/post');

// describe('PostController', () => {
//   describe("#addPost", () => {

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
//     it('should write a title of the post', (done) => {
//       PostCtrl.addPost(/* req, res */)
//         .should.be.rejectedWith('title doesn\'t exist')
//         .notify(done);
//     });
//     it('should write some texts of the post', (done) => {
//       PostCtrl.addPost(/* req, res */)
//         .should.be.rejectedWith('texts don\'t exist')
//         .notify(done);
//     });
//     it('should get the right info(json) of the post', (done) => {
//       PostCtrl.addPost(/* req, res */)
//         .should.equal(/* determined post object */)
//         .notify(done);
//     });
//     it('should be saved exactly', (done) => {
//       PostCtrl.addPost(/* req, res */);
//       PostCtrl.getPost(/* add한 post의 pid를 찾는다 */);
//       //같은지 확인하고
//       // .notify(done);
//     });
//   });
// });