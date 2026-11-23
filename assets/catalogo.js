// Catálogo: botão "Agendar" de cada serviço e a entrada da carta.
(function () {
  var C = window.CENTRAL || {};

  // cada serviço abre o WhatsApp já com o nome do serviço na mensagem
  document.querySelectorAll('[data-servico]').forEach(function (a) {
    if (!C.whatsapp) { a.removeAttribute('href'); return; }
    var msg = 'Olá, Yasnnajára! Vim pelo site e quero agendar ' + a.getAttribute('data-servico') + '.';
    a.href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg);
    a.target = '_blank'; a.rel = 'noopener';
  });

  // os serviços entram um a um quando a carta chega na tela; luz segue o dedo
  var carta = document.querySelector('.carta');
  if (!carta) return;
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
})();
