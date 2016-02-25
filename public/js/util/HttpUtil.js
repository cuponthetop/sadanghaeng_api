(function (window) {
  var requestMethod = {};
  var isProcessing = false;

  var HttpUtil = {};

  /**
   * HttpUtil.get
   *
   * @param url
   * @param params: data
   * @param callback: function(err, result)
   */
  HttpUtil.get = function (url, params, callback) {
    if (arguments.length < 3) {
      callback = params;
      params = null;
    }
    if (requestMethod.requestUrl === url) {
      requestMethod.abort();
    }
    requestMethod = $.ajax({
      method: 'GET',
      url: url,
      data: params,
      error: function errorHandler(jqXHR, textStatus, errorThrown) {
        callback("status : " + jqXHR.status + " msg : " + textStatus);
      },
      success: function successHandler(data, textStatus, jqXHR) {
        callback(null, data);
        requestMethod = {};
      },
      xhrFields: {
        withCredentials: true
      }

    });
    requestMethod.url = url;
  };

  /**
   * HttpUtil.post
   *
   * @param url
   * @param params: data
   * @param callback: function(err, result)
   */
  HttpUtil.post = function (url, params, callback) {
    if (arguments.length < 3) {
      callback = params;
      params = {};
    }
    if (isProcessing) return;
    isProcessing = true;
    $.ajax({
      method: 'POST',
      url: url,
      data: JSON.stringify(params),
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json',
      error: function errorHandler(jqXHR, textStatus, errorThrown) {
        callback("status : " + jqXHR.status + " msg : " + textStatus);
      },
      success: function successHandler(data, status, xhr) {
        callback(null, data);
      },
      complete: function () {
        isProcessing = false;
      },
      xhrFields: {
        withCredentials: true
      }
    })
  };

  /**
   * HttpUtil.put
   *
   * @param url
   * @param params: data
   * @param callback: function(err, result)
   */
  HttpUtil.put = function (url, params, callback) {
    if (arguments.length < 3) {
      callback = params;
      params = {};
    }
    if (isProcessing) return;
    isProcessing = true;
    $.ajax({
      method: 'PUT',
      url: url,
      data: JSON.stringify(params),
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json',
      error: function errorHandler(jqXHR, textStatus, errorThrown) {
        callback("status : " + jqXHR.status + " msg : " + textStatus);
      },
      success: function successHandler(data, status, xhr) {
        callback(null, data);
      },
      complete: function () {
        isProcessing = false;
      },
      xhrFields: {
        withCredentials: true
      }
    })
  };

  /**
   * HttpUtil.delete
   *
   * @param url
   * @param params: data
   * @param callback: function(err, result)
   */
  HttpUtil["delete"] = function (url, params, callback) {
    if (arguments.length < 3) {
      callback = params;
      params = {};
    }
    if (isProcessing) return;
    isProcessing = true;
    $.ajax({
      method: 'DELETE',
      url: url,
      data: JSON.stringify(params),
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json',
      error: function errorHandler(jqXHR, textStatus, errorThrown) {
        callback("status : " + jqXHR.status + " msg : " + textStatus);
      },
      success: function successHandler(data, status, xhr) {
        callback(null, data);
      },
      complete: function () {
        isProcessing = false;
      }
    })
  };

  window.HOST_URL = 'http://localhost:5001';
  window.HttpUtil = HttpUtil;

})(window);