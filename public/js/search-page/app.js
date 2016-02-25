(function (window) {
  'use strict';

  /**
   * Set up search page
   *
   * @param {string}   ////////// ??????????????????????
   */
  function SearchResultList() {
    this.model = new app.Model();
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }

  var searchResultList = new SearchResultList();

  function setView() {
    searchResultList.controller.setView();
  }

///////////////////////////////////////////////////////////////
  var univId = $('#univ_container').data('id');

  function validate() {
    var regExCheckEmptyText = /(^\s*)(\s*$)/;
    var searchInput = $('#search_input').val();
    var status = true;
    
    if(!searchInput || regExCheckEmptyText.test(searchInput)) {
      alert("검색어를 제대로 입력해주세요!");
      status = false;
    }
    
    return status;
  }
  
  function bind() {
    $('#search_btn').click(function () {
      if (validate() === true) {
        var searchInput = {
          query: $('#search_input').val()
        , page: 1         // ||
        , sort: 'asc'     // ||
        , fields: 'title' // ||
        , perPage: 10     // ||
        };

        HttpUtil.get('http://localhost:5001/api/v1/universities/'+univId+'/search', searchInput, function (err, result) {
          if (err) {
            return;
          }
          console.log(result);
        });
      }
    });
  }

  $(document).ready(function() {
    setView(); ///////////////////////위치 여기 맞나?
    bind();
  });

})(window);
