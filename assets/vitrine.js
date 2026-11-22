// Vitrine em arco: trilho que desliza, arco do centro em destaque, pontinhos e setas.
(function () {
  var trilho = document.querySelector('.vitrine__trilho');
  if (!trilho) return;
  var arcos = Array.prototype.slice.call(trilho.querySelectorAll('.arco'));
  var pontos = document.querySelector('.vitrine__pontos');
  var atual = 0;

  arcos.forEach(function (a, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab');
    var t = a.querySelector('.card__titulo');
    b.setAttribute('aria-label', t ? t.textContent : 'Caminho ' + (i + 1));
    b.addEventListener('click', function () { ir(i); });
    pontos.appendChild(b);
  });

  function marcar(i) {
    atual = i;
    arcos.forEach(function (a, k) { a.classList.toggle('ativo', k === i); });
    Array.prototype.forEach.call(pontos.children, function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
  }
  function ir(i) {
    i = Math.max(0, Math.min(arcos.length - 1, i));
    var a = arcos[i];
    trilho.scrollTo({ left: a.offsetLeft - (trilho.clientWidth - a.clientWidth) / 2, behavior: 'smooth' });
    marcar(i);
  }
  document.querySelectorAll('.vitrine__seta').forEach(function (b) {
    b.addEventListener('click', function () { ir(atual + Number(b.getAttribute('data-vai'))); });
  });

  // qual arco está mais perto do centro do trilho
  var pendente = false;
  function medir() {
    pendente = false;
    var meio = trilho.scrollLeft + trilho.clientWidth / 2, melhor = 0, menor = Infinity;
    arcos.forEach(function (a, k) {
      var d = Math.abs(a.offsetLeft + a.offsetWidth / 2 - meio);
      if (d < menor) { menor = d; melhor = k; }
    });
    if (melhor !== atual) marcar(melhor);
  }
  trilho.addEventListener('scroll', function () { if (!pendente) { pendente = true; requestAnimationFrame(medir); } }, { passive: true });
  window.addEventListener('resize', medir);
  marcar(0);

  // luz que segue o dedo/mouse dentro do arco
  arcos.forEach(function (a) {
    a.addEventListener('pointermove', function (e) {
      var r = a.getBoundingClientRect();
      a.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      a.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
})();
