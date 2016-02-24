(function (window) {
  'use strict';

  /**
   * Creates a new Model instance.
   *
   * @constructor
   */
  function Model() {

  }

  Model.prototype.getUnivInfo = function(parameter, callback) {
    HttpUtil.get(HOST_URL + '/api/v1/universities/'+parameter.univid, function (err, result) {
      if (err) {
        return callback("가림판");
      }
      if (result.status === 0) {
        callback(result.value.name + " 가림판");
      } else {
        callback("가림판");
      }
    });
  };

  Model.prototype.getPostList = function(parameter, callback) {
    HttpUtil.get(HOST_URL + '/api/v1/universities/'+parameter.univid+'/posts', parameter, function (err, result) {
      if (err) {
        return callback([]);
      }
      if (result.status === 0) {
        callback(result.value);
      } else {
        callback([]);
      }
    });
    //TODO: 서버에서 데이터 가져오는 부분 만들어야함!
    //var postList = [
    //  {
    //    pid: 'abc',
    //    title: '테스트',
    //    author: '글쓴이',
    //    written: '3시간전',
    //    viewCount: 10,
    //    likeCount: 1,
    //    dislikeCount: 3
    //  },
    //  {
    //    pid: 'abc',
    //    title: '테스트',
    //    author: '글쓴이',
    //    written: '3시간전',
    //    viewCount: 10,
    //    likeCount: 1,
    //    dislikeCount: 3
    //  },
    //  {
    //    pid: 'abc',
    //    title: '테스트',
    //    author: '글쓴이',
    //    written: '3시간전',
    //    viewCount: 10,
    //    likeCount: 1,
    //    dislikeCount: 3
    //  }
    //];
    //callback(postList);
  };

  // Export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);