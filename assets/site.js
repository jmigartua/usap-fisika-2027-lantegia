/* Lantegia · teachers' copy: language switch (remembered per browser), math,
   and the tile panel on the Bases page. Everything works without it: the page
   then shows Basque and the tiles jump to their cards. */
(function () {
  var root = document.documentElement;
  var KEY = 'lantegia-lang';

  function apply(lang, store) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    var t = document.body.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    var bs = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    if (store) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  }
  apply(root.getAttribute('data-lang') === 'es' ? 'es' : 'eu', false);
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-set-lang]');
    if (b) apply(b.getAttribute('data-set-lang'), true);
  });

  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(document.body, {
        delimiters: [{ left: '$', right: '$', display: false }],
        throwOnError: false
      });
    } catch (e) {}
  }

  var pick = document.getElementById('pick');
  if (pick) {
    var tiles = document.querySelectorAll('.t[data-id]');
    function show(id, scroll) {
      var card = document.getElementById(id);
      if (!card) return;
      for (var i = 0; i < tiles.length; i++) tiles[i].classList.toggle('sel', tiles[i].getAttribute('data-id') === id);
      var c = card.cloneNode(true);
      c.removeAttribute('id');
      pick.innerHTML = '';
      pick.appendChild(c);
      var go = document.createElement('a');
      go.className = 'go';
      go.href = '#' + id;
      go.innerHTML = '<span class="l-eu" lang="eu">Zerrendan ikusi ↓</span><span class="l-es" lang="es">Ver en la lista ↓</span>';
      go.addEventListener('click', function (e) {
        e.preventDefault();
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { history.replaceState(null, '', '#' + id); } catch (er) {}
      });
      pick.appendChild(go);
      pick.hidden = false;
      if (scroll) pick.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener('click', function (e) {
        e.preventDefault();
        show(this.getAttribute('data-id'), true);
      });
    }
    var first = (location.hash || '').slice(1);
    show(/^[A-D]\d\d$/.test(first) ? first : 'A06', false);
  }
})();
