(function (window) {
  'use strict';

  /**
   * View that abstracts away the browser's DOM completely.
   * It has two simple entry points:
   *
   *   - bind(eventName, handler)
   *     Takes a todo application event and registers the handler
   *   - render(command, parameterObject)
   *     Renders the given command with the options
   */
  function View(template) {
    this.template = template;
  }

  View.prototype._drawUnivTitle = function (parameter) {
    $('#univ_title').text(parameter);
  };

  View.prototype._drawPagination = function (parameter) {
    $('#pagination_container').empty();
    $('#pagination_container').append(this.template.paginationShow(parameter))
  };

  View.prototype._clearPostList = function () {
    $('#post_list_container').empty();
  };

  View.prototype._drawPostList = function (parameter) {
    $('#post_list_container').append(this.template.show(parameter))
  };

  View.prototype.render = function (viewCmd, parameter) {
    var self = this;
    var viewCommands = {
      redrawTitle: function () {
        self._drawUnivTitle(parameter);
      },
      redrawPagination: function () {
        self._drawPagination(parameter);
      },
      redraw: function () {
        self._clearPostList();
        self._drawPostList(parameter);
      }
    };

    viewCommands[viewCmd]();
  };

  View.prototype.bind = function (event, handler) {
    var self = this;
    if (event === 'changeTab') {
      $('.sort-btn-container .sort-btn').unbind('click').click(function () {
        $('.sort-btn-container .sort-btn').removeClass('active');
        $(this).addClass('active');
        handler($(this).data('value'));
      });
    }

    if (event === 'movePage') {
      $('#pagination_container > .pagination-number').unbind('click').click(function () {
        $('#pagination_container > .pagination-number').removeClass('active');
        $(this).addClass('active');
        handler(parseInt($(this).data('value')));
      });
    }
  };

  // Export to window
  window.app = window.app || {};
  window.app.View = View;
} (window));