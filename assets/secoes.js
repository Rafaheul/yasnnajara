// "Prazer" e "Como eu trabalho": revelação, paralaxe do retrato, texto que acende e trança que se desenha com a rolagem.
(function () {
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prazer = document.querySelector('.prazer');
  var foto = document.querySelector('.prazer__arco img');
  var lento = document.querySelector('.como__lento');
  var tranca = document.querySelector('.tranca');
  var fios = document.querySelectorAll('.tranca__fio');
  var bases = document.querySelectorAll('.base-fio');
  var frase = document.querySelector('.como__frase');

  // o selo: o texto ocupa a volta inteira
  var t = document.querySelector('.prazer__selo text');
  if (t) { t.setAttribute('textLength', '272'); t.setAttribute('lengthAdjust', 'spacing'); }

  // quebra o parágrafo em palavras
  var palavras = [];
  if (lento) {
    var txt = lento.textContent.replace(/\s+/g, ' ').trim();
    lento.setAttribute('aria-label', txt);
    lento.textContent = '';
    txt.split(' ').forEach(function (w, i) {
      var s = document.createElement('span'); s.className = 'pl'; s.setAttribute('aria-hidden', 'true'); s.textContent = w;
      lento.appendChild(s); lento.appendChild(document.createTextNode(' '));
      palavras.push(s);
    });
  }

  if (reduz || !('IntersectionObserver' in window)) {
    palavras.forEach(function (s) { s.classList.add('on'); });
    bases.forEach(function (b) { b.classList.add('aceso'); });
    return;
  }

  var obs = new IntersectionObserver(function (itens) {
    itens.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add('visto'); obs.unobserve(i.target); } });
  }, { threshold: .25 });
  if (prazer) obs.observe(prazer);
  if (frase) obs.observe(frase);
  var ficha = document.querySelector('.prazer__ficha'); if (ficha) obs.observe(ficha);

  function progresso(el, ini, fim) {      // 0 quando o topo está em ini·altura da tela, 1 quando o fundo chega em fim·altura
    var r = el.getBoundingClientRect(), h = innerHeight;
    var a = h * ini - r.top, total = r.height + h * (ini - fim);
    return Math.max(0, Math.min(1, a / total));
  }

  var pendente = false;
  function quadro() {
    pendente = false;
    var h = innerHeight;
    // paralaxe do retrato
    if (foto && prazer) {
      var r = prazer.getBoundingClientRect();
      if (r.bottom > 0 && r.top < h) {
        var c = (r.top + r.height / 2 - h / 2) / h;     // -1..1
        foto.style.setProperty('--par', (c * -34).toFixed(1) + 'px');
      }
    }
    // palavras que acendem
    if (lento && palavras.length) {
      var p = progresso(lento, .88, .45), n = Math.round(p * palavras.length);
      palavras.forEach(function (s, i) { s.classList.toggle('on', i < n); s.classList.toggle('agora', i >= n - 3 && i < n && n < palavras.length); });
    }
    // trança
    if (tranca) {
      var q = progresso(tranca, .8, .55);
      fios.forEach(function (f) { f.style.setProperty('--off', (1 - q).toFixed(4)); });
      bases.forEach(function (b) {
        var meio = (b.offsetTop + 24) / tranca.offsetHeight;
        b.classList.toggle('aceso', q >= meio);
      });
    }
  }
  function pedir() { if (!pendente) { pendente = true; requestAnimationFrame(quadro); } }
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  quadro();
})();
