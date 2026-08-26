/* =====================================================
   VNNUS ERP
   COLABORADORES FRONT-END 1.0
===================================================== */

window.COLABORADORES_VNNUS = [];

window.COLABORADORES_VNNUS_FILTRADOS = [];


/* =====================================================
   INICIAR MÓDULO
===================================================== */

async function init_colaboradores() {

  /*
    Segurança visual adicional.
    O Router já bloqueia perfis não autorizados,
    mas também validamos aqui.
  */

  const usuario =
    window.VNNUS_API &&
    window.VNNUS_API.obterUsuarioSessao
      ? window.VNNUS_API.obterUsuarioSessao()
      : null;


  const perfil =
    String(
      usuario &&
      usuario.perfil
        ? usuario.perfil
        : ''
    )
    .trim()
    .toUpperCase();


  if (
    perfil !==
    'ADMINISTRADOR'
  ) {

    const status =
      document.getElementById(
        'colaboradoresStatus'
      );


    if (status) {

      status.textContent =
        'Acesso permitido somente para Administradores.';

    }


    return;

  }


  configurarFiltrosColaboradoresVnnus();

  await carregarColaboradoresVnnus();

}


/* =====================================================
   TOKEN
===================================================== */

function obterTokenColaboradoresVnnus() {

  if (
    !window.VNNUS_API ||
    typeof window.VNNUS_API.obterToken !==
      'function'
  ) {

    throw new Error(
      'Sessão VNNUS não disponível.'
    );

  }


  const token =
    window.VNNUS_API
      .obterToken();


  if (!token) {

    throw new Error(
      'Sessão inválida ou expirada.'
    );

  }


  return token;

}


/* =====================================================
   CARREGAR COLABORADORES
===================================================== */

async function carregarColaboradoresVnnus() {

  const status =
    document.getElementById(
      'colaboradoresStatus'
    );


  if (status) {

    status.textContent =
      'Carregando colaboradores...';

  }


  try {

    if (
      !window.VNNUS_API
    ) {

      throw new Error(
        'API VNNUS não carregada.'
      );

    }


    const resposta =
      await window.VNNUS_API
        .jsonp({

          acao:
            'colaboradores',

          token:
            obterTokenColaboradoresVnnus()

        });


    const colaboradores =
      resposta &&
      Array.isArray(
        resposta.colaboradores
      )
        ? resposta.colaboradores
        : [];


    window.COLABORADORES_VNNUS =
      colaboradores;


    window.COLABORADORES_VNNUS_FILTRADOS =
      colaboradores.slice();


    atualizarIndicadoresColaboradoresVnnus();

    renderizarColaboradoresVnnus(
      window.COLABORADORES_VNNUS_FILTRADOS
    );


    if (status) {

      status.textContent =
        colaboradores.length === 1
          ? '1 colaborador encontrado.'
          : colaboradores.length +
            ' colaboradores encontrados.';

    }

  }

  catch (erro) {

    console.error(
      'Colaboradores:',
      erro
    );


    if (status) {

      status.textContent =
        erro &&
        erro.message
          ? 'Erro: ' + erro.message
          : 'Não foi possível carregar os colaboradores.';

    }


    renderizarColaboradoresVnnus(
      []
    );

  }

}


/* =====================================================
   INDICADORES
===================================================== */

function atualizarIndicadoresColaboradoresVnnus() {

  const lista =
    Array.isArray(
      window.COLABORADORES_VNNUS
    )
      ? window.COLABORADORES_VNNUS
      : [];


  const total =
    lista.length;


  const ativos =
    lista.filter(
      function(item) {

        return normalizarStatusColaboradorVnnus(
          item.ativo
        ) === 'SIM';

      }
    )
    .length;


  const administradores =
    lista.filter(
      function(item) {

        return (
          String(
            item.perfil ||
            ''
          )
          .trim()
          .toUpperCase() ===
            'ADMINISTRADOR'
        );

      }
    )
    .length;


  const inativos =
    total -
    ativos;


  definirTextoColaboradorVnnus(
    'colaboradoresTotal',
    total
  );


  definirTextoColaboradorVnnus(
    'colaboradoresAtivos',
    ativos
  );


  definirTextoColaboradorVnnus(
    'colaboradoresAdministradores',
    administradores
  );


  definirTextoColaboradorVnnus(
    'colaboradoresInativos',
    inativos
  );

}


/* =====================================================
   FILTROS
===================================================== */

function configurarFiltrosColaboradoresVnnus() {

  const busca =
    document.getElementById(
      'colaboradorFiltroBusca'
    );


  if (
    busca &&
    !busca.dataset.listenerVnnus
  ) {

    busca.dataset.listenerVnnus =
      '1';


    busca.addEventListener(
      'input',
      function() {

        filtrarColaboradoresVnnus();

      }
    );

  }

}


function filtrarColaboradoresVnnus() {

  const busca =
    String(
      obterValorColaboradorVnnus(
        'colaboradorFiltroBusca'
      )
    )
    .trim()
    .toLowerCase();


  const perfil =
    String(
      obterValorColaboradorVnnus(
        'colaboradorFiltroPerfil'
      )
    )
    .trim()
    .toUpperCase();


  const status =
    normalizarStatusColaboradorVnnus(
      obterValorColaboradorVnnus(
        'colaboradorFiltroStatus'
      )
    );


  const origem =
    Array.isArray(
      window.COLABORADORES_VNNUS
    )
      ? window.COLABORADORES_VNNUS
      : [];


  const filtrados =
    origem.filter(
      function(item) {

        const texto =
          (
            String(
              item.nome ||
              ''
            ) +
            ' ' +
            String(
              item.usuario ||
              ''
            ) +
            ' ' +
            String(
              item.email ||
              ''
            )
          )
          .toLowerCase();


        if (
          busca &&
          !texto.includes(
            busca
          )
        ) {

          return false;

        }


        if (
          perfil &&
          String(
            item.perfil ||
            ''
          )
          .trim()
          .toUpperCase() !==
            perfil
        ) {

          return false;

        }


        if (
          status &&
          normalizarStatusColaboradorVnnus(
            item.ativo
          ) !==
            status
        ) {

          return false;

        }


        return true;

      }
    );


  window.COLABORADORES_VNNUS_FILTRADOS =
    filtrados;


  renderizarColaboradoresVnnus(
    filtrados
  );


  const textoStatus =
    document.getElementById(
      'colaboradoresStatus'
    );


  if (textoStatus) {

    textoStatus.textContent =
      filtrados.length === 1
        ? '1 colaborador exibido.'
        : filtrados.length +
          ' colaboradores exibidos.';

  }

}


/* =====================================================
   LIMPAR FILTROS
===================================================== */

function limparFiltrosColaboradoresVnnus() {

  definirValorColaboradorVnnus(
    'colaboradorFiltroBusca',
    ''
  );


  definirValorColaboradorVnnus(
    'colaboradorFiltroPerfil',
    ''
  );


  definirValorColaboradorVnnus(
    'colaboradorFiltroStatus',
    ''
  );


  window.COLABORADORES_VNNUS_FILTRADOS =
    Array.isArray(
      window.COLABORADORES_VNNUS
    )
      ? window.COLABORADORES_VNNUS.slice()
      : [];


  renderizarColaboradoresVnnus(
    window.COLABORADORES_VNNUS_FILTRADOS
  );

}


/* =====================================================
   RENDERIZAR
===================================================== */

function renderizarColaboradoresVnnus(
  lista
) {

  lista =
    Array.isArray(
      lista
    )
      ? lista
      : [];


  renderizarTabelaColaboradoresVnnus(
    lista
  );


  renderizarCardsColaboradoresVnnus(
    lista
  );

}


/* =====================================================
   TABELA DESKTOP
===================================================== */

function renderizarTabelaColaboradoresVnnus(
  lista
) {

  const tabela =
    document.getElementById(
      'colaboradoresTabela'
    );


  if (!tabela) {

    return;

  }


  if (!lista.length) {

    tabela.innerHTML = `
      <tr>
        <td colspan="6">
          Nenhum colaborador encontrado.
        </td>
      </tr>
    `;

    return;

  }


  tabela.innerHTML =
    lista
      .map(
        function(item) {

          const ativo =
            normalizarStatusColaboradorVnnus(
              item.ativo
            ) === 'SIM';


          const inicial =
            obterInicialColaboradorVnnus(
              item
            );


          return `
            <tr>

              <td>

                <div class="colaborador-identidade">

                  <div class="colaborador-avatar-lista">
                    ${escaparColaboradorVnnus(inicial)}
                  </div>

                  <div>

                    <div class="colaborador-nome">
                      ${escaparColaboradorVnnus(item.nome || '-')}
                    </div>

                    <div class="colaborador-email">
                      ${escaparColaboradorVnnus(item.email || 'Sem e-mail')}
                    </div>

                  </div>

                </div>

              </td>


              <td>
                ${escaparColaboradorVnnus(item.usuario || '-')}
              </td>


              <td>

                <span class="colaborador-perfil">

                  ${iconePerfilColaboradorVnnus(item.perfil)}

                  ${escaparColaboradorVnnus(
                    formatarPerfilColaboradorVnnus(
                      item.perfil
                    )
                  )}

                </span>

              </td>


              <td>

                <span
                  class="colaborador-status ${
                    ativo
                      ? 'ativo'
                      : 'inativo'
                  }">

                  ${
                    ativo
                      ? '● Ativo'
                      : '● Inativo'
                  }

                </span>

              </td>


              <td>
                ${escaparColaboradorVnnus(
                  item.ultimoLogin ||
                  'Nunca'
                )}
              </td>


              <td>

                ${acoesColaboradorVnnus(item)}

              </td>

            </tr>
          `;

        }
      )
      .join('');

}


/* =====================================================
   CARDS MOBILE
===================================================== */

function renderizarCardsColaboradoresVnnus(
  lista
) {

  const container =
    document.getElementById(
      'colaboradoresCardsMobile'
    );


  if (!container) {

    return;

  }


  if (!lista.length) {

    container.innerHTML = `
      <div class="empty-state">
        Nenhum colaborador encontrado.
      </div>
    `;

    return;

  }


  container.innerHTML =
    lista
      .map(
        function(item) {

          const ativo =
            normalizarStatusColaboradorVnnus(
              item.ativo
            ) === 'SIM';


          const inicial =
            obterInicialColaboradorVnnus(
              item
            );


          return `
            <article class="colaborador-mobile-card">

              <div class="colaborador-mobile-topo">

                <div class="colaborador-identidade">

                  <div class="colaborador-avatar-lista">
                    ${escaparColaboradorVnnus(inicial)}
                  </div>

                  <div>

                    <div class="colaborador-nome">
                      ${escaparColaboradorVnnus(item.nome || '-')}
                    </div>

                    <div class="colaborador-email">
                      @${escaparColaboradorVnnus(item.usuario || '-')}
                    </div>

                  </div>

                </div>


                <span
                  class="colaborador-status ${
                    ativo
                      ? 'ativo'
                      : 'inativo'
                  }">

                  ${
                    ativo
                      ? 'Ativo'
                      : 'Inativo'
                  }

                </span>

              </div>


              <div class="colaborador-mobile-grid">

                <div class="colaborador-mobile-info">

                  <span>
                    Perfil
                  </span>

                  <strong>
                    ${iconePerfilColaboradorVnnus(item.perfil)}
                    ${escaparColaboradorVnnus(
                      formatarPerfilColaboradorVnnus(
                        item.perfil
                      )
                    )}
                  </strong>

                </div>


                <div class="colaborador-mobile-info">

                  <span>
                    Último login
                  </span>

                  <strong>
                    ${escaparColaboradorVnnus(
                      item.ultimoLogin ||
                      'Nunca'
                    )}
                  </strong>

                </div>


                <div class="colaborador-mobile-info">

                  <span>
                    E-mail
                  </span>

                  <strong>
                    ${escaparColaboradorVnnus(
                      item.email ||
                      'Não informado'
                    )}
                  </strong>

                </div>


                <div class="colaborador-mobile-info">

                  <span>
                    Tentativas
                  </span>

                  <strong>
                    ${Number(
                      item.tentativasFalhas ||
                      0
                    )}
                  </strong>

                </div>

              </div>


              <div class="colaborador-mobile-acoes">

                ${acoesColaboradorVnnus(item)}

              </div>

            </article>
          `;

        }
      )
      .join('');

}


/* =====================================================
   AÇÕES
===================================================== */

function acoesColaboradorVnnus(
  item
) {

  const ativo =
    normalizarStatusColaboradorVnnus(
      item.ativo
    ) === 'SIM';


  const id =
    escaparAtributoColaboradorVnnus(
      item.id
    );


  return `
    <button
      class="colaborador-acao-btn"
      type="button"
      onclick="abrirModalEditarColaborador('${id}')">
      ✏️ Editar
    </button>

    <button
      class="colaborador-acao-btn"
      type="button"
      onclick="abrirModalSenhaColaborador('${id}')">
      🔐 Senha
    </button>

    <button
      class="colaborador-acao-btn"
      type="button"
      onclick="abrirModalStatusColaborador('${id}')">
      ${
        ativo
          ? '🚫 Desativar'
          : '✅ Ativar'
      }
    </button>
  `;

}


/* =====================================================
   NOVO COLABORADOR
===================================================== */

function abrirModalNovoColaborador() {

  limparFormularioColaboradorVnnus();


  definirTextoColaboradorVnnus(
    'colaboradorModalTitulo',
    'Novo colaborador'
  );


  definirVisibilidadeColaboradorVnnus(
    'colaboradorSenhaCampo',
    true
  );


  const usuario =
    document.getElementById(
      'colaboradorUsuario'
    );


  if (usuario) {

    usuario.disabled =
      false;

  }


  abrirModalVnnus(
    'colaboradorModal'
  );


  setTimeout(
    function() {

      const nome =
        document.getElementById(
          'colaboradorNome'
        );


      if (nome) {

        nome.focus();

      }

    },
    100
  );

}


/* =====================================================
   EDITAR
===================================================== */

function abrirModalEditarColaborador(
  id
) {

  const colaborador =
    buscarColaboradorLocalVnnus(
      id
    );


  if (!colaborador) {

    alert(
      'Colaborador não encontrado.'
    );

    return;

  }


  limparFormularioColaboradorVnnus();


  definirTextoColaboradorVnnus(
    'colaboradorModalTitulo',
    'Editar colaborador'
  );


  definirValorColaboradorVnnus(
    'colaboradorId',
    colaborador.id
  );


  definirValorColaboradorVnnus(
    'colaboradorNome',
    colaborador.nome
  );


  definirValorColaboradorVnnus(
    'colaboradorUsuario',
    colaborador.usuario
  );


  definirValorColaboradorVnnus(
    'colaboradorEmail',
    colaborador.email
  );


  definirValorColaboradorVnnus(
    'colaboradorPerfil',
    String(
      colaborador.perfil ||
      ''
    )
    .toUpperCase()
  );


  definirValorColaboradorVnnus(
    'colaboradorObservacao',
    colaborador.observacao
  );


  /*
    Usuário não é alterado na edição.
    Ele funciona como identificador de login.
  */

  const usuario =
    document.getElementById(
      'colaboradorUsuario'
    );


  if (usuario) {

    usuario.disabled =
      true;

  }


  definirVisibilidadeColaboradorVnnus(
    'colaboradorSenhaCampo',
    false
  );


  abrirModalVnnus(
    'colaboradorModal'
  );

}


/* =====================================================
   SALVAR
===================================================== */

async function salvarColaboradorVnnus() {

  const id =
    String(
      obterValorColaboradorVnnus(
        'colaboradorId'
      )
    )
    .trim();


  const nome =
    String(
      obterValorColaboradorVnnus(
        'colaboradorNome'
      )
    )
    .trim();


  const usuario =
    String(
      obterValorColaboradorVnnus(
        'colaboradorUsuario'
      )
    )
    .trim();


  const email =
    String(
      obterValorColaboradorVnnus(
        'colaboradorEmail'
      )
    )
    .trim();


  const perfil =
    String(
      obterValorColaboradorVnnus(
        'colaboradorPerfil'
      )
    )
    .trim()
    .toUpperCase();


  const senha =
    String(
      obterValorColaboradorVnnus(
        'colaboradorSenha'
      )
    );


  const observacao =
    String(
      obterValorColaboradorVnnus(
        'colaboradorObservacao'
      )
    )
    .trim();


  if (
    nome.length < 2
  ) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorModalMensagem',
      'Informe o nome do colaborador.',
      'erro'
    );

    return;

  }


  if (
    !id &&
    usuario.length < 4
  ) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorModalMensagem',
      'O usuário deve possuir pelo menos 4 caracteres.',
      'erro'
    );

    return;

  }


  if (!perfil) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorModalMensagem',
      'Selecione o perfil do colaborador.',
      'erro'
    );

    return;

  }


  if (
    !id &&
    senha.length < 8
  ) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorModalMensagem',
      'A senha inicial deve possuir pelo menos 8 caracteres.',
      'erro'
    );

    return;

  }


  const botao =
    document.getElementById(
      'colaboradorSalvarBtn'
    );


  if (botao) {

    botao.disabled =
      true;

    botao.textContent =
      'Salvando...';

  }


  try {

    let resposta;


    if (id) {

      resposta =
        await window.VNNUS_API
          .jsonp({

            acao:
              'editar_colaborador',

            token:
              obterTokenColaboradoresVnnus(),

            dados:
              JSON.stringify({

                id:
                  id,

                nome:
                  nome,

                email:
                  email,

                perfil:
                  perfil,

                observacao:
                  observacao

              })

          });

    }

    else {

      resposta =
        await window.VNNUS_API
          .jsonp({

            acao:
              'cadastrar_colaborador',

            token:
              obterTokenColaboradoresVnnus(),

            dados:
              JSON.stringify({

                nome:
                  nome,

                usuario:
                  usuario,

                email:
                  email,

                senha:
                  senha,

                perfil:
                  perfil,

                observacao:
                  observacao

              })

          });

    }


    mostrarMensagemColaboradorVnnus(
      'colaboradorModalMensagem',
      resposta.mensagem ||
      'Colaborador salvo com sucesso.',
      'sucesso'
    );


    await carregarColaboradoresVnnus();


    setTimeout(
      function() {

        fecharModalColaborador();

      },
      600
    );

  }

  catch (erro) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorModalMensagem',
      erro &&
      erro.message
        ? erro.message
        : 'Não foi possível salvar o colaborador.',
      'erro'
    );

  }

  finally {

    if (botao) {

      botao.disabled =
        false;

      botao.textContent =
        'Salvar colaborador';

    }

  }

}


/* =====================================================
   MODAL SENHA
===================================================== */

function abrirModalSenhaColaborador(
  id
) {

  const colaborador =
    buscarColaboradorLocalVnnus(
      id
    );


  if (!colaborador) {

    alert(
      'Colaborador não encontrado.'
    );

    return;

  }


  definirValorColaboradorVnnus(
    'colaboradorSenhaId',
    colaborador.id
  );


  definirTextoColaboradorVnnus(
    'colaboradorSenhaNome',
    colaborador.nome ||
    colaborador.usuario ||
    '-'
  );


  definirValorColaboradorVnnus(
    'colaboradorNovaSenha',
    ''
  );


  definirValorColaboradorVnnus(
    'colaboradorConfirmarSenha',
    ''
  );


  limparMensagemColaboradorVnnus(
    'colaboradorSenhaMensagem'
  );


  abrirModalVnnus(
    'colaboradorSenhaModal'
  );

}


/* =====================================================
   CONFIRMAR NOVA SENHA
===================================================== */

async function confirmarNovaSenhaColaboradorVnnus() {

  const id =
    String(
      obterValorColaboradorVnnus(
        'colaboradorSenhaId'
      )
    )
    .trim();


  const senha =
    String(
      obterValorColaboradorVnnus(
        'colaboradorNovaSenha'
      )
    );


  const confirmar =
    String(
      obterValorColaboradorVnnus(
        'colaboradorConfirmarSenha'
      )
    );


  if (
    senha.length < 8
  ) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorSenhaMensagem',
      'A nova senha deve possuir pelo menos 8 caracteres.',
      'erro'
    );

    return;

  }


  if (
    senha !==
    confirmar
  ) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorSenhaMensagem',
      'As senhas não coincidem.',
      'erro'
    );

    return;

  }


  const botao =
    document.getElementById(
      'colaboradorSenhaSalvarBtn'
    );


  if (botao) {

    botao.disabled =
      true;

    botao.textContent =
      'Salvando...';

  }


  try {

    const resposta =
      await window.VNNUS_API
        .jsonp({

          acao:
            'redefinir_senha_colaborador',

          token:
            obterTokenColaboradoresVnnus(),

          idColaborador:
            id,

          novaSenha:
            senha

        });


    mostrarMensagemColaboradorVnnus(
      'colaboradorSenhaMensagem',
      resposta.mensagem ||
      'Senha redefinida com sucesso.',
      'sucesso'
    );


    setTimeout(
      function() {

        fecharModalSenhaColaborador();

      },
      700
    );

  }

  catch (erro) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorSenhaMensagem',
      erro &&
      erro.message
        ? erro.message
        : 'Não foi possível redefinir a senha.',
      'erro'
    );

  }

  finally {

    if (botao) {

      botao.disabled =
        false;

      botao.textContent =
        'Redefinir senha';

    }

  }

}


/* =====================================================
   MODAL STATUS
===================================================== */

function abrirModalStatusColaborador(
  id
) {

  const colaborador =
    buscarColaboradorLocalVnnus(
      id
    );


  if (!colaborador) {

    alert(
      'Colaborador não encontrado.'
    );

    return;

  }


  const ativo =
    normalizarStatusColaboradorVnnus(
      colaborador.ativo
    ) === 'SIM';


  const novoStatus =
    ativo
      ? 'NAO'
      : 'SIM';


  definirValorColaboradorVnnus(
    'colaboradorStatusId',
    colaborador.id
  );


  definirValorColaboradorVnnus(
    'colaboradorStatusNovo',
    novoStatus
  );


  definirTextoColaboradorVnnus(
    'colaboradorStatusTitulo',
    ativo
      ? 'Desativar acesso'
      : 'Ativar acesso'
  );


  definirTextoColaboradorVnnus(
    'colaboradorStatusTexto',

    ativo
      ? (
          'Deseja desativar o acesso de ' +
          (
            colaborador.nome ||
            colaborador.usuario
          ) +
          '? O usuário não poderá entrar no ERP.'
        )
      : (
          'Deseja ativar novamente o acesso de ' +
          (
            colaborador.nome ||
            colaborador.usuario
          ) +
          '?'
        )
  );


  const botao =
    document.getElementById(
      'colaboradorStatusConfirmarBtn'
    );


  if (botao) {

    botao.textContent =
      ativo
        ? 'Desativar'
        : 'Ativar';

  }


  limparMensagemColaboradorVnnus(
    'colaboradorStatusMensagem'
  );


  abrirModalVnnus(
    'colaboradorStatusModal'
  );

}


/* =====================================================
   CONFIRMAR STATUS
===================================================== */

async function confirmarStatusColaboradorVnnus() {

  const id =
    String(
      obterValorColaboradorVnnus(
        'colaboradorStatusId'
      )
    )
    .trim();


  const novoStatus =
    normalizarStatusColaboradorVnnus(
      obterValorColaboradorVnnus(
        'colaboradorStatusNovo'
      )
    );


  const botao =
    document.getElementById(
      'colaboradorStatusConfirmarBtn'
    );


  if (botao) {

    botao.disabled =
      true;

    botao.textContent =
      'Salvando...';

  }


  try {

    const resposta =
      await window.VNNUS_API
        .jsonp({

          acao:
            'alterar_status_colaborador',

          token:
            obterTokenColaboradoresVnnus(),

          idColaborador:
            id,

          ativo:
            novoStatus

        });


    mostrarMensagemColaboradorVnnus(
      'colaboradorStatusMensagem',
      resposta.mensagem ||
      'Status alterado com sucesso.',
      'sucesso'
    );


    await carregarColaboradoresVnnus();


    setTimeout(
      function() {

        fecharModalStatusColaborador();

      },
      650
    );

  }

  catch (erro) {

    mostrarMensagemColaboradorVnnus(
      'colaboradorStatusMensagem',
      erro &&
      erro.message
        ? erro.message
        : 'Não foi possível alterar o acesso.',
      'erro'
    );

  }

  finally {

    if (botao) {

      botao.disabled =
        false;

      botao.textContent =
        novoStatus === 'SIM'
          ? 'Ativar'
          : 'Desativar';

    }

  }

}


/* =====================================================
   FECHAR MODAIS
===================================================== */

function fecharModalColaborador() {

  fecharModalVnnus(
    'colaboradorModal'
  );

}


function fecharModalSenhaColaborador() {

  fecharModalVnnus(
    'colaboradorSenhaModal'
  );

}


function fecharModalStatusColaborador() {

  fecharModalVnnus(
    'colaboradorStatusModal'
  );

}


/* =====================================================
   MODAL GENÉRICO
===================================================== */

function abrirModalVnnus(
  id
) {

  const modal =
    document.getElementById(
      id
    );


  if (!modal) {

    return;

  }


  modal.classList.add(
    'aberto'
  );

}


function fecharModalVnnus(
  id
) {

  const modal =
    document.getElementById(
      id
    );


  if (!modal) {

    return;

  }


  modal.classList.remove(
    'aberto'
  );

}


/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormularioColaboradorVnnus() {

  [
    'colaboradorId',
    'colaboradorNome',
    'colaboradorUsuario',
    'colaboradorEmail',
    'colaboradorPerfil',
    'colaboradorSenha',
    'colaboradorObservacao'
  ]
  .forEach(
    function(id) {

      definirValorColaboradorVnnus(
        id,
        ''
      );

    }
  );


  limparMensagemColaboradorVnnus(
    'colaboradorModalMensagem'
  );

}


/* =====================================================
   BUSCAR LOCAL
===================================================== */

function buscarColaboradorLocalVnnus(
  id
) {

  const lista =
    Array.isArray(
      window.COLABORADORES_VNNUS
    )
      ? window.COLABORADORES_VNNUS
      : [];


  return (
    lista.find(
      function(item) {

        return (
          String(
            item.id ||
            ''
          ) ===
          String(
            id ||
            ''
          )
        );

      }
    ) ||
    null
  );

}


/* =====================================================
   PERFIL
===================================================== */

function formatarPerfilColaboradorVnnus(
  perfil
) {

  perfil =
    String(
      perfil ||
      ''
    )
    .trim()
    .toUpperCase();


  if (
    perfil ===
    'ADMINISTRADOR'
  ) {

    return 'Administrador';

  }


  if (
    perfil ===
    'VENDEDOR'
  ) {

    return 'Vendedor';

  }


  if (
    perfil ===
    'ESTOQUE'
  ) {

    return 'Estoque';

  }


  return perfil ||
    '-';

}


function iconePerfilColaboradorVnnus(
  perfil
) {

  perfil =
    String(
      perfil ||
      ''
    )
    .trim()
    .toUpperCase();


  if (
    perfil ===
    'ADMINISTRADOR'
  ) {

    return '👑';

  }


  if (
    perfil ===
    'VENDEDOR'
  ) {

    return '🛒';

  }


  if (
    perfil ===
    'ESTOQUE'
  ) {

    return '📦';

  }


  return '👤';

}


/* =====================================================
   STATUS
===================================================== */

function normalizarStatusColaboradorVnnus(
  valor
) {

  valor =
    String(
      valor ||
      ''
    )
    .trim()
    .toUpperCase();


  if (
    valor === 'SIM' ||
    valor === 'ATIVO' ||
    valor === 'TRUE'
  ) {

    return 'SIM';

  }


  if (
    valor === 'NAO' ||
    valor === 'NÃO' ||
    valor === 'INATIVO' ||
    valor === 'FALSE'
  ) {

    return 'NAO';

  }


  return '';

}


/* =====================================================
   INICIAL
===================================================== */

function obterInicialColaboradorVnnus(
  item
) {

  const texto =
    String(
      item.nome ||
      item.usuario ||
      'U'
    )
    .trim();


  return (
    texto
      .charAt(0)
      .toUpperCase() ||
    'U'
  );

}


/* =====================================================
   MENSAGENS
===================================================== */

function mostrarMensagemColaboradorVnnus(
  id,
  texto,
  tipo
) {

  const elemento =
    document.getElementById(
      id
    );


  if (!elemento) {

    return;

  }


  elemento.style.display =
    'block';


  elemento.style.padding =
    '10px 12px';


  elemento.style.borderRadius =
    '9px';


  elemento.style.fontSize =
    '12px';


  elemento.style.lineHeight =
    '1.4';


  if (
    tipo ===
    'sucesso'
  ) {

    elemento.style.color =
      '#baf3c8';

    elemento.style.background =
      'rgba(84,197,122,.09)';

    elemento.style.border =
      '1px solid rgba(84,197,122,.18)';

  }

  else {

    elemento.style.color =
      '#ffc0c0';

    elemento.style.background =
      'rgba(255,102,102,.08)';

    elemento.style.border =
      '1px solid rgba(255,102,102,.18)';

  }


  elemento.textContent =
    texto;

}


function limparMensagemColaboradorVnnus(
  id
) {

  const elemento =
    document.getElementById(
      id
    );


  if (!elemento) {

    return;

  }


  elemento.style.display =
    'none';

  elemento.textContent =
    '';

}


/* =====================================================
   HELPERS DOM
===================================================== */

function obterValorColaboradorVnnus(
  id
) {

  const elemento =
    document.getElementById(
      id
    );


  return elemento
    ? elemento.value
    : '';

}


function definirValorColaboradorVnnus(
  id,
  valor
) {

  const elemento =
    document.getElementById(
      id
    );


  if (elemento) {

    elemento.value =
      valor === null ||
      valor === undefined
        ? ''
        : valor;

  }

}


function definirTextoColaboradorVnnus(
  id,
  valor
) {

  const elemento =
    document.getElementById(
      id
    );


  if (elemento) {

    elemento.textContent =
      valor === null ||
      valor === undefined
        ? ''
        : valor;

  }

}


function definirVisibilidadeColaboradorVnnus(
  id,
  mostrar
) {

  const elemento =
    document.getElementById(
      id
    );


  if (elemento) {

    elemento.style.display =
      mostrar
        ? ''
        : 'none';

  }

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparColaboradorVnnus(
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
   ESCAPAR PARA ATRIBUTO JS
===================================================== */

function escaparAtributoColaboradorVnnus(
  valor
) {

  return String(
    valor ||
    ''
  )
  .replace(
    /\\/g,
    '\\\\'
  )
  .replace(
    /'/g,
    "\\'"
  )
  .replace(
    /\r/g,
    ''
  )
  .replace(
    /\n/g,
    ''
  );

}


/* =====================================================
   FIM
   COLABORADORES FRONT-END 1.0
===================================================== */
