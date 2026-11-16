(function () {
  'use strict';
  var root = document.getElementById('spatial-story');
  if (!root) return;
  var tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  var panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));

  function activate(index, focus, updateUrl) {
    if (index < 0 || index >= tabs.length) return;
    tabs.forEach(function (tab, i) {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    if (updateUrl) history.replaceState(null, '', '#' + panels[index].id);
  }

  function revealHash() {
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { return; }
    var target = id && document.getElementById(id);
    if (!target || !root.contains(target)) return;
    var panel = target.closest('[role="tabpanel"]');
    activate(panel ? panels.indexOf(panel) : 0, false, false);
    for (var parent = target.parentElement; parent && parent !== root; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
    requestAnimationFrame(function () { target.scrollIntoView({ block: 'start' }); });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { activate(index, false, true); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(next, true, true);
    });
  });

  activate(0, false, false);
  root.classList.add('is-enhanced');
  window.addEventListener('hashchange', revealHash);
  revealHash();
})();
