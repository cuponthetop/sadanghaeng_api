jQuery(function ($) {
  window.$ = $;

  window.getWrittenDateStr = function(dateVal) {
    var tmpDate = new Date(dateVal);
    return tmpDate.toLocaleDateString();
  };

});
