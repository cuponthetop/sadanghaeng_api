(function (window) {
  'use strict';

  function bind() {
    $('.nav-back').click(function () {
      location.href = document.referrer;
    });
  }

  $(document).ready(function() {
    bind();
  });

})(window);
