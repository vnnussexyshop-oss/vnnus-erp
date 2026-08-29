/* =====================================================
   VNNUS ERP
   PRODUTOS FRONT-END 3.0
===================================================== */

window.PRODUTOS_VNNUS = [];
window.PRODUTOS_VNNUS_FILTRADOS = [];

/* =====================================================
   PERMISSÕES DE PRODUTOS
===================================================== */

function obterPerfilProdutosVnnus() {

  if (
    !window.VNNUS_API ||
    typeof window.VNNUS_API.obterUsuarioSessao !==
      'function'
  ) {

    return '';

  }


  const colaborador =
    window.VNNUS_API
      .obterUsuarioSessao();


  return String(
    colaborador &&
    colaborador.perfil
      ? colaborador.perfil
      : ''
  )
  .trim()
  .toUpperCase();

}


function podeGerenciarProdutosVnnus() {

  const perfil =
    obterPerfilProdutosVnnus();


  return [
    'ADMINISTRADOR',
    'GERENTE',
    'ESTOQUE'
  ].includes(
    perfil
  );

}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.init_produtos =
async function() {

  configurarFiltrosProdutosVnnus();

  aplicarPermissoesProdutosVnnus();

  await carregarProdutosVnnus();

};

function aplicarPermissoesProdutosVnnus() {

  const podeGerenciar =
    podeGerenciarProdutosVnnus();


  const botaoNovo =
    document.querySelector(
      '[onclick="abrirModalNovoProdutoVnnus()"]'
    );


  if (botaoNovo) {

    botaoNovo.style.display =
      podeGerenciar
        ? ''
        : 'none';

  }

}
/* =====================================================
   CARREGAR
===================================================== */

async function carregarProdutosVnnus() {

  const status =
    document.getElementById(
      'produtoStatus'
    );


  if (status) {
    status.textContent =
      'Carregando produtos...';
  }


  try {

    if (
      !window.VNNUS_API ||
      typeof VNNUS_API.produtosComEstoque !==
        'function'
    ) {
      throw new Error(
        'API de produtos não disponível.'
      );
    }


    const produtos =
      await VNNUS_API.produtosComEstoque();


    window.PRODUTOS_VNNUS =
      Array.isArray(produtos)
        ? produtos
        : [];


    window.PRODUTOS_VNNUS_FILTRADOS =
      window.PRODUTOS_VNNUS.slice();


    atualizarIndicadoresProdutosVnnus();

    renderizarProdutosVnnus(
      window.PRODUTOS_VNNUS_FILTRADOS
    );


    if (status) {

      const total =
        window.PRODUTOS_VNNUS.length;

      status.textContent =
        total === 1
          ? '1 produto carregado.'
          : total +
            ' produtos carregados.';
    }

  }
  catch (erro) {

    console.error(
      'Produtos:',
      erro
    );


    if (status) {
      status.textContent =
        'Erro: ' +
        (
          erro.message ||
          'Não foi possível carregar os produtos.'
        );
    }


    renderizarProdutosVnnus([]);

  }

}


/* =====================================================
   INDICADORES
===================================================== */

function atualizarIndicadoresProdutosVnnus() {

  const lista =
    Array.isArray(
      window.PRODUTOS_VNNUS
    )
      ? window.PRODUTOS_VNNUS
      : [];


  const total =
    lista.length;


  const ativos =
    lista.filter(
      function(item) {
        return (
          normalizarAtivoProdutoVnnus(
            item.ativo
          ) === 'SIM'
        );
      }
    ).length;


  const inativos =
    total - ativos;


  const criticos =
    lista.filter(
      function(item) {

        const status =
          normalizarStatusEstoqueProdutoVnnus(
            item.status
          );

        return (
          status === 'ESTOQUE BAIXO' ||
          status === 'SEM ESTOQUE'
        );

      }
    ).length;


  definirTextoProdutoVnnus(
    'produtosTotal',
    total
  );

  definirTextoProdutoVnnus(
    'produtosAtivos',
    ativos
  );

  definirTextoProdutoVnnus(
    'produtosInativos',
    inativos
  );

  definirTextoProdutoVnnus(
    'produtosEstoqueCritico',
    criticos
  );

}


/* =====================================================
   FILTROS
===================================================== */

function configurarFiltrosProdutosVnnus() {

  const busca =
    document.getElementById(
      'produtoBusca'
    );


  const ativo =
    document.getElementById(
      'produtoFiltroAtivo'
    );


  const estoque =
    document.getElementById(
      'produtoFiltroEstoque'
    );


  if (
    busca &&
    !busca.dataset.listenerVnnus
  ) {

    busca.dataset.listenerVnnus = '1';

    busca.addEventListener(
      'input',
      filtrarProdutosVnnus
    );

  }


  if (
    ativo &&
    !ativo.dataset.listenerVnnus
  ) {

    ativo.dataset.listenerVnnus = '1';

    ativo.addEventListener(
      'change',
      filtrarProdutosVnnus
    );

  }


  if (
    estoque &&
    !estoque.dataset.listenerVnnus
  ) {

    estoque.dataset.listenerVnnus = '1';

    estoque.addEventListener(
      'change',
      filtrarProdutosVnnus
    );

  }

}


function filtrarProdutosVnnus() {

  const busca =
    String(
      obterValorProdutoVnnus(
        'produtoBusca'
      )
    )
    .trim()
    .toLowerCase();


  const ativo =
    normalizarAtivoProdutoVnnus(
      obterValorProdutoVnnus(
        'produtoFiltroAtivo'
      )
    );


  const estoque =
    normalizarStatusEstoqueProdutoVnnus(
      obterValorProdutoVnnus(
        'produtoFiltroEstoque'
      )
    );


  const origem =
    Array.isArray(
      window.PRODUTOS_VNNUS
    )
      ? window.PRODUTOS_VNNUS
      : [];


  const filtrados =
    origem.filter(
      function(item) {

        const texto =
          (
            String(item.produto || '') +
            ' ' +
            String(item.gtin || '') +
            ' ' +
            String(item.categoria || '') +
            ' ' +
            String(item.marca || '')
          )
          .toLowerCase();


        if (
          busca &&
          !texto.includes(busca)
        ) {
          return false;
        }


        if (
          ativo &&
          normalizarAtivoProdutoVnnus(
            item.ativo
          ) !== ativo
        ) {
          return false;
        }


        if (
          estoque &&
          normalizarStatusEstoqueProdutoVnnus(
            item.status
          ) !== estoque
        ) {
          return false;
        }


        return true;

      }
    );


  window.PRODUTOS_VNNUS_FILTRADOS =
    filtrados;


  renderizarProdutosVnnus(
    filtrados
  );


  const status =
    document.getElementById(
      'produtoStatus'
    );


  if (status) {
    status.textContent =
      filtrados.length +
      ' produto(s) exibido(s).';
  }

}


/* =====================================================
   LIMPAR FILTROS
===================================================== */

function limparFiltrosProdutosVnnus() {

  definirValorProdutoVnnus(
    'produtoBusca',
    ''
  );

  definirValorProdutoVnnus(
    'produtoFiltroAtivo',
    ''
  );

  definirValorProdutoVnnus(
    'produtoFiltroEstoque',
    ''
  );


  window.PRODUTOS_VNNUS_FILTRADOS =
    Array.isArray(
      window.PRODUTOS_VNNUS
    )
      ? window.PRODUTOS_VNNUS.slice()
      : [];


  renderizarProdutosVnnus(
    window.PRODUTOS_VNNUS_FILTRADOS
  );


  const status =
    document.getElementById(
      'produtoStatus'
    );


  if (status) {
    status.textContent =
      window.PRODUTOS_VNNUS.length +
      ' produto(s) carregado(s).';
  }

}


/* =====================================================
   RENDERIZAÇÃO
===================================================== */

function renderizarProdutosVnnus(lista) {

  lista =
    Array.isArray(lista)
      ? lista
      : [];


  renderizarTabelaProdutosVnnus(lista);

  renderizarCardsProdutosVnnus(lista);

}


/* =====================================================
   TABELA
===================================================== */

function renderizarTabelaProdutosVnnus(
  lista
) {

  const tbody =
    document.getElementById(
      'produtoTabela'
    );


  if (!tbody) {
    return;
  }


  if (!lista.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          Nenhum produto encontrado.
        </td>
      </tr>
    `;

    return;
  }


  tbody.innerHTML =
    lista.map(
      function(item) {

        const ativo =
          normalizarAtivoProdutoVnnus(
            item.ativo
          ) === 'SIM';


        return `
          <tr>

            <td>

              <div class="produto-nome-lista">
                ${escaparProdutoVnnus(
                  item.produto || '-'
                )}
              </div>

              <div class="produto-id-lista">
                ID:
                ${escaparProdutoVnnus(
                  item.id || '-'
                )}
              </div>

            </td>


            <td>
              ${escaparProdutoVnnus(
                item.gtin || '-'
              )}
            </td>


            <td>
              ${escaparProdutoVnnus(
                item.categoria || '-'
              )}
            </td>


            <td>
              ${moedaProdutoVnnus(
                item.preco
              )}
            </td>


            <td>
              <strong>
                ${numeroProdutoVnnus(
                  item.estoque
                )}
              </strong>
            </td>


            <td>
              ${badgeEstoqueProdutoVnnus(
                item.status
              )}
            </td>


            <td>

              <span
                class="produto-situacao ${
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

              <div class="produto-acoes">

                ${acoesProdutoVnnus(item)}

              </div>

            </td>

          </tr>
        `;

      }
    ).join('');

}


/* =====================================================
   CARDS MOBILE
===================================================== */

function renderizarCardsProdutosVnnus(
  lista
) {

  const container =
    document.getElementById(
      'produtosCardsMobile'
    );


  if (!container) {
    return;
  }


  if (!lista.length) {

    container.innerHTML = `
      <div class="empty-state">
        Nenhum produto encontrado.
      </div>
    `;

    return;
  }


  container.innerHTML =
    lista.map(
      function(item) {

        const ativo =
          normalizarAtivoProdutoVnnus(
            item.ativo
          ) === 'SIM';


        return `
          <article class="produto-mobile-card">

            <div class="produto-mobile-topo">

              <div style="min-width:0">

                <div class="produto-nome-lista">
                  ${escaparProdutoVnnus(
                    item.produto || '-'
                  )}
                </div>

                <div class="produto-id-lista">
                  ${
                    item.gtin
                      ? 'GTIN: ' +
                        escaparProdutoVnnus(
                          item.gtin
                        )
                      : 'ID: ' +
                        escaparProdutoVnnus(
                          item.id || '-'
                        )
                  }
                </div>

              </div>


              <span
                class="produto-situacao ${
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


            <div class="produto-mobile-grid">

              <div class="produto-mobile-info">

                <span>
                  Categoria
                </span>

                <strong>
                  ${escaparProdutoVnnus(
                    item.categoria || '-'
                  )}
                </strong>

              </div>


              <div class="produto-mobile-info">

                <span>
                  Preço
                </span>

                <strong>
                  ${moedaProdutoVnnus(
                    item.preco
                  )}
                </strong>

              </div>


              <div class="produto-mobile-info">

                <span>
                  Estoque
                </span>

                <strong>
                  ${numeroProdutoVnnus(
                    item.estoque
                  )}
                </strong>

              </div>


              <div class="produto-mobile-info">

                <span>
                  Status estoque
                </span>

                <strong>
                  ${badgeEstoqueProdutoVnnus(
                    item.status
                  )}
                </strong>

              </div>

            </div>


            <div class="produto-mobile-acoes">

              ${acoesProdutoVnnus(item)}

            </div>

          </article>
        `;

      }
    ).join('');

}


/* =====================================================
   AÇÕES
===================================================== */

function acoesProdutoVnnus(item) {

  if (
    !podeGerenciarProdutosVnnus()
  ) {

    return `
      <span
        style="
          font-size:12px;
          opacity:.65;
        ">
        Somente consulta
      </span>
    `;

  }


  const ativo =
    normalizarAtivoProdutoVnnus(
      item.ativo
    ) === 'SIM';


  const id =
    escaparAtributoProdutoVnnus(
      item.id
    );


  return `
    <button
      class="produto-acao-btn"
      type="button"
      onclick="abrirModalEditarProdutoVnnus('${id}')">
      ✏️ Editar
    </button>

    <button
      class="produto-acao-btn"
      type="button"
      onclick="abrirModalStatusProdutoVnnus('${id}')">
      ${
        ativo
          ? '🚫 Desativar'
          : '✅ Ativar'
      }
    </button>
  `;

}

/* =====================================================
   NOVO PRODUTO
===================================================== */

function abrirModalNovoProdutoVnnus() {

     if (!podeGerenciarProdutosVnnus()) {

    alert(
      'Seu perfil possui acesso somente para consulta de produtos.'
    );

    return;

  }

  limparFormularioProdutoVnnus();


  definirTextoProdutoVnnus(
    'produtoModalTitulo',
    'Novo Produto'
  );


  definirValorProdutoVnnus(
    'produtoAtivo',
    'SIM'
  );


  const gtin =
    document.getElementById(
      'produtoGtin'
    );


  if (gtin) {
    gtin.disabled = false;
  }


  abrirModalProdutoGenericoVnnus(
    'produtoModal'
  );


  setTimeout(
    function() {

      if (gtin) {
        gtin.focus();
      }

    },
    100
  );

}


/* =====================================================
   EDITAR PRODUTO
===================================================== */

function abrirModalEditarProdutoVnnus(
  id
) {

    if (!podeGerenciarProdutosVnnus()) {

    alert(
      'Seu perfil possui acesso somente para consulta de produtos.'
    );

    return;

  }

  // restante da função

  const produto =
    buscarProdutoLocalVnnus(id);


  if (!produto) {

    alert(
      'Produto não encontrado.'
    );

    return;
  }


  limparFormularioProdutoVnnus();


  definirTextoProdutoVnnus(
    'produtoModalTitulo',
    'Editar Produto'
  );


  definirValorProdutoVnnus(
    'produtoId',
    produto.id
  );

  definirValorProdutoVnnus(
    'produtoGtin',
    produto.gtin
  );

  definirValorProdutoVnnus(
    'produtoNome',
    produto.produto
  );

  definirValorProdutoVnnus(
    'produtoCategoria',
    produto.categoria
  );

  definirValorProdutoVnnus(
    'produtoMarca',
    produto.marca
  );

  definirValorProdutoVnnus(
    'produtoFornecedor',
    produto.fornecedor
  );

  definirValorProdutoVnnus(
    'produtoCusto',
    produto.custo
  );

  definirValorProdutoVnnus(
    'produtoPreco',
    produto.preco
  );

  definirValorProdutoVnnus(
    'produtoEstoqueMinimo',
    produto.estoqueMinimo
  );

  definirValorProdutoVnnus(
    'produtoAtivo',
    normalizarAtivoProdutoVnnus(
      produto.ativo
    ) === 'SIM'
      ? 'SIM'
      : 'NÃO'
  );

  definirValorProdutoVnnus(
    'produtoFoto',
    produto.foto
  );


  /*
    Mantemos o GTIN bloqueado durante edição.
    Evita trocar acidentalmente a identidade
    de um produto já utilizado.
  */

  const gtin =
    document.getElementById(
      'produtoGtin'
    );


  if (gtin) {
    gtin.disabled = true;
  }


  abrirModalProdutoGenericoVnnus(
    'produtoModal'
  );

}


/* =====================================================
   SALVAR PRODUTO
===================================================== */

async function salvarProdutoVnnus() {

     if (!podeGerenciarProdutosVnnus()) {

    alert(
      'Seu perfil não possui permissão para alterar produtos.'
    );

    return;

  }

  // restante da função...
}
   
  const id =
    String(
      obterValorProdutoVnnus(
        'produtoId'
      )
    ).trim();


  const gtin =
    String(
      obterValorProdutoVnnus(
        'produtoGtin'
      )
    ).trim();


  const nome =
    String(
      obterValorProdutoVnnus(
        'produtoNome'
      )
    ).trim();


  const categoria =
    String(
      obterValorProdutoVnnus(
        'produtoCategoria'
      )
    ).trim();


  const marca =
    String(
      obterValorProdutoVnnus(
        'produtoMarca'
      )
    ).trim();


  const fornecedor =
    String(
      obterValorProdutoVnnus(
        'produtoFornecedor'
      )
    ).trim();


  const custo =
    numeroFormularioProdutoVnnus(
      obterValorProdutoVnnus(
        'produtoCusto'
      )
    );


  const preco =
    numeroFormularioProdutoVnnus(
      obterValorProdutoVnnus(
        'produtoPreco'
      )
    );


  const estoqueMinimo =
    numeroFormularioProdutoVnnus(
      obterValorProdutoVnnus(
        'produtoEstoqueMinimo'
      )
    );


  const ativo =
    normalizarAtivoProdutoVnnus(
      obterValorProdutoVnnus(
        'produtoAtivo'
      )
    ) === 'SIM'
      ? 'SIM'
      : 'NÃO';


  const foto =
    String(
      obterValorProdutoVnnus(
        'produtoFoto'
      )
    ).trim();


  if (!nome) {

    mostrarMensagemProdutoVnnus(
      'produtoModalMensagem',
      'Informe o nome do produto.',
      'erro'
    );

    return;
  }


  if (preco < 0) {

    mostrarMensagemProdutoVnnus(
      'produtoModalMensagem',
      'Preço de venda inválido.',
      'erro'
    );

    return;
  }


  const botao =
    document.getElementById(
      'produtoSalvarBtn'
    );


  if (botao) {
    botao.disabled = true;
    botao.textContent =
      'Salvando...';
  }


  try {

    const dados = {

      ID_PRODUTO:
        id,

      GTIN:
        gtin,

      PRODUTO:
        nome,

      CATEGORIA:
        categoria,

      MARCA:
        marca,

      FORNECEDOR:
        fornecedor,

      CUSTO:
        custo,

      PRECO_VENDA:
        preco,

      ESTOQUE_MINIMO:
        estoqueMinimo,

      ATIVO:
        ativo,

      FOTO:
        foto

    };


    const resposta =
      await VNNUS_API.jsonp({

        acao:
          'salvar_produto',

        dados:
          JSON.stringify(dados)

      });


    mostrarMensagemProdutoVnnus(
      'produtoModalMensagem',
      resposta.mensagem ||
      (
        id
          ? 'Produto atualizado com sucesso.'
          : 'Produto cadastrado com sucesso.'
      ),
      'sucesso'
    );


    await carregarProdutosVnnus();


    setTimeout(
      function() {
        fecharModalProdutoVnnus();
      },
      600
    );

  }
  catch (erro) {

    console.error(
      'Salvar produto:',
      erro
    );


    mostrarMensagemProdutoVnnus(
      'produtoModalMensagem',
      erro.message ||
      'Não foi possível salvar o produto.',
      'erro'
    );

  }
  finally {

    if (botao) {
      botao.disabled = false;
      botao.textContent =
        'Salvar produto';
    }

  }

}


/* =====================================================
   ABRIR STATUS
===================================================== */

function abrirModalStatusProdutoVnnus(
  id
) {

  const produto =
    buscarProdutoLocalVnnus(id);


  if (!produto) {

    alert(
      'Produto não encontrado.'
    );

    return;
  }


  const ativo =
    normalizarAtivoProdutoVnnus(
      produto.ativo
    ) === 'SIM';


  const novoStatus =
    ativo
      ? 'NAO'
      : 'SIM';


  definirValorProdutoVnnus(
    'produtoStatusId',
    produto.id
  );


  definirValorProdutoVnnus(
    'produtoStatusNovo',
    novoStatus
  );


  definirTextoProdutoVnnus(
    'produtoStatusModalTitulo',
    ativo
      ? 'Desativar produto'
      : 'Ativar produto'
  );


  definirTextoProdutoVnnus(
    'produtoStatusTexto',

    ativo
      ? (
          'Deseja desativar "' +
          produto.produto +
          '"? O produto continuará no histórico, mas ficará indisponível para novas operações que respeitem o status de produto.'
        )
      : (
          'Deseja ativar novamente "' +
          produto.produto +
          '"?'
        )
  );


  const botao =
    document.getElementById(
      'produtoStatusConfirmarBtn'
    );


  if (botao) {

    botao.textContent =
      ativo
        ? 'Desativar'
        : 'Ativar';

  }


  limparMensagemProdutoVnnus(
    'produtoStatusMensagem'
  );


  abrirModalProdutoGenericoVnnus(
    'produtoStatusModal'
  );

}


/* =====================================================
   CONFIRMAR STATUS
===================================================== */

async function confirmarStatusProdutoVnnus() {

   if (!podeGerenciarProdutosVnnus()) {

    alert(
      'Seu perfil não possui permissão para alterar produtos.'
    );

    return;

  }

  // restante da função...
}
   
  const id =
    String(
      obterValorProdutoVnnus(
        'produtoStatusId'
      )
    ).trim();


  const novoStatus =
    normalizarAtivoProdutoVnnus(
      obterValorProdutoVnnus(
        'produtoStatusNovo'
      )
    );


  if (!id) {

    mostrarMensagemProdutoVnnus(
      'produtoStatusMensagem',
      'Produto não informado.',
      'erro'
    );

    return;
  }


  const botao =
    document.getElementById(
      'produtoStatusConfirmarBtn'
    );


  if (botao) {
    botao.disabled = true;
    botao.textContent =
      'Salvando...';
  }


  try {

    const resposta =
      await VNNUS_API.jsonp({

        acao:
          'alterar_status_produto',

        idProduto:
          id,

        ativo:
          novoStatus

      });


    mostrarMensagemProdutoVnnus(
      'produtoStatusMensagem',
      resposta.mensagem ||
      (
        novoStatus === 'SIM'
          ? 'Produto ativado com sucesso.'
          : 'Produto desativado com sucesso.'
      ),
      'sucesso'
    );


    await carregarProdutosVnnus();


    setTimeout(
      function() {
        fecharModalStatusProdutoVnnus();
      },
      600
    );

  }
  catch (erro) {

    console.error(
      'Status produto:',
      erro
    );


    mostrarMensagemProdutoVnnus(
      'produtoStatusMensagem',
      erro.message ||
      'Não foi possível alterar a situação.',
      'erro'
    );

  }
  finally {

    if (botao) {

      botao.disabled = false;

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

function fecharModalProdutoVnnus() {

  fecharModalProdutoGenericoVnnus(
    'produtoModal'
  );

}


function fecharModalStatusProdutoVnnus() {

  fecharModalProdutoGenericoVnnus(
    'produtoStatusModal'
  );

}


/* =====================================================
   MODAL GENÉRICO
===================================================== */

function abrirModalProdutoGenericoVnnus(
  id
) {

  const modal =
    document.getElementById(id);


  if (!modal) {
    return;
  }


  modal.classList.add('aberto');

}


function fecharModalProdutoGenericoVnnus(
  id
) {

  const modal =
    document.getElementById(id);


  if (!modal) {
    return;
  }


  modal.classList.remove('aberto');

}


/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormularioProdutoVnnus() {

  [
    'produtoId',
    'produtoGtin',
    'produtoNome',
    'produtoCategoria',
    'produtoMarca',
    'produtoFornecedor',
    'produtoCusto',
    'produtoPreco',
    'produtoEstoqueMinimo',
    'produtoFoto'
  ]
  .forEach(
    function(id) {
      definirValorProdutoVnnus(
        id,
        ''
      );
    }
  );


  definirValorProdutoVnnus(
    'produtoAtivo',
    'SIM'
  );


  limparMensagemProdutoVnnus(
    'produtoModalMensagem'
  );

}


/* =====================================================
   BUSCAR PRODUTO LOCAL
===================================================== */

function buscarProdutoLocalVnnus(id) {

  const lista =
    Array.isArray(
      window.PRODUTOS_VNNUS
    )
      ? window.PRODUTOS_VNNUS
      : [];


  return (
    lista.find(
      function(item) {
        return (
          String(item.id || '') ===
          String(id || '')
        );
      }
    ) ||
    null
  );

}


/* =====================================================
   ATIVO / INATIVO
===================================================== */

function normalizarAtivoProdutoVnnus(
  valor
) {

  const texto =
    String(valor || '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );


  if (
    texto === 'SIM' ||
    texto === 'ATIVO' ||
    texto === 'TRUE'
  ) {
    return 'SIM';
  }


  if (
    texto === 'NAO' ||
    texto === 'INATIVO' ||
    texto === 'FALSE'
  ) {
    return 'NAO';
  }


  return '';

}


/* =====================================================
   STATUS ESTOQUE
===================================================== */

function normalizarStatusEstoqueProdutoVnnus(
  valor
) {

  return String(valor || '')
    .trim()
    .toUpperCase();

}


function badgeEstoqueProdutoVnnus(
  status
) {

  const s =
    normalizarStatusEstoqueProdutoVnnus(
      status
    );


  if (s === 'OK') {

    return `
      <span class="status-badge status-ok">
        OK
      </span>
    `;
  }


  if (s === 'ESTOQUE BAIXO') {

    return `
      <span
        class="status-badge"
        style="
          background:rgba(255,184,77,.12);
          color:#ffc266;
        ">
        ESTOQUE BAIXO
      </span>
    `;
  }


  return `
    <span class="status-badge status-danger">
      SEM ESTOQUE
    </span>
  `;

}


/* =====================================================
   FORMATAÇÃO
===================================================== */

function moedaProdutoVnnus(valor) {

  return Number(valor || 0)
    .toLocaleString(
      'pt-BR',
      {
        style:
          'currency',

        currency:
          'BRL'
      }
    );

}


function numeroProdutoVnnus(valor) {

  return Number(valor || 0)
    .toLocaleString(
      'pt-BR',
      {
        maximumFractionDigits: 3
      }
    );

}


function numeroFormularioProdutoVnnus(
  valor
) {

  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return 0;
  }


  const texto =
    String(valor)
      .trim()
      .replace(',', '.');


  const numero =
    Number(texto);


  return Number.isFinite(numero)
    ? numero
    : 0;

}


/* =====================================================
   MENSAGENS
===================================================== */

function mostrarMensagemProdutoVnnus(
  id,
  texto,
  tipo
) {

  const elemento =
    document.getElementById(id);


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


  if (tipo === 'sucesso') {

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


function limparMensagemProdutoVnnus(id) {

  const elemento =
    document.getElementById(id);


  if (!elemento) {
    return;
  }


  elemento.style.display =
    'none';

  elemento.textContent =
    '';

}


/* =====================================================
   DOM HELPERS
===================================================== */

function obterValorProdutoVnnus(id) {

  const elemento =
    document.getElementById(id);

  return elemento
    ? elemento.value
    : '';

}


function definirValorProdutoVnnus(
  id,
  valor
) {

  const elemento =
    document.getElementById(id);


  if (elemento) {

    elemento.value =
      valor === null ||
      valor === undefined
        ? ''
        : valor;

  }

}


function definirTextoProdutoVnnus(
  id,
  valor
) {

  const elemento =
    document.getElementById(id);


  if (elemento) {

    elemento.textContent =
      valor === null ||
      valor === undefined
        ? ''
        : valor;

  }

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparProdutoVnnus(valor) {

  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


function escaparAtributoProdutoVnnus(
  valor
) {

  return String(valor || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '')
    .replace(/\n/g, '');

}


/* =====================================================
   FIM
   PRODUTOS FRONT-END 3.0
===================================================== */
