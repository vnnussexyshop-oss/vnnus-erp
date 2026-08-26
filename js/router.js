const VNNUS_ROUTES = {

  dashboard: {
    file: "pages/dashboard.html",
    title: "Dashboard",
    subtitle: "Visão geral da operação"
  },

  produtos: {
    file: "pages/produtos.html",
    title: "Produtos",
    subtitle: "Cadastro e gerenciamento de produtos"
  },

  scanner: {
    file: "pages/scanner.html",
    title: "Scanner",
    subtitle: "Leitura de código de barras"
  },

  estoque: {
    file: "pages/estoque.html",
    title: "Estoque",
    subtitle: "Entradas, saídas e saldo"
  },

  pdv: {
    file: "pages/pdv.html",
    title: "PDV",
    subtitle: "Nova venda"
  },

  vendas: {
    file: "pages/vendas.html",
    title: "Vendas",
    subtitle: "Histórico e comprovantes"
  },

  clientes: {
    file: "pages/clientes.html",
    title: "Clientes",
    subtitle: "Cadastro e histórico"
  },

  financeiro: {
    file: "pages/financeiro.html",
    title: "Financeiro",
    subtitle: "Faturamento, custos e lucro"
  },

  "contas-receber": {
    file: "pages/contas-receber.html",
    title: "Contas a Receber",
    subtitle: "Parcelas, vencimentos e recebimentos"
  },

  despesas: {
    file: "pages/despesas.html",
    title: "Despesas",
    subtitle: "Contas a pagar e despesas"
  },

  configuracoes: {
    file: "pages/configuracoes.html",
    title: "Configurações",
    subtitle: "Preferências e integrações"
  }

};


async function navigateTo(pageName) {

  const r =
    VNNUS_ROUTES[pageName] ||
    VNNUS_ROUTES.dashboard;


  document
    .getElementById(
      "pageTitle"
    )
    .textContent =
      r.title;


  document
    .getElementById(
      "pageSubtitle"
    )
    .textContent =
      r.subtitle;


  document
    .querySelectorAll(
      ".menu-item"
    )
    .forEach(
      function(botao) {

        botao.classList.toggle(
          "active",
          botao.dataset.page ===
            pageName
        );

      }
    );


  const conteudo =
    document.getElementById(
      "appContent"
    );


  conteudo.innerHTML =
    '<div class="loading-card">Carregando...</div>';


  try {

    const resposta =
      await fetch(
        r.file,
        {
          cache:
            "no-store"
        }
      );


    if (
      !resposta.ok
    ) {

      throw new Error(
        "Não foi possível carregar " +
        r.file
      );

    }


    conteudo.innerHTML =
      await resposta.text();


    [
      ...conteudo.querySelectorAll(
        "script"
      )
    ]
      .forEach(
        function(script) {

          const novoScript =
            document.createElement(
              "script"
            );


          novoScript.textContent =
            script.textContent;


          document.body
            .appendChild(
              novoScript
            );


          novoScript.remove();

        }
      );


    const nomeInit =
      "init_" +
      pageName;


    if (
      typeof window[
        nomeInit
      ] ===
      "function"
    ) {

      await window[
        nomeInit
      ]();

    }


    history.replaceState(
      null,
      "",
      "#" + pageName
    );


    closeMobileMenu();

  }

  catch (erro) {

    conteudo.innerHTML =
      '<div class="empty-state">' +
      '<strong>Erro ao carregar a página.</strong>' +
      '<p style="margin-top:8px">' +
      erro.message +
      '</p>' +
      '</div>';

  }

}
