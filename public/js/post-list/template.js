(function (window) {
  'use strict';

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
      +		'<a href="/post/{{id}}"">'
      +		'<div class="post-title">{{title}}</div>'
      +   '<div class="post-info">'
      +     '<span class="post-author">{{author}}</span>'
      +     '<span class="post-date">{{written}}</span>'
      +     '<span class="post-label post-view-label">View</span>'
      +     '<span class="post-value post-view">{{readCount}}</span>'
      +     '<span class="post-label post-like-label active"></span>'
      +     '<span class="post-value post-like">{{likeCount}}</span>'
      +     '<span class="post-label post-dislike-label"></span>'
      +     '<span class="post-value post-dislike">{{dislikeCount}}</span>'
      +   '</div>'
      +   '</a>'
      +	'</li>';
  }

  Template.prototype.show = function(data) {
    var i, l;
    var view = '';

    for (i = 0, l = data.length; i < l; i++) {
      var template = this.defaultTemplate;

      template = template.replace(/{{id}}/gi, data[i].pid);
      template = template.replace('{{title}}', escape(data[i].title));
      template = template.replace('{{author}}', escape(data[i].author));
      template = template.replace('{{written}}', escape(data[i].written));
      template = template.replace('{{readCount}}', escape(data[i].readCount));
      template = template.replace('{{likeCount}}', escape(data[i].likeCount));
      template = template.replace('{{dislikeCount}}', escape(data[i].dislikeCount));

      view = view + template;
    }

    return view;
  };

  // Export to window
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
