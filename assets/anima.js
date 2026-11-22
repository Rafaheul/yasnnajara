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

  // sublinhado: só risca depois que a última palavra assentou (e depois do que mais for esperado, como o vídeo)
  function riscar(h, antes) {
    var n = h.querySelectorAll('.pi').length;
    var palavras = new Promise(function (r) { setTimeout(r, Math.max(0, n - 1) * 75 + 1050); });
    Promise.all([palavras, antes || Promise.resolve()]).then(function () {
      // na capa, primeiro o ramo sobe da linha; depois o sublinhado corre
      var ramo = capa && capa.contains(h) ? capa.querySelector('.capa__ramo') : null;
      if (ramo) { tracarRamo(); ramo.classList.add('on'); setTimeout(function () { h.classList.add('risca'); }, 720); }
      else h.classList.add('risca');
    });
  }

  // ramo: liga a linha que sobra do vídeo (entre as duas frases) ao começo do sublinhado de "ponta solta"
  function tracarRamo() {
    if (!capa) return;
    var svg = capa.querySelector('.capa__ramo'), sub = capa.querySelector('.sublinha svg'), linha = capa.querySelector('.capa__linha');
    if (!svg || !sub || !linha) return;
    var c = capa.getBoundingClientRect(), r = sub.getBoundingClientRect(), l = linha.getBoundingClientRect();
    var sx = r.left - c.left + r.width * 4 / 240, sy = r.top - c.top + r.height * 14 / 40;
    var ly = l.top - c.top + l.height / 2, x0 = sx - 38;
    svg.setAttribute('viewBox', '0 0 ' + c.width.toFixed(1) + ' ' + c.height.toFixed(1));
    var p = svg.querySelector('path');
    p.setAttribute('pathLength', '1');
    p.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + ly.toFixed(1) +
      ' C' + (x0 + 24).toFixed(1) + ' ' + ly.toFixed(1) + ' ' + (sx - 14).toFixed(1) + ' ' + (sy + (ly - sy) * 0.62).toFixed(1) + ' ' + sx.toFixed(1) + ' ' + sy.toFixed(1));
  }
  tracarRamo();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(tracarRamo);
  addEventListener('resize', tracarRamo);
  addEventListener('load', tracarRamo);
  window.__riscar = riscar;

  // fim do vídeo da capa (ou na hora, se ele não tocar)
  var fimVideo = new Promise(function (res) {
    if (!video || reduz) return res();
    video.addEventListener('ended', res);
    video.addEventListener('error', res);
    setTimeout(function () { if (video.paused && video.currentTime === 0) res(); }, 1200);
    setTimeout(res, 9000);
  });

  // o título entra quando o nó termina de se desfazer (ou logo, se o vídeo não tocar)
  if (capa) {
    var mostrou = false;
    var mostra = function () { if (!mostrou) { mostrou = true; capa.classList.add('mostra'); var h = capa.querySelector('.escreve'); if (h) { h.classList.add('visto'); riscar(h, fimVideo); } } };
    if (video && !reduz) {
      video.addEventListener('timeupdate', function () { if (video.currentTime > 2.9) mostra(); });
      video.addEventListener('ended', mostra);
      video.addEventListener('error', mostra);
      setTimeout(function () { if (video.paused || video.currentTime === 0) mostra(); }, 1200);
      setTimeout(mostra, 4500);
    } else { mostra(); }
    // Quando o vídeo não pode tocar sozinho ("reduzir movimento", modo de pouca bateria do iPhone),
    // o celular mostraria um botão de play por cima. Nesses casos ele vira a imagem parada da linha final.
    var trocou = false;
    function virarImagem() {
      if (trocou || !video || !video.parentNode) return; trocou = true;
      var img = document.createElement('img');
      img.className = video.className; img.alt = ''; img.setAttribute('aria-hidden', 'true');
      img.src = 'assets/no-fim.jpg?v=202611230100';
      try { video.pause(); } catch (e) {}
      video.parentNode.replaceChild(img, video);
    }
    if (video && reduz) virarImagem();
    else if (video) {
      try { var tentativa = video.play(); if (tentativa && tentativa.catch) tentativa.catch(virarImagem); } catch (e) { virarImagem(); }
      setTimeout(function () { if (video.paused && !video.ended && video.currentTime === 0 && video.readyState >= 2) virarImagem(); }, 1500);
    }
  }
})();
