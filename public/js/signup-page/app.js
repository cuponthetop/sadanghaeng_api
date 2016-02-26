(function (window) {
  'use strict';

  /**
   * Set up join page
   *
   * @param {string}
   */

  function validate() {
    var email = $('#user_email').val();
    var pwd = $('#user_pwd').val();
    var pwd2 = $('#user_pwd2').val();
    var status = true;
    if (!email) {
      alert("이메일을 입력해주세요.");
      status = false;
    }
    if (!pwd || !pwd2) {
      alert("패스워드를 입력해주세요.");
      status = false;
    }
    if (pwd !== pwd2) {
      alert("입력된 패스워드가 서로 다릅니다. 패스워드를 확인해주세요.");
      status = false;
    }
    return status;
  }

  function bind() {
    $('#signup_btn').click(function () {
      if (validate()) {
        var user = {
          email: $('#user_email').val(),
          password: $('#user_pwd').val()
        };
        HttpUtil.post(HOST_URL + '/api/v1/users/register', user, function (err, result) {
          if (err) {
            return;
          }
          alert('회원 가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
          location.href = '/login';
        });
      }
    });
  }

  $(document).ready(function() {
    bind();
  });

})(window);
