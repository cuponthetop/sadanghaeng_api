(function (window) {
  'use strict';

  /**
   * Set up post page
   *
   * @param {string}
   */
  function PostPage() {
    this.model = new app.Model();
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }

  var postPage = new PostPage();

  function setView() {
    postPage.controller.setView($('#post_container').data('id'));
  }

  $(document).ready(function() {
    setView();
  });

})(window);
