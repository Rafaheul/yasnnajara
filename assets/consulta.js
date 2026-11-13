// Página da consulta: título da abertura, fio da linha do tempo e barra de marcar no celular.
(function () {
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // título da abertura se escreve logo que a página abre
  var titulo = document.querySelector('.c-capa .escreve');
  if (titulo) setTimeout(function () { titulo.classList.add('visto'); }, 200);

  // linha do tempo: o fio desce conforme a rolagem e acende cada passo
  var trilha = document.querySelector('.trilha');
  var passos = trilha ? [].slice.call(trilha.querySelectorAll('.trilha__passo')) : [];
  function atualizar() {
    if (!trilha) return;
    if (reduz) { trilha.style.setProperty('--p', 1); passos.forEach(function (p) { p.classList.add('aceso'); }); return; }
    var r = trilha.getBoundingClientRect(), alvo = innerHeight * .62;
    var p = Math.min(1, Math.max(0, (alvo - r.top) / (r.height - 40)));
    trilha.style.setProperty('--p', p.toFixed(3));
    passos.forEach(function (el) { el.classList.toggle('aceso', el.getBoundingClientRect().top + 18 < alvo); });
  }
  var pedido = false;
  addEventListener('scroll', function () {
    if (!pedido) { pedido = true; requestAnimationFrame(function () { pedido = false; atualizar(); }); }
  }, { passive: true });
  addEventListener('resize', atualizar);
  atualizar();

  // barra de marcar: aparece depois da abertura e some no fechamento (que já tem o botão)
  var barra = document.querySelector('.c-barra');
  var capa = document.getElementById('capa'), fim = document.getElementById('fim');
  if (barra && capa && fim && 'IntersectionObserver' in window) {
    var vendo = { capa: true, fim: false };
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (i) { vendo[i.target.id] = i.isIntersecting; });
      barra.classList.toggle('mostra', !vendo.capa && !vendo.fim);
    });
    obs.observe(capa); obs.observe(fim);
  }
})();
