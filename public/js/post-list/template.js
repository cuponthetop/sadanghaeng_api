(function (window) {
  'use strict';

  var PER_PAGE = 7;

  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '`': '&#x60;'
  };

  var escapeHtmlChar = function (chr) {
    return htmlEscapes[chr];
  };

  var reUnescapedHtml = /[&<>"'`]/g;
  var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  var escape = function (string) {
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  };

  /**
   * Sets up defaults for all the Template methods such as a default template
   *
   * @constructor
   */
  function Template() {
    this.defaultTemplate

      =	'<li data-id="{{id}}" class="post-item">'
      + '<div class="post-list-wrap">'
      +		'<a href="/post/{{id}}"">'
      +		'<div class="post-title">{{title}}</div>'
      +   '<div class="post-info">'
      +     '<span class="post-author">{{author}}</span>'
      +     '<span class="post-date">{{written}}</span>'
      +     '<span class="post-label post-view-label">View</span>'
      +     '<span class="post-value post-view">{{readCount}}</span>'
      +     '<span class="post-label post-like-label"></span>'
      +     '<span class="post-value post-like">{{likeCount}}</span>'
      +     '<span class="post-label post-dislike-label"></span>'
      +     '<span class="post-value post-dislike">{{dislikeCount}}</span>'
      +   '</div>'
      +   '</a>'
      +  '</div>'
      +  '<div class="comment-count-wrap">'
      +    '<span class="comment-img"></span><br>'
      +    '<span class="comment-label comment-count">{{commentCount}}</span>'
      +  '</div>'
      +	'</li>';

  }

  Template.prototype.paginationShow = function(data) {
    var totalPageCount = Math.ceil(data.count / PER_PAGE);
    var paginationTemplate = '<span class="text-center pagination-number {{isActive}}" data-value="{{pageVal}}">{{pageVal}}</span>'
    var view = '';

    for (var i=1; i<=totalPageCount; i++) {
      var template = paginationTemplate;
      if (i === 1) {
        template = template.replace('{{isActive}}', 'active');
      } else {
        template = template.replace('{{isActive}}', '');
      }
      template = template.replace(/{{pageVal}}/gi, i);

      view = view + template;
    }

    return view;
  };

  Template.prototype.show = function(data) {
    var i, l;
    var view = '';

    for (i = 0, l = data.length; i < l; i++) {
      var template = this.defaultTemplate;

      template = template.replace(/{{id}}/gi, data[i].pid);
      template = template.replace('{{title}}', data[i].title);
      template = template.replace('{{author}}', getAuthorStr(data[i].author));
      template = template.replace('{{written}}', getWrittenDateStr(data[i].written));
      template = template.replace('{{readCount}}', escape(data[i].readCount));
      template = template.replace('{{likeCount}}', escape(data[i].likeCount));
      template = template.replace('{{dislikeCount}}', escape(data[i].dislikeCount));
      template = template.replace('{{commentCount}}', escape(data[i].commentCount));

      view = view + template;
    }

    return view;
  };

  // Export to window
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
