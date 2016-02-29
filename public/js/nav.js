(function (window) {
  'use strict';

  function bind() {
    $('.nav-back').click(function () {
      history.back();
    });
  }

  $(document).ready(function () {
    bind();
  });

})(window);
