jQuery(function ($) {
  window.$ = $;

  window.getAuthorStr = function (str) {
    if (str.length > 6) {
      str = str.substring(0, 6) + "...";
    }
    return str;
  };

  window.getWrittenDateStr = function (dateVal) {
    var tmpDate = new Date(dateVal);
    return tmpDate.getFullYear() + '.' + (tmpDate.getMonth() + 1) + '.' + tmpDate.getDate();
  };

});
