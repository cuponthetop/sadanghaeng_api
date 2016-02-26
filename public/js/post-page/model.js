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

  Model.prototype.voteComment = function(parameter, callback) {
    parameter.voteType = 'up';
    HttpUtil.post(HOST_URL + '/api/v1/comments/'+parameter.cid+'/votes', parameter, function (err, result) {
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
  };

  // Export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);