(function (window) {
  'use strict';

  var PER_PAGE = 7;
  var pageNum = 1;
  var sortFilter = 'new';
  var univId = $('#univ_title_container').data('id');
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

    self.view.bind('changeTab', function(tabValue) {
      sortFilter = tabValue;
      self._updatePostList();
    });

    self.view.bind('movePage', function(pageNumVal) {
      pageNum = pageNumVal;
      self._updatePostList();
    });
  }

  Controller.prototype.setView = function() {
    var self = this;
    self._updateUnivTitle();
    self._updatePostList();
  };

  Controller.prototype._updateUnivTitle = function () {
    var self = this;
    self.model.getUnivInfo({ univid: univId }, function(data) {
      self.view.render('redrawTitle', data);
    });
  };

  Controller.prototype._updatePostList = function () {
    var self = this;
    self.model.getTotalPostCount({ univid: univId }, function(data) {
      self.view.render('redrawPagination', data);
    });
    self.model.getPostList({ univid: univId, filter: sortFilter, page: pageNum, perPage: PER_PAGE }, function(data) {
      self.view.render('redraw', data);
    });
  };

  // Export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);