'use-strict';

process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
, PostCtrl = require('../../../lib/controller/post')
  // , UserCtrl = require('../../../lib/controller/user')
  , status = require('../../../lib/server/status')
  , request = require('../../helper/setup-supertest')('http://localhost:3001')
  , mongoInit = require('../../init/mongo-init')
  , postInit = require('../../init/posts-init')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , PostModel = require('../../../lib/model/post')
  ;

  describe('PostController', () => {

    before((done) => {
      mongoInit.connect().then(postInit).catch(console.log).fin(done);
    });
    after((done) => {
      postInit().then(mongoInit.disconnect).catch(console.log).fin(done);
    });

    describe('#updateVoteOnPost', () => {

     /*
      * 익명의 사용자 접근 여부 테스트 
      */
      it('should not allow access to anonymous users', (done) => {
       request
       .post('/api/v1/posts/37bc6f7b9b0d0b0457673daf/votes')
       .send({ 
        'vote': { 'uid': '21bc6f7b900d0aa457673daf', 'voteType': 'down' }
      })
       .toPromise()
       .then((res) => {
        res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
        res.body.value.should.have.property('message');
      })
       .then(done)
       .catch(done)
       .done();
     });
    /*
     * 사용자가 좋아요(+1)을 누를 때 db에 저장 잘 되나 테스트
     */
     it('should increase voteScore in the post', (done) => {
      login('test2@test.com', 'test')
      .then(() => {
        return request
        .post('/api/v1/posts/37bc6f7b9b0d0b0457673daf/votes')
        .send({ 
          'vote': { 'uid': '21bc6f7b900d0aa457673daf', 'voteType': 'up' }
        })
        .toPromise();
      })
      .then((res) => {
        res.body.status.should.be.equal(0);
      })
      .then(postInit)
      .then(logout)
      .then(done)
      .catch(done)
      .done();
    });
    /*
     * 사용자가 싫어요(-1)을 누를 때 db에 저장 잘 되나 테스트
     */
     it('should decrease voteScore in the post', (done) => {
      login('test2@test.com', 'test')
      .then(() => {
        return request
        .post('/api/v1/posts/37bc6f7b9b0d0b0457673daf/votes')
        .send({ 
          'vote': { 'uid': '21bc6f7b900d0aa457673daf', 'voteType': 'down' }
        })
        .toPromise();
      })
      .then((res) => {
        res.body.status.should.be.equal(0);
      })
      .then(postInit)
      .then(logout)      
      .then(done)
      .catch(done)
      .done();
    });
    /*
     * 이미 vote한 사람 
     */
    it('should not allow the person who voted to vote again', (done) => {
      login('test2@test.com', 'test')
      .then(() => {
        return request
        .post('/api/v1/posts/36bc6f7b9b0d0b0457673daf/votes')
        .send({ 
          'vote': { 'uid': '21bc6f7b900d0aa457673daf', 'voteType': 'down' }
        })
        .toPromise();
      })
      .then((res) => {
        res.body.status.should.be.equal(409);
      })
      .then(postInit)
      .then(logout)
      .then(done)
      .catch(done)
      .done();
    });
    /*
     * post 주인이 vote하는 경우 
     */
    it('should not allow the person who is the owner of the post to vote', (done) => {
      login('test@test.com', 'test')
      .then(() => {
        return request
        .post('/api/v1/posts/36bc6f7b9b0d0b0457673daf/votes')
        .send({
          'vote': { 'uid': '11bc6f7b9b0d0b0457673daf', 'voteType': 'down' }
        })
        .toPromise();
      })
      .then((res) => {
        res.body.status.should.be.equal(411);
      })
      .then(postInit)
      .then(logout)
      .then(done)
      .catch(done)
      .done();
    });

  });
});

// // console.log("This is LLLLLLLLLLLLog : " + JSON.stringify(res));

// user.json
//   {
//     "_id": "21bc6f7b900d0aa457673daf",
//     "email": "test2@test.com",
//     "nickname": "test2",
//     "hashed_password": "$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK",
//     "verified": true,
//     "admin": false,
//     "university": "56ac6f7b9b0d0b0457673daf",
//     "memberSince": "2016-01-01T08:11:10.000Z",
//     "reported": []
//   }
// post.json
// {
//     "_id": "37bc6f7b9b0d0b0457673daf",
//     "title": "Test Post4",
//     "text": "44Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text",

//     "author": "11bc6f7b9b0d0b0457673daf",
//     "university": "56ac6f7b9b0d0b0457673daf",

//     "written": "2016-02-04T08:11:10.000Z",
//     "edited": "2016-02-04T08:11:10.000Z",

//     "votes": [],
//     "voteScore": 0,
//     "comments": []
//   }

