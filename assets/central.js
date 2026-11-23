// =====================================================================
// ENDEREÇOS DO SITE CENTRAL — é só trocar aqui quando cada site for ao ar.
// Enquanto estiver vazio (""), o botão aparece como "Em breve".
// =====================================================================
window.CENTRAL = {
  // WhatsApp da Yasnnajára, só números, com 55 + DDD. Ex.: "5512999998888"
  whatsapp: "5584992112122",

  metodo:   "https://rafaheul.github.io/metodo-deusas-demo/",
  essenza:  "https://club-energiza.vercel.app/",   // Círculo Essenza (hoje é o formulário de cadastro do Club Energiza)
  perfil:   "https://perfil-de-mercado.vercel.app/",   // Perfil de Mercado Lucrativo: página de vendas (aberta em 23/11/2026)
  instagram:"https://instagram.com/yasnnajara_alves",

  // Produtos que ainda não abriram para o público. O cartão vira "Em breve" e o clique
  // abre o WhatsApp para a pessoa entrar na lista de espera. Quando abrir, é só tirar o nome daqui.
  listaDeEspera: {
    essenza: "Olá, Yasnnajára! Vim pelo site e quero entrar na lista de espera do Círculo Essenza."
  },

  // Depoimentos de clientes (SÓ com autorização dela). Lista vazia = a seção não aparece.
  // Modelo: { texto: "O que ela disse.", nome: "Ana", detalhe: "consulta, out/2026" },
  depoimentos: [
  ]
};

// --- daqui para baixo não precisa mexer ---
(function () {
  var C = window.CENTRAL;
  var msg = encodeURIComponent("Olá, Yasnnajára! Vim pelo site e quero marcar a consulta de quebra de padrões.");
  var zap = C.whatsapp ? "https://wa.me/" + C.whatsapp + "?text=" + msg : "";

  // lista de espera: troca o destino do cartão pelo WhatsApp com mensagem própria
  var espera = C.listaDeEspera || {};
  Object.keys(espera).forEach(function (k) {
    if (!C.whatsapp) return;
    document.querySelectorAll('[data-link="' + k + '"]').forEach(function (a) {
      a.setAttribute("data-link", "espera-" + k);
      a.classList.add("lista-espera");
      var selo = document.createElement("span"); selo.className = "card__selo"; selo.textContent = "Em breve";
      var ref = a.querySelector(".card__eyebrow") || a.querySelector(".card__titulo"); if (ref) ref.parentNode.insertBefore(selo, ref);
      var s = a.querySelector(".seta"); if (s) s.textContent = "Entrar na lista de espera →";
    });
  });

  var mapa = { metodo: C.metodo, essenza: C.essenza, perfil: C.perfil, instagram: C.instagram, whatsapp: zap };
  Object.keys(espera).forEach(function (k) {
    mapa["espera-" + k] = C.whatsapp ? "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(espera[k]) : "";
  });

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

  // depoimentos
  var dep = document.getElementById("depoimentos"), lista = (C.depoimentos || []).filter(function (d) { return d && d.texto; });
  if (dep && lista.length) {
    var caixa = dep.querySelector(".depo__lista");
    lista.forEach(function (d) {
      var f = document.createElement("figure"); f.className = "depo__item card";
      var q = document.createElement("blockquote"); q.textContent = d.texto; f.appendChild(q);
      var c = document.createElement("figcaption");
      var b = document.createElement("b"); b.textContent = d.nome || ""; c.appendChild(b);
      if (d.detalhe) c.appendChild(document.createTextNode((d.nome ? " · " : "") + d.detalhe));
      f.appendChild(c); caixa.appendChild(f);
    });
    dep.hidden = false;
  }

  // barra de marcar no celular: aparece quando a capa sai da tela
  var barra = document.querySelector(".c-barra"), capa = document.querySelector(".capa");
  if (barra && capa && zap && "IntersectionObserver" in window && !document.getElementById("capa")) {
    new IntersectionObserver(function (i) { barra.classList.toggle("mostra", !i[0].isIntersecting); }).observe(capa);
  }
})();
