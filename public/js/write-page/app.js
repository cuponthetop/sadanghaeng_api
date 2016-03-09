(function (window) {
  'use strict';

  /**
   * Set up write post page
   *
   * @param {string}
   */

  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '`': '&#x60;'
  };

  var escapeHtmlChar = function (chr) {
    return htmlEscapes[chr];
  };

  var reUnescapedHtml = /[&<>"'`]/g;
  var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  var escape = function (string) {
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  };

  function validate() {
    var regExCheckEmptyText = /(^\s*)(\s*$)/;
    var title = $('#post_title').val();
    var text = $('#post_content').val();

    var status = true;
    if (!title || regExCheckEmptyText.test(title)) {
      alert("글 제목을 입력해주세요!");
      status = false;
      return status;
    }
    if (!text || regExCheckEmptyText.test(text)) {
      alert("글 내용을 입력해주세요!");
      status = false;
      return status;
    }
    return status;
  }

  function bind() {
    $('#post_btn').click(function () {
      if (validate()) {
        var post = {
          univid: $('#univ_container').data('id'),
          title: escape($('#post_title').val()),
          text: escape($('#post_content').val())
        };
        HttpUtil.post(HOST_URL + '/api/v1/posts', post, function (err, result) {
          if (err) {
            return;
          }
          location.href = '/universities/' + $('#univ_container').data('id') + '/user/' + $('#univ_container').data('uid');
        });
      }
    });
  }

  $(document).ready(function () {
    bind();
  });

})(window);
