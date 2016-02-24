(function (window) {
  'use strict';

  /**
   * Creates a new Model instance.
   *
   * @constructor
   */
  function Model() {

  }

  Model.prototype.votePost = function(parameter, callback) {
    HttpUtil.post(HOST_URL + '/api/v1/posts/'+parameter.pid+'/votes', parameter, function (err, result) {
      if (result.status === 0) {
        callback();
      }
    });
  };

  Model.prototype.addCommentData = function(parameter, callback) {
    HttpUtil.post(HOST_URL + '/api/v1/comments', parameter, function (err, result) {
      if (result.status === 0) {
        callback();
      }
    });
  };

  Model.prototype.getPostData = function(parameter, callback) {
    HttpUtil.get(HOST_URL + '/api/v1/posts/'+parameter.pid, function (err, result) {
      if (result && result.status === 0) {
        callback(result.value);
      }
    });
    //TODO: 서버에서 데이터 가져오는 부분 만들어야함!
    //var postData = {
    //  author: '글쓴이',
    //  title: '제목 테스트',
    //  postDate: '등록 날짜',
    //  viewCount: 10,
    //  likeCount: 12,
    //  dislikeCount: 13,
    //  commentCount: 12,
    //  content: '내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.',
    //  comments: [
    //    {
    //      cid: 'testcom',
    //      author: '댓글작성이',
    //      content: '댓글입니다',
    //      writeTime: '2시간전',
    //      likeCount: 10
    //    }
    //  ]
    //};
    //callback(postData);
  };

  // Export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);