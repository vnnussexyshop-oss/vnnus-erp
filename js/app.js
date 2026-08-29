/* =====================================================
   VNNUS ERP
   APP 3.0
   AUTENTICAÇÃO + INICIALIZAÇÃO
===================================================== */

let deferredInstallPrompt = null;


/* =====================================================
   CONFIGURAÇÃO DO LOGIN
===================================================== */

/*
  Cole aqui a URL /exec da implantação
  do Apps Script que você já usa para
  abrir ?modo=login.

  IMPORTANTE:
  deve terminar em /exec
  e NÃO deve conter ?modo=login.
*/

const VNNUS_LOGIN_URL =
  window.VNNUS_CONFIG &&
  window.VNNUS_CONFIG.API_URL
    ? String(
        window.VNNUS_CONFIG.API_URL
      )
      .split('?')[0]
    : '';


/* =====================================================
   INSTALAÇÃO PWA
===================================================== */

window.addEventListener(
  'beforeinstallprompt',
  function(e) {

    e.preventDefault();

    deferredInstallPrompt =
      e;


    const installBtn =
      document.getElementById(
        'installBtn'
      );


    if (installBtn) {

      installBtn.hidden =
        false;

    }

  }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
  'DOMContentLoaded',
  async function() {

    /*
      Primeiro autenticamos.

      Nenhum módulo do ERP é carregado
      antes desta etapa.
    */

    const autenticado =
      await iniciarAutenticacaoVnnus();


    if (!autenticado) {

      return;

    }


    /* ===============================================
       MENU
    =============================================== */

    document
      .querySelectorAll(
        '.menu-item'
      )
      .forEach(
        function(botao) {

          botao.addEventListener(
            'click',
            function() {

              navigateTo(
                botao.dataset.page
              );

            }
          );

        }
      );


    /* ===============================================
       MENU MOBILE
    =============================================== */

    const mobileMenuBtn =
      document.getElementById(
        'mobileMenuBtn'
      );


    if (mobileMenuBtn) {

      mobileMenuBtn
        .addEventListener(
          'click',
          openMobileMenu
        );

    }


    const sidebarOverlay =
      document.getElementById(
        'sidebarOverlay'
      );


    if (sidebarOverlay) {

      sidebarOverlay
        .addEventListener(
          'click',
          closeMobileMenu
        );

    }


    /* ===============================================
       ATUALIZAR
    =============================================== */

    const refreshBtn =
      document.getElementById(
        'refreshBtn'
      );


    if (refreshBtn) {

      refreshBtn
        .addEventListener(
          'click',
          function() {

            navigateTo(
              obterPaginaAtualVnnus()
            );

          }
        );

    }


    /* ===============================================
       INSTALAR
    =============================================== */

    const installBtn =
      document.getElementById(
        'installBtn'
      );


    if (installBtn) {

      installBtn
        .addEventListener(
          'click',
          async function() {

            if (
              !deferredInstallPrompt
            ) {

              return;

            }


            deferredInstallPrompt
              .prompt();


            await deferredInstallPrompt
              .userChoice;


            deferredInstallPrompt =
              null;


            installBtn.hidden =
              true;

          }
        );

    }


    /* ===============================================
       SERVICE WORKER
    =============================================== */

    if (
      'serviceWorker'
      in navigator
    ) {

      navigator
        .serviceWorker
        .register(
          './sw.js'
        )
        .catch(
          console.error
        );

    }


    /* ===============================================
       COLABORADOR
    =============================================== */

    atualizarColaboradorTopoVnnus();
    aplicarPermissoesMenuVnnus();

    /* ===============================================
       ABRIR SISTEMA
    =============================================== */

    navigateTo(
      obterPaginaAtualVnnus()
    );

  }
);


/* =====================================================
   AUTENTICAÇÃO
===================================================== */

async function iniciarAutenticacaoVnnus() {

  try {

    if (
      !window.VNNUS_API
    ) {

      throw new Error(
        'Módulo da API VNNUS não carregado.'
      );

    }


    /*
      Verifica se acabamos de voltar
      da tela de login.
    */

    const codigo =
      window.VNNUS_API
        .capturarCodigoAuthDaUrl();


    if (codigo) {

      mostrarCarregamentoAuthVnnus(
        'Validando acesso...'
      );


      try {

        await window.VNNUS_API
          .trocarCodigoAuth(
            codigo
          );

      }

      finally {

        /*
          Remove imediatamente o código
          temporário da barra.
        */

        window.VNNUS_API
          .removerCodigoAuthDaUrl();

      }

    }


    /*
      Agora verificamos a sessão armazenada
      no domínio do ERP.
    */

    const token =
      window.VNNUS_API
        .obterToken();


    if (!token) {

      redirecionarLoginVnnus();

      return false;

    }


    mostrarCarregamentoAuthVnnus(
      'Verificando sessão...'
    );


    const sessao =
      await window.VNNUS_API
        .validarSessao();


    if (
      !sessao ||
      sessao.autenticado !==
      true
    ) {

      window.VNNUS_API
        .limparSessao();


      redirecionarLoginVnnus();

      return false;

    }


    return true;

  }

  catch (erro) {

    console.error(
      'Erro de autenticação:',
      erro
    );


    if (
      window.VNNUS_API
    ) {

      window.VNNUS_API
        .limparSessao();

    }


    mostrarErroAuthVnnus(
      erro &&
      erro.message
        ? erro.message
        : 'Não foi possível validar seu acesso.'
    );


    setTimeout(
      function() {

        redirecionarLoginVnnus();

      },
      1800
    );


    return false;

  }

}


/* =====================================================
   REDIRECIONAR PARA LOGIN
===================================================== */

function redirecionarLoginVnnus() {

  if (!VNNUS_LOGIN_URL) {

    mostrarErroAuthVnnus(
      'URL do login VNNUS não configurada.'
    );

    return;

  }


  const destino =
    VNNUS_LOGIN_URL +
    '?modo=login';


  window.location.replace(
    destino
  );

}


/* =====================================================
   TELA TEMPORÁRIA DE AUTENTICAÇÃO
===================================================== */

function mostrarCarregamentoAuthVnnus(
  texto
) {

  const conteudo =
    document.getElementById(
      'appContent'
    );


  if (!conteudo) {

    return;

  }


  conteudo.innerHTML =
    '<div class="loading-card">' +
      String(
        texto ||
        'Carregando...'
      ) +
    '</div>';

}


/* =====================================================
   ERRO DE AUTENTICAÇÃO
===================================================== */

function mostrarErroAuthVnnus(
  texto
) {

  const conteudo =
    document.getElementById(
      'appContent'
    );


  if (!conteudo) {

    return;

  }


  conteudo.innerHTML =
    '<div class="empty-state">' +
      '<strong>Acesso não autorizado</strong>' +
      '<p style="margin-top:8px">' +
        escaparHtmlVnnus(
          texto
        ) +
      '</p>' +
    '</div>';

}


/* =====================================================
   COLABORADOR NO TOPO
===================================================== */

function atualizarColaboradorTopoVnnus() {

  if (
    !window.VNNUS_API
  ) {

    return;

  }


  const colaborador =
    window.VNNUS_API
      .obterUsuarioSessao();


  if (!colaborador) {

    return;

  }


  const chip =
    document.querySelector(
      '.user-chip'
    );


  if (!chip) {

    return;

  }


  const avatar =
    chip.querySelector(
      '.user-avatar'
    );


  const nome =
    chip.querySelector(
      'strong'
    );


  const perfil =
    chip.querySelector(
      'small'
    );


  const nomeColaborador =
    String(
      colaborador.nome ||
      colaborador.usuario ||
      'Usuário'
    )
    .trim();


  if (avatar) {

    avatar.textContent =
      nomeColaborador
        .charAt(0)
        .toUpperCase() ||
      'U';

  }


  if (nome) {

    nome.textContent =
      nomeColaborador;

  }


  if (perfil) {

    perfil.textContent =
      String(
        colaborador.perfil ||
        'VNNUS'
      );

  }

}


/* =====================================================
   PÁGINA ATUAL
===================================================== */

function obterPaginaAtualVnnus() {

  const hash =
    String(
      location.hash ||
      ''
    )
    .replace(
      '#',
      ''
    )
    .trim();


  /*
    #auth nunca deve virar uma rota.
  */

  if (
    !hash ||
    hash.indexOf(
      'auth='
    ) === 0
  ) {

    return 'dashboard';

  }


  return hash;

}


/* =====================================================
   MENU MOBILE
===================================================== */

function openMobileMenu() {

  const sidebar =
    document.getElementById(
      'sidebar'
    );


  const overlay =
    document.getElementById(
      'sidebarOverlay'
    );


  if (sidebar) {

    sidebar.classList.add(
      'open'
    );

  }


  if (overlay) {

    overlay.classList.add(
      'open'
    );

  }

}


function closeMobileMenu() {

  const sidebar =
    document.getElementById(
      'sidebar'
    );


  const overlay =
    document.getElementById(
      'sidebarOverlay'
    );


  if (sidebar) {

    sidebar.classList.remove(
      'open'
    );

  }


  if (overlay) {

    overlay.classList.remove(
      'open'
    );

  }

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHtmlVnnus(
  valor
) {

  return String(
    valor ||
    ''
  )
  .replace(
    /&/g,
    '&amp;'
  )
  .replace(
    /</g,
    '&lt;'
  )
  .replace(
    />/g,
    '&gt;'
  )
  .replace(
    /"/g,
    '&quot;'
  )
  .replace(
    /'/g,
    '&#039;'
  );

}


/* =====================================================
   LOGOUT
   Será ligado ao botão visual posteriormente.
===================================================== */

async function sairVnnus() {

  try {

    if (
      window.VNNUS_API
    ) {

      await window.VNNUS_API
        .logout();

    }

  }

  catch (erro) {

    console.error(
      erro
    );

  }

  finally {

    redirecionarLoginVnnus();

  }

}
/* =====================================================
   PERMISSÕES DO MENU
===================================================== */

function aplicarPermissoesMenuVnnus() {

  if (
    !window.VNNUS_API ||
    typeof window.VNNUS_API.obterUsuarioSessao !==
      'function'
  ) {

    return;

  }


  const colaborador =
    window.VNNUS_API
      .obterUsuarioSessao();


  if (!colaborador) {

    return;

  }


  const perfil =
    String(
      colaborador.perfil ||
      ''
    )
    .trim()
    .toUpperCase();


  document
    .querySelectorAll(
      '.menu-item[data-page]'
    )
    .forEach(
      function(botao) {

        const pagina =
          String(
            botao.dataset.page ||
            ''
          )
          .trim();


        const rota =
          window.VNNUS_ROUTES
            ? window.VNNUS_ROUTES[pagina]
            : (
                typeof VNNUS_ROUTES !==
                  'undefined'
                  ? VNNUS_ROUTES[pagina]
                  : null
              );


        if (!rota) {

          botao.style.display =
            'none';

          return;

        }


        const permitidos =
          Array.isArray(
            rota.perfisPermitidos
          )
            ? rota.perfisPermitidos
            : [];


        const podeAcessar =
          permitidos.length === 0 ||
          permitidos.includes(
            perfil
          );


        botao.style.display =
          podeAcessar
            ? ''
            : 'none';

      }
    );

}
/* =====================================================
   FIM
   VNNUS APP 3.0
===================================================== */
