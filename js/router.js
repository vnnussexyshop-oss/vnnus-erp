/* =====================================================
   VNNUS ERP
   ROUTER 2.4
   ROTAS + CONTROLE DE ACESSO POR PERFIL
===================================================== */

const VNNUS_ROUTES = {

  dashboard: {
    file: "pages/dashboard.html",
    title: "Dashboard",
    subtitle: "Visão geral da operação",
    init: "init_dashboard",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE"
    ]
  },

  produtos: {
    file: "pages/produtos.html",
    title: "Produtos",
    subtitle: "Cadastro e gerenciamento de produtos",
    init: "init_produtos",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE",
      "VENDEDOR",
      "ESTOQUE"
    ]
  },

  scanner: {
    file: "pages/scanner.html",
    title: "Scanner",
    subtitle: "Leitura de código de barras",
    init: "init_scanner",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE",
      "VENDEDOR",
      "ESTOQUE"
    ]
  },

  estoque: {
    file: "pages/estoque.html",
    title: "Estoque",
    subtitle: "Entradas, saídas e saldo",
    init: "init_estoque",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE",
      "ESTOQUE"
    ]
  },

  pdv: {
    file: "pages/pdv.html",
    title: "PDV",
    subtitle: "Nova venda",
    init: "init_pdv",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE",
      "VENDEDOR"
    ]
  },

  vendas: {
    file: "pages/vendas.html",
    title: "Vendas",
    subtitle: "Histórico e comprovantes",
    init: "init_vendas",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE",
      "VENDEDOR"
    ]
  },

  clientes: {
    file: "pages/clientes.html",
    title: "Clientes",
    subtitle: "Cadastro e histórico",
    init: "init_clientes",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE",
      "VENDEDOR"
    ]
  },

  financeiro: {
    file: "pages/financeiro.html",
    title: "Financeiro",
    subtitle: "Faturamento, custos e lucro",
    init: "init_financeiro",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE"
    ]
  },

  "contas-receber": {
    file: "pages/contas-receber.html",
    title: "Contas a Receber",
    subtitle: "Parcelas, vencimentos e recebimentos",
    init: "init_contas_receber",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE"
    ]
  },

  despesas: {
    file: "pages/despesas.html",
    title: "Despesas",
    subtitle: "Contas a pagar e despesas",
    init: "init_despesas",

    perfisPermitidos: [
      "ADMINISTRADOR",
      "GERENTE"
    ]
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
    init: "init_configuracoes",

    perfisPermitidos: [
      "ADMINISTRADOR"
    ]
  }

};


/* =====================================================
   OBTER COLABORADOR LOGADO
===================================================== */

function obterColaboradorLogadoVnnus() {

  if (
    !window.VNNUS_API ||
    typeof window.VNNUS_API.obterUsuarioSessao !==
      "function"
  ) {

    return null;

  }


  return window.VNNUS_API
    .obterUsuarioSessao();

}


/* =====================================================
   OBTER PERFIL ATUAL
===================================================== */

function obterPerfilAtualVnnus() {

  const colaborador =
    obterColaboradorLogadoVnnus();


  if (!colaborador) {

    return "";

  }


  return String(
    colaborador.perfil ||
    ""
  )
  .trim()
  .toUpperCase();

}


/* =====================================================
   VERIFICAR PERMISSÃO DA ROTA
===================================================== */

function usuarioPodeAcessarRotaVnnus(
  rota
) {

  if (!rota) {

    return false;

  }


  if (
    !Array.isArray(
      rota.perfisPermitidos
    ) ||
    rota.perfisPermitidos.length === 0
  ) {

    return true;

  }


  const perfil =
    obterPerfilAtualVnnus();


  if (!perfil) {

    return false;

  }


  return rota.perfisPermitidos
    .includes(
      perfil
    );

}


/* =====================================================
   ROTA INICIAL POR PERFIL
===================================================== */

function obterRotaInicialVnnus() {

  const perfil =
    obterPerfilAtualVnnus();


  switch (perfil) {

    case "ADMINISTRADOR":
      return "dashboard";


    case "GERENTE":
      return "dashboard";


    case "VENDEDOR":
      return "pdv";


    case "ESTOQUE":
      return "estoque";


    default:
      return "dashboard";

  }

}


/* =====================================================
   PRIMEIRA ROTA PERMITIDA
===================================================== */

function obterPrimeiraRotaPermitidaVnnus() {

  const rotaInicial =
    obterRotaInicialVnnus();


  if (
    VNNUS_ROUTES[rotaInicial] &&
    usuarioPodeAcessarRotaVnnus(
      VNNUS_ROUTES[rotaInicial]
    )
  ) {

    return rotaInicial;

  }


  const nomesRotas =
    Object.keys(
      VNNUS_ROUTES
    );


  for (
    let i = 0;
    i < nomesRotas.length;
    i++
  ) {

    const nome =
      nomesRotas[i];


    if (
      usuarioPodeAcessarRotaVnnus(
        VNNUS_ROUTES[nome]
      )
    ) {

      return nome;

    }

  }


  return null;

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


  /* ===================================================
     ROTA INEXISTENTE
  =================================================== */

  if (!rota) {

    pageName =
      obterPrimeiraRotaPermitidaVnnus();


    if (!pageName) {

      console.error(
        "Nenhuma rota disponível para este usuário."
      );

      return;

    }


    rota =
      VNNUS_ROUTES[
        pageName
      ];

  }


  /* ===================================================
     PROTEÇÃO POR PERFIL
  =================================================== */

  if (
    !usuarioPodeAcessarRotaVnnus(
      rota
    )
  ) {

    console.warn(
      "Acesso negado à rota:",
      pageName
    );


    const conteudo =
      document.getElementById(
        "appContent"
      );


    if (conteudo) {

      conteudo.innerHTML = `
        <div class="empty-state">

          <strong>
            🔒 Acesso não autorizado
          </strong>

          <p style="margin-top:8px">
            Seu perfil não possui permissão
            para acessar este módulo.
          </p>

        </div>
      `;

    }


    const rotaDestino =
      obterPrimeiraRotaPermitidaVnnus();


    if (!rotaDestino) {

      console.error(
        "Usuário sem nenhuma rota permitida."
      );

      return;

    }


    history.replaceState(
      null,
      "",
      "#" + rotaDestino
    );


    setTimeout(
      function() {

        navigateTo(
          rotaDestino
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
   ROUTER 2.4
===================================================== */
