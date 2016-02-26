(function (window) {
  'use strict';

  /**
   * Set up login page
   *
   * @param {string}
   */
  function save() {
    var userNickname = $('#user_input').val();

    if(userNickname === ""){
      alert("변경할 닉네임을 입력해주세요.");
      $('#user_input').focus();
      return false;
    }else {
      var parameter = {nickname: userNickname};

      HttpUtil.put(HOST_URL + '/api/v1/users/'+$('#nickname_container').data('id'), parameter, function (err, result) {
        if (result && result.status === 0) {
          alert("변경되었습니다.");
          location.reload = true;
        }
      });
    }
  }

  function bind() {
    $('#editBtn').click(function() {
      save();
    });

    $('#logout_btn').click(function() {
      HttpUtil.post(HOST_URL + '/api/v1/users/logout', function (err, result) {
        if (result && result.status === 0) {
          alert('로그아웃되었습니다.');
          location.href = '/login';
        }
      });
    });
  }

  $(document).ready(function() {
    bind();
  });


})(window);