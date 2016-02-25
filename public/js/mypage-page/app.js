(function (window) {
  'use strict';

  /**
   * Set up login page
   *
   * @param {string}
   */
  function save() {
    var userNickname = $('#user_input').val();

    if(userNickname==""){
      alert("변경할 닉네임을 입력해주세요.");
      $('#user_input').focus();
      return false;
    }else {
      alert("저장되었습니다.");
      var params = {'userNickname': userNickname}
    }
  }

  function bind() {
    $('#editBtn').click(function() {
      save();
    });
  }

  $(document).ready(function() {
    bind();
  });


})(window);