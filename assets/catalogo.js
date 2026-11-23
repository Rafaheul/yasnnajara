// Catálogo: abas Serviços / Produtos e o botão "Agendar" de cada serviço.
(function () {
  var C = window.CENTRAL || {};
  var abas = document.querySelector('.catalogo__abas');
  if (!abas) return;
  var botoes = Array.prototype.slice.call(abas.querySelectorAll('.catalogo__aba'));

  // cada serviço abre o WhatsApp já com o nome do serviço na mensagem
  document.querySelectorAll('[data-servico]').forEach(function (a) {
    if (!C.whatsapp) { a.removeAttribute('href'); return; }
    var msg = 'Olá, Yasnnajára! Vim pelo site e quero agendar ' + a.getAttribute('data-servico') + '.';
    a.href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg);
    a.target = '_blank'; a.rel = 'noopener';
  });

  function abrir(qual, foco) {
    botoes.forEach(function (b) {
      var sim = b.getAttribute('aria-controls') === qual;
      b.setAttribute('aria-selected', sim ? 'true' : 'false');
      b.tabIndex = sim ? 0 : -1;
      var painel = document.getElementById(b.getAttribute('aria-controls'));
      if (sim && painel.hidden) {
        painel.hidden = false;
        painel.classList.remove('entrando'); void painel.offsetWidth; painel.classList.add('entrando');
      } else if (!sim) painel.hidden = true;
      if (sim && foco) b.focus();
    });
    abas.setAttribute('data-aba', qual);
    // a vitrine dos produtos estava escondida: mede de novo o arco do centro
    if (qual === 'produtos') window.dispatchEvent(new Event('resize'));
  }

  botoes.forEach(function (b, i) {
    b.addEventListener('click', function () { abrir(b.getAttribute('aria-controls')); });
    b.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var outro = botoes[(i + 1) % botoes.length];
      abrir(outro.getAttribute('aria-controls'), true);
    });
  });

  // links como index.html#servicos ou #produtos abrem a aba certa
  function pelaHash() {
    var h = location.hash.slice(1);
    if (h === 'servicos' || h === 'produtos') {
      abrir(h);
      var cat = document.getElementById('catalogo');
      if (cat) setTimeout(function () { cat.scrollIntoView({ block: 'start' }); }, 0);
    }
  }
  pelaHash();
  window.addEventListener('hashchange', pelaHash);

  // os serviços entram um a um quando a carta chega na tela; luz segue o dedo
  var carta = document.querySelector('.carta');
  if (carta) {
    carta.querySelectorAll('.servico-destaque, .servico').forEach(function (el, n) { el.style.setProperty('--i', n); });
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (i) {
        if (i[0].isIntersecting) { carta.classList.add('vista'); obs.disconnect(); }
      }, { threshold: .08 });
      obs.observe(carta);
    } else carta.classList.add('vista');
    carta.querySelectorAll('.servico').forEach(function (s) {
      s.addEventListener('pointermove', function (e) {
        var r = s.getBoundingClientRect();
        s.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      });
    });
  }
})();
