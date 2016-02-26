(function (window) {
  'use strict';

  /**
   * Set up login page
   *
   * @param {string}
   */

  function validate() {
    var email = $('#user_email').val();
    var pwd = $('#user_pwd').val();
    var status = true;
    if (!email) {
      alert("이메일을 입력해주세요.");
      status = false;
    } else if (!pwd) {
      alert("패스워드를 입력해주세요.");
      status = false;
    }
    return status;
  }

  function bind() {
    HttpUtil.get(HOST_URL + '/api/v1/stats/universities', function (err, result) {
      if (result.status === 0) {
        $('#university_stat').text(result.value.count + "개 학교");
      } else {
        alert('server not found');
      }
    });

    HttpUtil.get(HOST_URL + '/api/v1/stats/posts', function (err, result) {
      if (result.status === 0) {
        $('#post_stat').text(result.value.count + "개 글");
      } else {
        alert('server not found');
      }
    });

    $('#login_btn').click(function () {
      if (true === validate()) {
        var user = {
          email: $('#user_email').val(),
          password: $('#user_pwd').val()
        };
        HttpUtil.post(HOST_URL + '/api/v1/users/login', user, function (err, result) {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log(result);
            window.location = "/main";
          }
        });
      }
    });

    $('#join_btn').click(function () {
      window.location = "/signup";
    });
  }


  $(document).ready(function () {
    bind();
  });

})(window);
