// =====================================================================
// ENDEREÇOS DO SITE CENTRAL — é só trocar aqui quando cada site for ao ar.
// Enquanto estiver vazio (""), o botão aparece como "Em breve".
// =====================================================================
window.CENTRAL = {
  // WhatsApp da Yasnnajára, só números, com 55 + DDD. Ex.: "5512999998888"
  whatsapp: "5584992112122",

  metodo:   "https://rafaheul.github.io/metodo-deusas-demo/",
  essenza:  "https://club-energiza.vercel.app/",   // Círculo Essenza (hoje é o formulário de cadastro do Club Energiza)
  perfil:   "https://perfil-de-mercado.vercel.app/",   // Perfil de Mercado (hoje só entra com código de convite)
  instagram:"https://instagram.com/yasnnajara_alves"
};

// --- daqui para baixo não precisa mexer ---
(function () {
  var C = window.CENTRAL;
  var msg = encodeURIComponent("Olá, Yasnnajára! Vim pelo site e quero marcar a consulta de quebra de padrões.");
  var zap = C.whatsapp ? "https://wa.me/" + C.whatsapp + "?text=" + msg : "";
  var mapa = { metodo: C.metodo, essenza: C.essenza, perfil: C.perfil, instagram: C.instagram, whatsapp: zap };

  document.querySelectorAll("[data-link]").forEach(function (a) {
    var url = mapa[a.getAttribute("data-link")];
    if (url) {
      a.href = url;
      if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; }
    } else {
      a.removeAttribute("href");
      a.classList.add("em-breve");
      var s = a.querySelector(".seta");
      if (s) s.textContent = "Em breve";
    }
  });
})();
