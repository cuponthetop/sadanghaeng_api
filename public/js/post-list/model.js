(function (window) {
  'use strict';

  /**
   * Creates a new Model instance.
   *
   * @constructor
   */
  function Model() {

  }

  Model.prototype.getTotalPostCount = function (parameter, callback) {
    HttpUtil.get(HOST_URL + '/api/v1/stats/universities/' + parameter.univid + '/posts', parameter, function (err, result) {
      if (result && result.status === 0) {
        callback(result.value);
      }
    });
  };

  Model.prototype.getUnivInfo = function (parameter, callback) {
    HttpUtil.get(HOST_URL + '/api/v1/universities/' + parameter.univid, function (err, result) {
      if (err) {
        return callback("가림판");
      }
      if (result.status === 0) {
        callback(result.value.name + " 가림판");
      } else {
        callback("가림판");
      }
    });
  };

  Model.prototype.getPostList = function (parameter, callback) {
    HttpUtil.get(HOST_URL + '/api/v1/universities/' + parameter.univid + '/posts', parameter, function (err, result) {
      if (err) {
        return callback([]);
      }
      if (result && result.status === 0) {
        callback(result.value);
      } else {
        callback([]);
      }
    });
  };

  // Export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);