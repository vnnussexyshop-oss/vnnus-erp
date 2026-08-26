/* =====================================================
   VNNUS ERP
   ROUTER 2.3
   ROTAS + CONTROLE DE ACESSO
===================================================== */

const VNNUS_ROUTES = {

  dashboard: {
    file: "pages/dashboard.html",
    title: "Dashboard",
    subtitle: "Visão geral da operação",
    init: "init_dashboard"
  },

  produtos: {
    file: "pages/produtos.html",
    title: "Produtos",
    subtitle: "Cadastro e gerenciamento de produtos",
    init: "init_produtos"
  },

  scanner: {
    file: "pages/scanner.html",
    title: "Scanner",
    subtitle: "Leitura de código de barras",
    init: "init_scanner"
  },

  estoque: {
    file: "pages/estoque.html",
    title: "Estoque",
    subtitle: "Entradas, saídas e saldo",
    init: "init_estoque"
  },

  pdv: {
    file: "pages/pdv.html",
    title: "PDV",
    subtitle: "Nova venda",
    init: "init_pdv"
  },

  vendas: {
    file: "pages/vendas.html",
    title: "Vendas",
    subtitle: "Histórico e comprovantes",
    init: "init_vendas"
  },

  clientes: {
    file: "pages/clientes.html",
    title: "Clientes",
    subtitle: "Cadastro e histórico",
    init: "init_clientes"
  },

  financeiro: {
    file: "pages/financeiro.html",
    title: "Financeiro",
    subtitle: "Faturamento, custos e lucro",
    init: "init_financeiro"
  },

  "contas-receber": {
    file: "pages/contas-receber.html",
    title: "Contas a Receber",
    subtitle: "Parcelas, vencimentos e recebimentos",
    init: "init_contas_receber"
  },

  despesas: {
    file: "pages/despesas.html",
    title: "Despesas",
    subtitle: "Contas a pagar e despesas",
    init: "init_despesas"
  },

  colaboradores: {
    file: "pages/colaboradores.html",
    title: "Colaboradores",
    subtitle: "Usuários, acessos e permissões",
    init: "init_colaboradores",

    perfisPermitidos: [
      "ADMINISTRADOR"
    ]
  },

  configuracoes: {
    file: "pages/configuracoes.html",
    title: "Configurações",
    subtitle: "Preferências e integrações",
    init: "init_configuracoes"
  }

};


/* =====================================================
   VERIFICAR PERMISSÃO DA ROTA
===================================================== */

function usuarioPodeAcessarRotaVnnus(
  rota
) {

  if (
    !rota ||
    !Array.isArray(
      rota.perfisPermitidos
    ) ||
    rota.perfisPermitidos.length === 0
  ) {

    return true;

  }


  if (
    !window.VNNUS_API
  ) {

    return false;

  }


  const colaborador =
    window.VNNUS_API
      .obterUsuarioSessao();


  if (!colaborador) {

    return false;

  }


  const perfil =
    String(
      colaborador.perfil ||
      ""
    )
    .trim()
    .toUpperCase();


  return rota.perfisPermitidos
    .includes(
      perfil
    );

}


/* =====================================================
   NAVEGAR
===================================================== */

async function navigateTo(
  pageName
) {

  let rota =
    VNNUS_ROUTES[
      pageName
    ];


  /*
    Rota inexistente
  */

  if (!rota) {

    pageName =
      "dashboard";

    rota =
      VNNUS_ROUTES.dashboard;

  }


  /*
    Proteção por perfil.

    Mesmo digitando #colaboradores
    manualmente, usuário sem autorização
    não consegue carregar a página.
  */

  if (
    !usuarioPodeAcessarRotaVnnus(
      rota
    )
  ) {

    console.warn(
      "Acesso negado à rota:",
      pageName
    );


    pageName =
      "dashboard";

    rota =
      VNNUS_ROUTES.dashboard;


    const conteudo =
      document.getElementById(
        "appContent"
      );


    if (conteudo) {

      conteudo.innerHTML = `
        <div class="empty-state">

          <strong>
            Acesso não autorizado
          </strong>

          <p style="margin-top:8px">
            Seu perfil não possui permissão
            para acessar este módulo.
          </p>

        </div>
      `;

    }


    history.replaceState(
      null,
      "",
      "#dashboard"
    );


    setTimeout(
      function() {

        navigateTo(
          "dashboard"
        );

      },
      1200
    );


    return;

  }


  /* ===================================================
     TÍTULO
  =================================================== */

  const pageTitle =
    document.getElementById(
      "pageTitle"
    );


  const pageSubtitle =
    document.getElementById(
      "pageSubtitle"
    );


  if (pageTitle) {

    pageTitle.textContent =
      rota.title;

  }


  if (pageSubtitle) {

    pageSubtitle.textContent =
      rota.subtitle;

  }


  /* ===================================================
     MENU ATIVO
  =================================================== */

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


  /* ===================================================
     CONTEÚDO
  =================================================== */

  const conteudo =
    document.getElementById(
      "appContent"
    );


  if (!conteudo) {

    console.error(
      "appContent não encontrado."
    );

    return;

  }


  conteudo.innerHTML =
    '<div class="loading-card">Carregando...</div>';


  try {

    const resposta =
      await fetch(
        rota.file,
        {
          cache: "no-store"
        }
      );


    if (!resposta.ok) {

      throw new Error(
        "Não foi possível carregar " +
        rota.file
      );

    }


    conteudo.innerHTML =
      await resposta.text();


    /* ===============================================
       EXECUTAR SCRIPTS INTERNOS DA PÁGINA
    =============================================== */

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


    /* ===============================================
       INICIALIZAR MÓDULO
    =============================================== */

    const nomeInit =
      rota.init ||
      (
        "init_" +
        String(
          pageName
        )
        .replace(
          /-/g,
          "_"
        )
      );


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

    else {

      console.warn(
        "Função de inicialização não encontrada:",
        nomeInit
      );

    }


    /* ===============================================
       ATUALIZAR HASH
    =============================================== */

    history.replaceState(
      null,
      "",
      "#" + pageName
    );


    /* ===============================================
       FECHAR MENU MOBILE
    =============================================== */

    if (
      typeof closeMobileMenu ===
      "function"
    ) {

      closeMobileMenu();

    }

  }

  catch (erro) {

    console.error(
      "Router:",
      erro
    );


    conteudo.innerHTML = `
      <div class="empty-state">

        <strong>
          Erro ao carregar a página.
        </strong>

        <p style="margin-top:8px">
          ${
            erro.message ||
            String(erro)
          }
        </p>

      </div>
    `;

  }

}


/* =====================================================
   FIM
   ROUTER 2.3
===================================================== */
