(function() {
  'use strict';

  var STORAGE_KEY = 'jdg_comments_' + location.pathname.replace(/[^a-z0-9]/gi, '_');

  function getComments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch(e) {
      return [];
    }
  }

  function saveComments(comments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }

  function timeAgo(dateStr) {
    var diff = Date.now() - new Date(dateStr).getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    var days = Math.floor(hrs / 24);
    if (days < 30) return days + 'd ago';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getInitials(name) {
    return name.split(' ').map(function(w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  }

  function avatarColor(name) {
    var colors = ['#C85A00','#E8745B','#2563EB','#059669','#7C3AED','#DB2777','#D97706','#4F46E5'];
    var hash = 0;
    for (var i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  function renderComments() {
    var list = document.getElementById('jdg-comments-list');
    var count = document.getElementById('jdg-comments-count');
    var comments = getComments();

    count.textContent = comments.length + (comments.length === 1 ? ' comment' : ' comments');

    if (comments.length === 0) {
      list.innerHTML = '<div style="text-align:center; padding:40px 20px; color:#9aa1ad; font-family:\'Outfit\',sans-serif;">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" style="margin-bottom:12px;">' +
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '<p style="margin:0; font-size:15px;">Be the first to share your thoughts!</p></div>';
      return;
    }

    list.innerHTML = comments.map(function(c, i) {
      var bg = avatarColor(c.name);
      return '<div style="display:flex; gap:14px; padding:20px 0; border-bottom:1px solid rgba(26,35,50,0.07);">' +
        '<div style="flex-shrink:0; width:40px; height:40px; border-radius:50%; background:' + bg + '; display:flex; align-items:center; justify-content:center; font-family:\'Outfit\',sans-serif; font-weight:600; font-size:14px; color:#fff;">' + getInitials(c.name) + '</div>' +
        '<div style="flex:1; min-width:0;">' +
        '<div style="display:flex; align-items:center; gap:10px; margin-bottom:6px; flex-wrap:wrap;">' +
        '<span style="font-family:\'Outfit\',sans-serif; font-weight:600; font-size:14px; color:#1A2332;">' + escapeHtml(c.name) + '</span>' +
        '<span style="font-size:13px; color:#9aa1ad;">' + timeAgo(c.date) + '</span>' +
        '</div>' +
        '<p style="margin:0; font-size:15px; line-height:1.6; color:#454f60; word-wrap:break-word;">' + escapeHtml(c.text) + '</p>' +
        '</div></div>';
    }).join('');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var name = form.querySelector('[name="commenter-name"]').value.trim();
    var text = form.querySelector('[name="commenter-text"]').value.trim();

    if (!name || !text) return;

    var comments = getComments();
    comments.unshift({ name: name, text: text, date: new Date().toISOString() });
    saveComments(comments);

    form.querySelector('[name="commenter-text"]').value = '';
    renderComments();
  }

  // Init
  document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('jdg-comment-form');
    if (form) {
      form.addEventListener('submit', handleSubmit);
      renderComments();
    }
  });
})();
