(function (window) {
  'use strict';

  /**
   * Set up write post page
   *
   * @param {string}
   */

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
          title: $('#post_title').val(),
          text: $('#post_content').val()
        };
        HttpUtil.post('http://localhost:5001/api/v1/posts', post, function (err, result) {
          if (err) {
            return;
          }
          location.href = '/universities/'+$('#univ_container').data('id')+'/user/'+$('#univ_container').data('uid');
        });
      }
    });
  }

  $(document).ready(function() {
    bind();
  });

})(window);
