// Animações do site central. Quem pediu "reduzir movimento" vê tudo parado e já aparecendo.
(function () {
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raiz = document.documentElement;
  var capa = document.querySelector('.capa');
  var video = document.querySelector('.capa__fio');


  // quebra o texto em palavras (cada uma dentro de uma "fresta") sem perder <em> nem o sublinhado
  function quebrar(el) {
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var n = 0;
    (function andar(no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (f) {
        if (f.nodeType === 3) {
          var partes = f.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          partes.forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var p = document.createElement('span'); p.className = 'p'; p.setAttribute('aria-hidden', 'true');
            var pi = document.createElement('span'); pi.className = 'pi'; pi.style.setProperty('--i', n++); pi.textContent = w;
            p.appendChild(pi); frag.appendChild(p);
          });
          no.replaceChild(frag, f);
        } else if (f.nodeType === 1 && f.tagName !== 'svg' && f.tagName !== 'SVG') andar(f);
      });
    })(el);
  }

  if (!reduz && 'IntersectionObserver' in window) {
    raiz.classList.add('anima');
    document.querySelectorAll('main h2, .topo h1').forEach(function (h) { h.classList.add('escreve'); });
    document.querySelectorAll('.escreve').forEach(quebrar);
    document.querySelectorAll('.capa .escreve').forEach(function (h) { h.style.setProperty('--d', '0ms'); });
    document.querySelectorAll('.card, .fio-divisor').forEach(function (el) {
      if (!el.classList.contains('fio-divisor')) el.classList.add('entra');
    });
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (i) {
        if (i.isIntersecting) { i.target.classList.add('visto'); obs.unobserve(i.target); }
      });
    }, { threshold: .18, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('main .escreve, .topo .escreve, .marca-texto').forEach(function (el) { obs.observe(el); });
    document.querySelectorAll('.entra, .fio-divisor').forEach(function (el, n) {
      el.style.transitionDelay = (n % 3) * 70 + 'ms';
      obs.observe(el);
    });
  }

  // o título entra quando o nó termina de se desfazer (ou logo, se o vídeo não tocar)
  if (capa) {
    var mostrou = false;
    var mostra = function () { if (!mostrou) { mostrou = true; capa.classList.add('mostra'); var h = capa.querySelector('.escreve'); if (h) h.classList.add('visto'); } };
    if (video && !reduz) {
      video.addEventListener('timeupdate', function () { if (video.currentTime > 2.9) mostra(); });
      video.addEventListener('ended', mostra);
      video.addEventListener('error', mostra);
      setTimeout(function () { if (video.paused || video.currentTime === 0) mostra(); }, 1200);
      setTimeout(mostra, 4500);
    } else { mostra(); }
    if (video && reduz) { video.removeAttribute('autoplay'); try { video.pause(); } catch (e) {} }
  }
})();
