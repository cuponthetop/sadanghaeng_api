(function (window) {
  'use strict';

  var univId = '';

  /**
   * Takes a model and view and acts as the controller between them
   *
   * @constructor
   * @param {object} model The model instance
   * @param {object} view The view instance
   */
  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;

    self.view.bind('writeComment', function(parameter) {
      self._writeComment(parameter);
    });
  }

  Controller.prototype.setView = function(id) {
    var self = this;
    univId = id;
    self._updatePostPage(univId);
  };

  Controller.prototype._votePost = function (parameter) {
    var self = this;
    self.model.votePost(parameter, function() {
      alert("투표가 완료되었습니다.");
      location.reload(true);
    });
  };

  Controller.prototype._voteComment = function (parameter) {
    var self = this;
    self.model.voteComment(parameter, function() {
      alert("투표가 완료되었습니다.");
      location.reload(true);
    });
  };

  Controller.prototype._writeComment = function (parameter) {
    var self = this;
    self.model.addCommentData(parameter, function() {
      alert("댓글이 작성되었습니다.");
      location.reload(true);
    });
  };

  Controller.prototype._updatePostPage = function (id) {
    var self = this;
    self.model.getPostData({pid: id}, function(data) {
      self.view.render('redraw', data);

      self.view.bind('votePost', function(parameter) {
        self._votePost(parameter);
      });
    });
  };

  // Export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);