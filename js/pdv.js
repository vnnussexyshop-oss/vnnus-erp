/* VNNUS PDV 2.0 - Luxury + Configurações */

let carrinhoPDV31 = [];
let ultimoComprovantePDV32 = null;
let clientesPDV34 = [];
let clientesPDV34Carregados = false;

let configuracoesPDV20 = {
  NOME_LOJA: 'VNNUS',
  NOME_COMPROVANTE: 'VNNUS',
  MENSAGEM_COMPROVANTE: 'Obrigada pela preferência! ❤️',
  RODAPE_COMPROVANTE: '',
  CLIENTE_PADRAO: '',
  PAGAMENTO_PADRAO: '',
  DESCONTO_MAXIMO: 0,
  PERMITIR_SEM_ESTOQUE: 'NAO'
};

let produtosBuscaPDV20 = [];
let produtosBuscaPDV20Carregados = false;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.init_pdv = async function() {

  const campo =
    document.getElementById(
      'pdvGTIN'
    );

  const buscar =
    document.getElementById(
      'pdvBuscar'
    );

  const scanner =
    document.getElementById(
      'pdvScanner'
    );

  const limpar =
    document.getElementById(
      'pdvLimparVenda'
    );

  const desconto =
    document.getElementById(
      'pdvDesconto'
    );

  const finalizar =
    document.getElementById(
      'pdvFinalizar'
    );

  const fecharModal =
    document.getElementById(
      'pdvFecharModal'
    );

  const cancelar =
    document.getElementById(
      'pdvCancelarFinalizacao'
    );

  const confirmar =
    document.getElementById(
      'pdvConfirmarVenda'
    );

  const fecharComprovante =
    document.getElementById(
      'pdvFecharComprovante'
    );

  const compartilharComprovante =
    document.getElementById(
      'pdvCompartilharComprovante'
    );

  const novaVenda =
    document.getElementById(
      'pdvNovaVenda'
    );

  const buscaNome =
    document.getElementById(
      'pdvBuscaProduto'
    );

  const btnBuscaNome =
    document.getElementById(
      'pdvBuscarProdutoNome'
    );


  await carregarConfiguracoesPDV20();


  const params =
    new URLSearchParams(
      window.location.search
    );

  const gtinRecebido =
    params.get(
      'gtin'
    );


  if (
    buscar &&
    campo
  ) {

    buscar.onclick =
      function() {

        buscarProdutoPDV31(
          campo.value
        );

      };


    campo.onkeydown =
      function(evento) {

        if (
          evento.key ===
          'Enter'
        ) {

          evento.preventDefault();

          buscarProdutoPDV31(
            campo.value
          );

        }

      };

  }


  if (
    btnBuscaNome &&
    buscaNome
  ) {

    btnBuscaNome.onclick =
      function() {

        buscarProdutoPorNomePDV20(
          buscaNome.value
        );

      };


    buscaNome.onkeydown =
      function(evento) {

        if (
          evento.key ===
          'Enter'
        ) {

          evento.preventDefault();

          buscarProdutoPorNomePDV20(
            buscaNome.value
          );

        }

      };


    buscaNome.oninput =
      function() {

        if (
          !buscaNome.value.trim()
        ) {

          fecharResultadosBuscaPDV20();

        }

      };

  }


  if (scanner) {

    scanner.onclick =
      abrirScannerPDV31;

  }


  if (limpar) {

    limpar.onclick =
      function() {

        if (
          !carrinhoPDV31.length
        ) {
          return;
        }


        if (
          confirm(
            'Deseja limpar toda a venda?'
          )
        ) {

          carrinhoPDV31 = [];


          if (desconto) {

            desconto.value =
              '0';

          }


          renderCarrinhoPDV31();

          definirStatusPDV31(
            'Venda limpa.'
          );

        }

      };

  }


  if (desconto) {

    desconto.oninput =
      function() {

        aplicarLimiteDescontoPDV20();

        renderCarrinhoPDV31();

      };

  }


  if (finalizar) {

    finalizar.onclick =
      abrirFinalizacaoPDV31;

  }


  if (fecharModal) {

    fecharModal.onclick =
      fecharFinalizacaoPDV31;

  }


  if (cancelar) {

    cancelar.onclick =
      fecharFinalizacaoPDV31;

  }


  if (confirmar) {

    confirmar.onclick =
      confirmarVendaPDV31;

  }


  if (fecharComprovante) {

    fecharComprovante.onclick =
      fecharComprovantePDV32;

  }


  if (compartilharComprovante) {

    compartilharComprovante.onclick =
      compartilharComprovantePDV32;

  }


  if (novaVenda) {

    novaVenda.onclick =
      novaVendaPDV32;

  }


  renderCarrinhoPDV31();

  atualizarBadgesPDV20();

  definirStatusPDV31(
    'PDV pronto. Aguardando produto.'
  );


  if (
    campo &&
    gtinRecebido
  ) {

    campo.value =
      gtinRecebido;


    await buscarProdutoPDV31(
      gtinRecebido
    );


    history.replaceState(
      null,
      '',
      window.location.origin +
      window.location.pathname +
      '#pdv'
    );

  }

};


/* =====================================================
   CONFIGURAÇÕES DO PDV 2.0
===================================================== */

async function carregarConfiguracoesPDV20() {

  try {

    const resposta =
      await VNNUS_API
        .configuracoes();


    const dados =
      resposta &&
      resposta.configuracoes
        ? resposta.configuracoes
        : {};


    configuracoesPDV20 = {

      ...configuracoesPDV20,

      ...dados

    };

  }

  catch (erro) {

    console.warn(
      'Configurações PDV:',
      erro
    );

  }

}


/* =====================================================
   BADGES
===================================================== */

function atualizarBadgesPDV20() {

  const pagamento =
    document.getElementById(
      'pdvConfigPagamentoBadge'
    );

  const estoque =
    document.getElementById(
      'pdvConfigEstoqueBadge'
    );

  const limite =
    document.getElementById(
      'pdvLimiteDesconto'
    );


  if (pagamento) {

    pagamento.textContent =
      'Pagamento: ' +
      formatarPagamentoPDV20(
        configuracoesPDV20
          .PAGAMENTO_PADRAO ||
        ''
      );

  }


  if (estoque) {

    estoque.textContent =
      String(
        configuracoesPDV20
          .PERMITIR_SEM_ESTOQUE ||
        'NAO'
      )
      .toUpperCase() ===
      'SIM'

        ? 'Estoque: venda liberada'

        : 'Estoque: protegido';

  }


  if (limite) {

    const percentual =
      Number(
        configuracoesPDV20
          .DESCONTO_MAXIMO ||
        0
      );


    limite.textContent =
      percentual > 0

        ? (
            'Limite configurado: ' +
            percentual.toLocaleString(
              'pt-BR'
            ) +
            '%'
          )

        : 'Sem desconto máximo configurado.';

  }

}


/* =====================================================
   PAGAMENTO
===================================================== */

function formatarPagamentoPDV20(
  valor
) {

  const mapa = {

    PIX:
      'PIX',

    DINHEIRO:
      'Dinheiro',

    DEBITO:
      'Débito',

    CREDITO:
      'Crédito'

  };


  return (
    mapa[
      String(
        valor ||
        ''
      )
      .toUpperCase()
    ] ||
    '-'
  );

}


/* =====================================================
   VENDA SEM ESTOQUE
===================================================== */

function permiteVendaSemEstoquePDV20() {

  return (
    String(
      configuracoesPDV20
        .PERMITIR_SEM_ESTOQUE ||
      'NAO'
    )
    .trim()
    .toUpperCase() ===
    'SIM'
  );

}


/* =====================================================
   PRODUTOS PARA BUSCA MANUAL
===================================================== */

async function carregarProdutosBuscaPDV20() {

  if (
    produtosBuscaPDV20Carregados
  ) {

    return produtosBuscaPDV20;

  }


  produtosBuscaPDV20 =
    await VNNUS_API
      .produtosComEstoque();


  produtosBuscaPDV20 =
    Array.isArray(
      produtosBuscaPDV20
    )
      ? produtosBuscaPDV20
      : [];


  produtosBuscaPDV20Carregados =
    true;


  return produtosBuscaPDV20;

}


/* =====================================================
   BUSCA POR NOME
===================================================== */

async function buscarProdutoPorNomePDV20(
  termo
) {

  const busca =
    String(
      termo ||
      ''
    )
    .trim()
    .toLowerCase();


  if (
    busca.length <
    2
  ) {

    definirStatusPDV31(
      'Digite pelo menos 2 caracteres para pesquisar.'
    );

    return;

  }


  definirStatusPDV31(
    'Pesquisando produtos...'
  );


  try {

    const produtos =
      await carregarProdutosBuscaPDV20();


   const encontrados =
  produtos
    .filter(
      function(produto) {

        const situacaoProduto =
          String(
            produto.ativo ??
            produto.ATIVO ??
            'SIM'
          )
          .trim()
          .toUpperCase()
          .normalize('NFD')
          .replace(
            /[\u0300-\u036f]/g,
            ''
          );

        const ativo =
          !(
            situacaoProduto === 'NAO' ||
            situacaoProduto === 'INATIVO' ||
            situacaoProduto === 'FALSE'
          );

        return (
          ativo &&
          String(
            produto.produto ||
            ''
          )
          .toLowerCase()
          .includes(
            busca
          )
        );

      }
    )
    .slice(
      0,
      20
    );

    renderResultadosBuscaPDV20(
      encontrados
    );


    definirStatusPDV31(

      encontrados.length

        ? (
            encontrados.length +
            ' produto(s) encontrado(s).'
          )

        : 'Nenhum produto encontrado.'

    );

  }

  catch (erro) {

    console.error(
      'Busca de produto:',
      erro
    );


    definirStatusPDV31(
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   RESULTADOS DA BUSCA
===================================================== */

function renderResultadosBuscaPDV20(
  produtos
) {

  const area =
    document.getElementById(
      'pdvResultadosBusca'
    );


  if (!area) {
    return;
  }


  if (
    !Array.isArray(
      produtos
    ) ||
    !produtos.length
  ) {

    area.style.display =
      'block';


    area.innerHTML = `
      <div class="empty-state">
        Nenhum produto encontrado.
      </div>
    `;


    return;

  }


  const moeda =
    function(valor) {

      return Number(
        valor ||
        0
      )
      .toLocaleString(
        'pt-BR',
        {
          style:
            'currency',

          currency:
            'BRL'
        }
      );

    };


  area.style.display =
    'block';


  area.innerHTML =
    produtos
      .map(
        function(produto) {

          const semEstoque =
            Number(
              produto.estoque ||
              0
            ) <= 0;


          return `
            <div class="pdv-busca-item">

              <div>

                <strong>
                  ${escaparHtmlPDV20(
                    produto.produto ||
                    '-'
                  )}
                </strong>

                <div class="pdv-busca-meta">

                  ${escaparHtmlPDV20(
                    produto.gtin ||
                    'Sem GTIN'
                  )}

                  •

                  ${moeda(
                    produto.preco
                  )}

                  •

                  Estoque:
                  ${Number(
                    produto.estoque ||
                    0
                  )}

                </div>

              </div>


              <button
                class="${
                  semEstoque &&
                  !permiteVendaSemEstoquePDV20()

                    ? 'btn-secondary'

                    : 'btn-primary'
                }"

                onclick="adicionarProdutoBuscaPDV20('${escaparAtributoPDV20(
                  produto.id
                )}')"

                ${
                  semEstoque &&
                  !permiteVendaSemEstoquePDV20()

                    ? 'disabled'

                    : ''
                }>

                ${
                  semEstoque

                    ? 'Sem estoque'

                    : '+ Adicionar'
                }

              </button>

            </div>
          `;

        }
      )
      .join('');

}


/* =====================================================
   ADICIONAR DA BUSCA
===================================================== */

function adicionarProdutoBuscaPDV20(
  idProduto
) {

  const produto =
    produtosBuscaPDV20
      .find(
        function(item) {

          return (
            String(
              item.id
            ) ===
            String(
              idProduto
            )
          );

        }
      );


  if (!produto) {
    return;
  }


  adicionarProdutoPDV31(
    produto
  );


  fecharResultadosBuscaPDV20();


  const busca =
    document.getElementById(
      'pdvBuscaProduto'
    );


  if (busca) {

    busca.value =
      '';

  }


  definirStatusPDV31(
    '✅ ' +
    produto.produto +
    ' adicionado.'
  );

}


/* =====================================================
   FECHAR RESULTADOS
===================================================== */

function fecharResultadosBuscaPDV20() {

  const area =
    document.getElementById(
      'pdvResultadosBusca'
    );


  if (!area) {
    return;
  }


  area.style.display =
    'none';


  area.innerHTML =
    '';

}


/* =====================================================
   LIMITE DE DESCONTO
===================================================== */

function aplicarLimiteDescontoPDV20() {

  const campo =
    document.getElementById(
      'pdvDesconto'
    );


  if (!campo) {
    return;
  }


  const subtotal =
    carrinhoPDV31.reduce(
      function(
        soma,
        item
      ) {

        return (
          soma +
          Number(
            item.preco ||
            0
          ) *
          Number(
            item.quantidade ||
            0
          )
        );

      },
      0
    );


  const percentual =
    Number(
      configuracoesPDV20
        .DESCONTO_MAXIMO ||
      0
    );


  const maximo =
    percentual > 0

      ? (
          subtotal *
          percentual /
          100
        )

      : subtotal;


  let valor =
    Number(
      campo.value ||
      0
    );


  if (
    !Number.isFinite(
      valor
    ) ||
    valor < 0
  ) {

    valor = 0;

  }


  if (
    valor >
    maximo
  ) {

    valor =
      maximo;

  }


  if (
    valor >
    subtotal
  ) {

    valor =
      subtotal;

  }


  campo.value =
    valor.toFixed(
      2
    );

}


/* =====================================================
   SEGURANÇA HTML
===================================================== */

function escaparHtmlPDV20(
  valor
) {

  return String(
    valor == null
      ? ''
      : valor
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


function escaparAtributoPDV20(
  valor
) {

  return String(
    valor == null
      ? ''
      : valor
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

}/* =====================================================
   BUSCAR PRODUTO POR GTIN
===================================================== */

async function buscarProdutoPDV31(
  gtin
) {

  const codigo =
    String(
      gtin ||
      ''
    )
    .trim();


  if (!codigo) {

    definirStatusPDV31(
      'Digite ou bipe um GTIN.'
    );

    return;

  }


  definirStatusPDV31(
    'Buscando produto...'
  );


  try {

    const produto =
      await VNNUS_API
        .produtoPorGTIN(
          codigo
        );


    if (!produto) {

      definirStatusPDV31(
        'Produto não encontrado.'
      );

      return;

    }


    const semEstoque =
      Number(
        produto.estoque ||
        0
      ) <= 0;


    if (
      semEstoque &&
      !permiteVendaSemEstoquePDV20()
    ) {

      definirStatusPDV31(
        produto.produto +
        ' está sem estoque.'
      );

      return;

    }


    adicionarProdutoPDV31(
      produto
    );


    definirStatusPDV31(
      '✅ ' +
      produto.produto +
      ' adicionado.'
    );


    const campo =
      document.getElementById(
        'pdvGTIN'
      );


    if (campo) {

      campo.value =
        '';

      campo.focus();

    }

  }

  catch (erro) {

    console.error(
      'PDV:',
      erro
    );


    definirStatusPDV31(
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   ADICIONAR PRODUTO AO CARRINHO
===================================================== */

function adicionarProdutoPDV31(
  produto
) {
  /* ===================================================
     PROTEÇÃO - PRODUTO INATIVO
  =================================================== */

  const situacaoProduto =
    String(
      produto.ativo ??
      produto.ATIVO ??
      'SIM'
    )
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    );


  const produtoInativo =
    (
      situacaoProduto === 'NAO' ||
      situacaoProduto === 'INATIVO' ||
      situacaoProduto === 'FALSE'
    );


  if (produtoInativo) {

    definirStatusPDV31(
      '🚫 ' +
      (
        produto.produto ||
        produto.PRODUTO ||
        'Produto'
      ) +
      ' está inativo e não pode ser vendido.'
    );


    alert(
      'Produto inativo.\n\n' +
      (
        produto.produto ||
        produto.PRODUTO ||
        'Este produto'
      ) +
      ' não pode ser adicionado à venda.'
    );


    return false;

  }
  const existente =
    carrinhoPDV31.find(
      function(item) {

        return (
          String(
            item.id
          ) ===
          String(
            produto.id
          )
        );

      }
    );


  if (existente) {

    const novaQuantidade =
      Number(
        existente.quantidade ||
        0
      ) + 1;


    const estoque =
      Number(
        produto.estoque ||
        existente.estoque ||
        0
      );


    if (
      !permiteVendaSemEstoquePDV20() &&
      novaQuantidade >
      estoque
    ) {

      alert(
        'Estoque disponível: ' +
        estoque
      );

      return;

    }


    existente.quantidade =
      novaQuantidade;

  }

  else {

    carrinhoPDV31.push({

      ...produto,

      quantidade:
        1

    });

  }


  renderCarrinhoPDV31();

}


/* =====================================================
   ALTERAR QUANTIDADE
===================================================== */

function alterarQuantidadePDV31(
  idProduto,
  variacao
) {

  const item =
    carrinhoPDV31.find(
      function(produto) {

        return (
          String(
            produto.id
          ) ===
          String(
            idProduto
          )
        );

      }
    );


  if (!item) {
    return;
  }


  const novaQuantidade =
    Number(
      item.quantidade ||
      0
    ) +
    Number(
      variacao ||
      0
    );


  if (
    novaQuantidade <= 0
  ) {

    removerProdutoPDV31(
      idProduto
    );

    return;

  }


  const estoque =
    Number(
      item.estoque ||
      0
    );


  if (
    !permiteVendaSemEstoquePDV20() &&
    novaQuantidade >
    estoque
  ) {

    alert(
      'Estoque disponível: ' +
      estoque
    );

    return;

  }


  item.quantidade =
    novaQuantidade;


  renderCarrinhoPDV31();

}


/* =====================================================
   DEFINIR QUANTIDADE DIRETA
===================================================== */

function definirQuantidadePDV20(
  idProduto,
  quantidade
) {

  const item =
    carrinhoPDV31.find(
      function(produto) {

        return (
          String(
            produto.id
          ) ===
          String(
            idProduto
          )
        );

      }
    );


  if (!item) {
    return;
  }


  let novaQuantidade =
    Number(
      quantidade ||
      0
    );


  if (
    !Number.isFinite(
      novaQuantidade
    )
  ) {

    novaQuantidade =
      1;

  }


  novaQuantidade =
    Math.floor(
      novaQuantidade
    );


  if (
    novaQuantidade <= 0
  ) {

    removerProdutoPDV31(
      idProduto
    );

    return;

  }


  const estoque =
    Number(
      item.estoque ||
      0
    );


  if (
    !permiteVendaSemEstoquePDV20() &&
    novaQuantidade >
    estoque
  ) {

    alert(
      'Estoque disponível: ' +
      estoque
    );


    novaQuantidade =
      estoque;

  }


  item.quantidade =
    novaQuantidade;


  renderCarrinhoPDV31();

}


/* =====================================================
   REMOVER PRODUTO
===================================================== */

function removerProdutoPDV31(
  idProduto
) {

  carrinhoPDV31 =
    carrinhoPDV31.filter(
      function(item) {

        return (
          String(
            item.id
          ) !==
          String(
            idProduto
          )
        );

      }
    );


  renderCarrinhoPDV31();

}


/* =====================================================
   CALCULAR TOTAIS
===================================================== */

function calcularTotaisPDV31() {

  const subtotal =
    carrinhoPDV31.reduce(
      function(
        soma,
        item
      ) {

        return (
          soma +
          Number(
            item.preco ||
            0
          ) *
          Number(
            item.quantidade ||
            0
          )
        );

      },
      0
    );


  const campoDesconto =
    document.getElementById(
      'pdvDesconto'
    );


  let desconto =
    Number(
      campoDesconto
        ? campoDesconto.value
        : 0
    ) || 0;


  if (
    desconto < 0
  ) {

    desconto = 0;

  }


  const percentual =
    Number(
      configuracoesPDV20
        .DESCONTO_MAXIMO ||
      0
    );


  if (
    percentual > 0
  ) {

    const maximo =
      subtotal *
      percentual /
      100;


    if (
      desconto >
      maximo
    ) {

      desconto =
        maximo;


      if (campoDesconto) {

        campoDesconto.value =
          desconto.toFixed(
            2
          );

      }

    }

  }


  if (
    desconto >
    subtotal
  ) {

    desconto =
      subtotal;

  }


  return {

    subtotal:
      subtotal,

    desconto:
      desconto,

    total:
      subtotal -
      desconto

  };

}


/* =====================================================
   CONTAR ITENS
===================================================== */

function contarItensCarrinhoPDV20() {

  return carrinhoPDV31.reduce(
    function(
      total,
      item
    ) {

      return (
        total +
        Number(
          item.quantidade ||
          0
        )
      );

    },
    0
  );

}


/* =====================================================
   RENDERIZAR CARRINHO
===================================================== */

function renderCarrinhoPDV31() {

  const area =
    document.getElementById(
      'pdvCarrinho'
    );


  const subtotalArea =
    document.getElementById(
      'pdvSubtotal'
    );


  const totalArea =
    document.getElementById(
      'pdvTotal'
    );


  const botaoFinalizar =
    document.getElementById(
      'pdvFinalizar'
    );


  const quantidadeArea =
    document.getElementById(
      'pdvQuantidadeItensCarrinho'
    );


  if (!area) {
    return;
  }


  const moeda =
    function(valor) {

      return Number(
        valor ||
        0
      )
      .toLocaleString(
        'pt-BR',
        {
          style:
            'currency',

          currency:
            'BRL'
        }
      );

    };


  if (
    quantidadeArea
  ) {

    const quantidade =
      contarItensCarrinhoPDV20();


    quantidadeArea.textContent =
      quantidade +
      (
        quantidade === 1
          ? ' item'
          : ' itens'
      );

  }


  if (
    !carrinhoPDV31.length
  ) {

    area.innerHTML = `
      <div class="empty-state">
        Nenhum produto adicionado.
      </div>
    `;


    if (subtotalArea) {

      subtotalArea.textContent =
        'R$ 0,00';

    }


    if (totalArea) {

      totalArea.textContent =
        'R$ 0,00';

    }


    if (botaoFinalizar) {

      botaoFinalizar.disabled =
        true;

    }


    return;

  }


  area.innerHTML =
    carrinhoPDV31
      .map(
        function(item) {

          const totalItem =
            Number(
              item.preco ||
              0
            ) *
            Number(
              item.quantidade ||
              0
            );


          const estoque =
            Number(
              item.estoque ||
              0
            );


          return `
            <div class="pdv-cart-item">

              <div class="pdv-cart-main">

                <div class="pdv-cart-title">
                  ${escaparHtmlPDV20(
                    item.produto ||
                    '-'
                  )}
                </div>

                <div class="pdv-cart-meta">

                  ${escaparHtmlPDV20(
                    item.gtin ||
                    ''
                  )}

                  ${
                    item.gtin
                      ? ' • '
                      : ''
                  }

                  ${moeda(
                    item.preco
                  )}

                  • Estoque:
                  ${estoque}

                </div>

              </div>


              <div class="pdv-cart-total">

                ${moeda(
                  totalItem
                )}

              </div>


              <div class="pdv-cart-actions">

                <button
                  class="btn-secondary"
                  type="button"
                  onclick="alterarQuantidadePDV31('${escaparAtributoPDV20(
                    item.id
                  )}', -1)">
                  −
                </button>


                <input
                  class="input pdv-qtd-input"
                  type="number"
                  min="1"
                  value="${Number(
                    item.quantidade ||
                    1
                  )}"
                  onchange="definirQuantidadePDV20('${escaparAtributoPDV20(
                    item.id
                  )}', this.value)">


                <button
                  class="btn-secondary"
                  type="button"
                  onclick="alterarQuantidadePDV31('${escaparAtributoPDV20(
                    item.id
                  )}', 1)">
                  +
                </button>


                <button
                  class="btn-secondary"
                  type="button"
                  onclick="removerProdutoPDV31('${escaparAtributoPDV20(
                    item.id
                  )}')">
                  🗑️
                </button>

              </div>

            </div>
          `;

        }
      )
      .join('');


  const totais =
    calcularTotaisPDV31();


  if (subtotalArea) {

    subtotalArea.textContent =
      moeda(
        totais.subtotal
      );

  }


  if (totalArea) {

    totalArea.textContent =
      moeda(
        totais.total
      );

  }


  if (botaoFinalizar) {

    botaoFinalizar.disabled =
      false;

  }

}


/* =====================================================
   SCANNER
===================================================== */

function abrirScannerPDV31() {

  const scannerUrl =
    window.VNNUS_CONFIG &&
    window.VNNUS_CONFIG.SCANNER_URL;


  if (!scannerUrl) {

    alert(
      'Configure SCANNER_URL em js/config.js.'
    );

    return;

  }


  const retorno =
    window.location.origin +
    window.location.pathname +
    '?gtin={CODE}#pdv';


  window.location.href =
    scannerUrl +
    '?return=' +
    encodeURIComponent(
      retorno
    );

}


/* =====================================================
   EXPORTAR FUNÇÕES DO CARRINHO
===================================================== */

window.alterarQuantidadePDV31 =
  alterarQuantidadePDV31;


window.definirQuantidadePDV20 =
  definirQuantidadePDV20;


window.removerProdutoPDV31 =
  removerProdutoPDV31;


window.adicionarProdutoBuscaPDV20 =
  adicionarProdutoBuscaPDV20;/* =====================================================
   CLIENTES NO PDV
===================================================== */

async function prepararClientesPDV34() {

  const campo =
    document.getElementById(
      'pdvCliente'
    );


  if (!campo) {
    return;
  }


  campo.placeholder =
    'Consumidor Final ou pesquise um cliente...';


  let lista =
    document.getElementById(
      'pdvClientesLista'
    );


  if (!lista) {

    lista =
      document.createElement(
        'datalist'
      );


    lista.id =
      'pdvClientesLista';


    document.body.appendChild(
      lista
    );

  }


  campo.setAttribute(
    'list',
    'pdvClientesLista'
  );


  if (
    !clientesPDV34Carregados
  ) {

    try {

      clientesPDV34 =
        await VNNUS_API
          .clientes();


      clientesPDV34 =
        (
          Array.isArray(
            clientesPDV34
          )
            ? clientesPDV34
            : []
        )
        .filter(
          function(cliente) {

            return (
              String(
                cliente.ATIVO ||
                'SIM'
              )
              .trim()
              .toUpperCase() !==
              'NAO'
            );

          }
        );


      clientesPDV34Carregados =
        true;

    }

    catch (erro) {

      console.error(
        'Clientes PDV:',
        erro
      );


      clientesPDV34 =
        [];

    }

  }


  lista.innerHTML =
    '';


  clientesPDV34.forEach(
    function(cliente) {

      const option =
        document.createElement(
          'option'
        );


      option.value =
        montarRotuloClientePDV34(
          cliente
        );


      option.label =
        [
          cliente.NOME || '',

          formatarTelefonePDV34(
            cliente.WHATSAPP ||
            cliente.TELEFONE
          )
        ]
        .filter(Boolean)
        .join(' • ');


      lista.appendChild(
        option
      );

    }
  );


  campo.oninput =
    function() {

      sincronizarClienteDigitadoPDV34();

    };


  campo.onchange =
    function() {

      sincronizarClienteDigitadoPDV34();

    };


  aplicarClientePadraoPDV20();

}


/* =====================================================
   CLIENTE PADRÃO
===================================================== */

function aplicarClientePadraoPDV20() {

  const idClientePadrao =
    String(
      configuracoesPDV20
        .CLIENTE_PADRAO ||
      ''
    )
    .trim();


  if (!idClientePadrao) {
    return;
  }


  const campo =
    document.getElementById(
      'pdvCliente'
    );


  if (!campo) {
    return;
  }


  if (
    campo.value &&
    campo.value.trim()
  ) {

    return;
  }


  const cliente =
    clientesPDV34.find(
      function(item) {

        return (
          String(
            item.ID_CLIENTE ||
            ''
          )
          .trim() ===
          idClientePadrao
        );

      }
    );


  if (!cliente) {
    return;
  }


  campo.value =
    montarRotuloClientePDV34(
      cliente
    );


  campo.dataset.idCliente =
    String(
      cliente.ID_CLIENTE ||
      ''
    );


  campo.dataset.nomeCliente =
    String(
      cliente.NOME ||
      ''
    );


  atualizarInfoClientePDV20();

}


/* =====================================================
   RÓTULO DO CLIENTE
===================================================== */

function montarRotuloClientePDV34(
  cliente
) {

  const nome =
    String(
      cliente.NOME ||
      ''
    )
    .trim();


  const id =
    String(
      cliente.ID_CLIENTE ||
      ''
    )
    .trim();


  if (!id) {

    return nome;

  }


  return (
    nome +
    ' [' +
    id +
    ']'
  );

}


/* =====================================================
   SINCRONIZAR CLIENTE DIGITADO
===================================================== */

function sincronizarClienteDigitadoPDV34() {

  const campo =
    document.getElementById(
      'pdvCliente'
    );


  if (!campo) {
    return;
  }


  const digitado =
    String(
      campo.value ||
      ''
    )
    .trim();


  const encontrado =
    clientesPDV34.find(
      function(cliente) {

        return (
          montarRotuloClientePDV34(
            cliente
          ) ===
          digitado
        );

      }
    );


  campo.dataset.idCliente =
    encontrado
      ? String(
          encontrado.ID_CLIENTE ||
          ''
        )
      : '';


  campo.dataset.nomeCliente =
    encontrado
      ? String(
          encontrado.NOME ||
          ''
        )
      : '';


  atualizarInfoClientePDV20();

}


/* =====================================================
   INFO DO CLIENTE
===================================================== */

function atualizarInfoClientePDV20() {

  const info =
    document.getElementById(
      'pdvClienteSelecionadoInfo'
    );


  const campo =
    document.getElementById(
      'pdvCliente'
    );


  if (
    !info ||
    !campo
  ) {

    return;

  }


  const id =
    String(
      campo.dataset.idCliente ||
      ''
    )
    .trim();


  const nome =
    String(
      campo.dataset.nomeCliente ||
      ''
    )
    .trim();


  if (
    id &&
    nome
  ) {

    info.textContent =
      'Cliente cadastrado: ' +
      nome +
      ' • ' +
      id;

  }

  else {

    const digitado =
      String(
        campo.value ||
        ''
      )
      .trim();


    info.textContent =
      digitado
        ? 'Venda sem vínculo de cadastro.'
        : 'Consumidor Final';

  }

}


/* =====================================================
   CLIENTE SELECIONADO
===================================================== */

function obterClienteSelecionadoPDV34() {

  const campo =
    document.getElementById(
      'pdvCliente'
    );


  if (!campo) {

    return {

      id:
        '',

      nome:
        'Consumidor Final'

    };

  }


  sincronizarClienteDigitadoPDV34();


  const id =
    String(
      campo.dataset.idCliente ||
      ''
    )
    .trim();


  const nomeCadastro =
    String(
      campo.dataset.nomeCliente ||
      ''
    )
    .trim();


  if (
    id &&
    nomeCadastro
  ) {

    return {

      id:
        id,

      nome:
        nomeCadastro

    };

  }


  const digitado =
    String(
      campo.value ||
      ''
    )
    .trim();


  return {

    id:
      '',

    nome:
      digitado ||
      'Consumidor Final'

  };

}


/* =====================================================
   FORMATAR TELEFONE
===================================================== */

function formatarTelefonePDV34(
  valor
) {

  const numeros =
    String(
      valor ||
      ''
    )
    .replace(
      /\D/g,
      ''
    );


  if (
    numeros.length ===
    11
  ) {

    return (
      '(' +
      numeros.substring(
        0,
        2
      ) +
      ') ' +
      numeros.substring(
        2,
        7
      ) +
      '-' +
      numeros.substring(
        7
      )
    );

  }


  if (
    numeros.length ===
    10
  ) {

    return (
      '(' +
      numeros.substring(
        0,
        2
      ) +
      ') ' +
      numeros.substring(
        2,
        6
      ) +
      '-' +
      numeros.substring(
        6
      )
    );

  }


  return valor || '';

}


/* =====================================================
   ABRIR FINALIZAÇÃO
===================================================== */

async function abrirFinalizacaoPDV31() {

  if (
    !carrinhoPDV31.length
  ) {

    return;

  }


  await prepararClientesPDV34();


  const pagamento =
    document.getElementById(
      'pdvPagamento'
    );


  if (
    pagamento &&
    !pagamento.value &&
    configuracoesPDV20
      .PAGAMENTO_PADRAO
  ) {

    pagamento.value =
      String(
        configuracoesPDV20
          .PAGAMENTO_PADRAO
      )
      .toUpperCase();

  }


  const modal =
    document.getElementById(
      'modalFinalizarVenda'
    );


  const subtotalModal =
    document.getElementById(
      'pdvModalSubtotal'
    );


  const descontoModal =
    document.getElementById(
      'pdvModalDesconto'
    );


  const totalModal =
    document.getElementById(
      'pdvModalTotal'
    );


  const totais =
    calcularTotaisPDV31();


  if (subtotalModal) {

    subtotalModal.textContent =
      moedaPDV20(
        totais.subtotal
      );

  }


  if (descontoModal) {

    descontoModal.textContent =
      moedaPDV20(
        totais.desconto
      );

  }


  if (totalModal) {

    totalModal.textContent =
      moedaPDV20(
        totais.total
      );

  }


  const mensagem =
    document.getElementById(
      'pdvMensagemFinal'
    );


  if (mensagem) {

    mensagem.textContent =
      '';

  }


  atualizarInfoClientePDV20();


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


/* =====================================================
   FECHAR FINALIZAÇÃO
===================================================== */

function fecharFinalizacaoPDV31() {

  const modal =
    document.getElementById(
      'modalFinalizarVenda'
    );


  if (modal) {

    modal.classList.remove(
      'aberto'
    );

  }

}


/* =====================================================
   MOEDA
===================================================== */

function moedaPDV20(
  valor
) {

  let numero =
    Number(
      valor ||
      0
    );


  if (
    !Number.isFinite(
      numero
    )
  ) {

    numero = 0;

  }


  return numero.toLocaleString(
    'pt-BR',
    {
      style:
        'currency',

      currency:
        'BRL'
    }
  );

}/* =====================================================
   CONFIRMAR VENDA
===================================================== */

async function confirmarVendaPDV31() {

  const pagamento =
    document.getElementById(
      'pdvPagamento'
    );


  const observacao =
    document.getElementById(
      'pdvObservacao'
    );


  const mensagem =
    document.getElementById(
      'pdvMensagemFinal'
    );


  const botao =
    document.getElementById(
      'pdvConfirmarVenda'
    );


  const clienteSelecionado =
    obterClienteSelecionadoPDV34();


  if (
    !pagamento ||
    !pagamento.value
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Selecione a forma de pagamento.';

    }

    return;

  }


  if (
    !carrinhoPDV31.length
  ) {

    if (mensagem) {

      mensagem.textContent =
        'O carrinho está vazio.';

    }

    return;

  }


  const totais =
    calcularTotaisPDV31();


  const dadosVenda = {

    CLIENTE:
      clienteSelecionado.nome,

    ID_CLIENTE:
      clienteSelecionado.id,

    FORMA_PAGAMENTO:
      pagamento.value,

    DESCONTO_GERAL:
      totais.desconto,

    OBSERVACAO:
      observacao
        ? observacao.value.trim()
        : '',

    ITENS:
      carrinhoPDV31.map(
        function(item) {

          return {

            ID_PRODUTO:
              item.id,

            QUANTIDADE:
              Number(
                item.quantidade ||
                0
              ),

            DESCONTO:
              0

          };

        }
      )

  };


  try {

    if (mensagem) {

      mensagem.textContent =
        'Finalizando venda...';

    }


    if (botao) {

      botao.disabled =
        true;

    }


    const resposta =
      await VNNUS_API
        .finalizarVenda(
          dadosVenda
        );


    if (
      !resposta ||
      resposta.sucesso !== true
    ) {

      throw new Error(
        resposta &&
        resposta.erro
          ? resposta.erro
          : 'A venda não pôde ser finalizada.'
      );

    }


    if (mensagem) {

      mensagem.textContent =
        '✅ ' +
        (
          resposta.mensagem ||
          'Venda finalizada com sucesso!'
        );

    }


    const comprovante =
      criarDadosComprovantePDV32(
        resposta,
        dadosVenda,
        totais,
        carrinhoPDV31
      );


    ultimoComprovantePDV32 =
      comprovante;


    carrinhoPDV31 =
      [];


    const campoDesconto =
      document.getElementById(
        'pdvDesconto'
      );


    if (campoDesconto) {

      campoDesconto.value =
        '0';

    }


    renderCarrinhoPDV31();


    fecharFinalizacaoPDV31();


    abrirComprovantePDV32(
      comprovante
    );


    definirStatusPDV31(
      '✅ Venda ' +
      (
        resposta.idVenda ||
        resposta.ID_VENDA ||
        ''
      ) +
      ' finalizada com sucesso.'
    );

  }

  catch (erro) {

    console.error(
      'Finalização:',
      erro
    );


    if (mensagem) {

      mensagem.textContent =
        'Erro: ' +
        erro.message;

    }

  }

  finally {

    if (botao) {

      botao.disabled =
        false;

    }

  }

}


/* =====================================================
   DADOS DO COMPROVANTE
===================================================== */

function criarDadosComprovantePDV32(
  resposta,
  dadosVenda,
  totais,
  itensCarrinho
) {

  const agora =
    new Date();


  return {

    idVenda:
      resposta.idVenda ||
      resposta.ID_VENDA ||
      '',

    data:
      resposta.data ||
      resposta.DATA ||
      agora.toLocaleDateString(
        'pt-BR'
      ),

    hora:
      resposta.hora ||
      resposta.HORA ||
      agora.toLocaleTimeString(
        'pt-BR',
        {
          hour:
            '2-digit',

          minute:
            '2-digit',

          second:
            '2-digit'
        }
      ),

    cliente:
      dadosVenda.CLIENTE ||
      'Consumidor Final',

    formaPagamento:
      dadosVenda.FORMA_PAGAMENTO ||
      '',

    observacao:
      dadosVenda.OBSERVACAO ||
      '',

    subtotal:
      Number(
        totais.subtotal ||
        0
      ),

    desconto:
      Number(
        totais.desconto ||
        0
      ),

    total:
      Number(
        totais.total ||
        0
      ),

    nomeLoja:
      configuracoesPDV20
        .NOME_COMPROVANTE ||
      configuracoesPDV20
        .NOME_LOJA ||
      'VNNUS',

    mensagem:
      configuracoesPDV20
        .MENSAGEM_COMPROVANTE ||
      'Obrigada pela preferência! ❤️',

    rodape:
      configuracoesPDV20
        .RODAPE_COMPROVANTE ||
      '',

    instagram:
      configuracoesPDV20
        .INSTAGRAM ||
      '',

    whatsapp:
      configuracoesPDV20
        .WHATSAPP ||
      '',

    itens:
      itensCarrinho.map(
        function(item) {

          return {

            produto:
              item.produto ||
              item.PRODUTO ||
              '',

            gtin:
              item.gtin ||
              item.GTIN ||
              '',

            quantidade:
              Number(
                item.quantidade ||
                0
              ),

            valor:
              Number(
                item.preco ||
                0
              ),

            total:
              Number(
                item.preco ||
                0
              ) *
              Number(
                item.quantidade ||
                0
              )

          };

        }
      )

  };

}


/* =====================================================
   ABRIR COMPROVANTE
===================================================== */

function abrirComprovantePDV32(
  dados
) {

  const modal =
    document.getElementById(
      'modalComprovanteVenda'
    );


  const area =
    document.getElementById(
      'pdvComprovante'
    );


  const mensagem =
    document.getElementById(
      'pdvMensagemComprovante'
    );


  if (
    !modal ||
    !area ||
    !dados
  ) {

    return;

  }


  if (mensagem) {

    mensagem.textContent =
      '';

  }


  area.innerHTML =
    montarHtmlComprovantePDV32(
      dados
    );


  modal.classList.add(
    'aberto'
  );

}


/* =====================================================
   FECHAR COMPROVANTE
===================================================== */

function fecharComprovantePDV32() {

  const modal =
    document.getElementById(
      'modalComprovanteVenda'
    );


  if (modal) {

    modal.classList.remove(
      'aberto'
    );

  }

}


/* =====================================================
   NOVA VENDA
===================================================== */

function novaVendaPDV32() {

  fecharComprovantePDV32();


  ultimoComprovantePDV32 =
    null;


  const campo =
    document.getElementById(
      'pdvGTIN'
    );


  const cliente =
    document.getElementById(
      'pdvCliente'
    );


  const pagamento =
    document.getElementById(
      'pdvPagamento'
    );


  const observacao =
    document.getElementById(
      'pdvObservacao'
    );


  const desconto =
    document.getElementById(
      'pdvDesconto'
    );


  const buscaNome =
    document.getElementById(
      'pdvBuscaProduto'
    );


  carrinhoPDV31 =
    [];


  if (cliente) {

    cliente.value =
      '';

    cliente.dataset.idCliente =
      '';

    cliente.dataset.nomeCliente =
      '';

  }


  if (pagamento) {

    pagamento.value =
      configuracoesPDV20
        .PAGAMENTO_PADRAO ||
      '';

  }


  if (observacao) {

    observacao.value =
      '';

  }


  if (desconto) {

    desconto.value =
      '0';

  }


  if (buscaNome) {

    buscaNome.value =
      '';

  }


  fecharResultadosBuscaPDV20();


  renderCarrinhoPDV31();


  aplicarClientePadraoPDV20();


  atualizarInfoClientePDV20();


  if (campo) {

    campo.value =
      '';

    campo.focus();

  }


  definirStatusPDV31(
    'Nova venda iniciada. Aguardando produto.'
  );

}


/* =====================================================
   COMPARTILHAR COMPROVANTE
===================================================== */

async function compartilharComprovantePDV32() {

  const mensagem =
    document.getElementById(
      'pdvMensagemComprovante'
    );


  if (
    !ultimoComprovantePDV32
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Nenhum comprovante disponível.';

    }

    return;

  }


  const texto =
    montarTextoComprovantePDV32(
      ultimoComprovantePDV32
    );


  try {

    if (
      navigator.share
    ) {

      await navigator.share({

        title:
          'Comprovante ' +
          (
            ultimoComprovantePDV32.idVenda ||
            'VNNUS'
          ),

        text:
          texto

      });


      if (mensagem) {

        mensagem.textContent =
          '✅ Comprovante compartilhado.';

      }


      return;

    }


    if (
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {

      await navigator.clipboard
        .writeText(
          texto
        );


      if (mensagem) {

        mensagem.textContent =
          '✅ Comprovante copiado. Agora você pode colar no WhatsApp.';

      }


      return;

    }


    throw new Error(
      'Compartilhamento não disponível neste aparelho.'
    );

  }

  catch (erro) {

    if (
      erro &&
      erro.name ===
      'AbortError'
    ) {

      return;

    }


    console.error(
      'Comprovante:',
      erro
    );


    if (mensagem) {

      mensagem.textContent =
        'Não foi possível compartilhar: ' +
        erro.message;

    }

  }

}/* =====================================================
   COMPROVANTE HTML
===================================================== */

function montarHtmlComprovantePDV32(
  dados
) {

  const itens =
    (
      dados.itens ||
      []
    )
    .map(
      function(item) {

        return `
          <div
            style="
              padding:11px 0;
              border-bottom:1px solid rgba(212,168,77,.12);
            ">

            <strong>
              ${escaparHtmlPDV20(
                item.produto
              )}
            </strong>

            <div
              style="
                color:var(--muted);
                font-size:12px;
                margin-top:4px;
              ">

              ${Number(
                item.quantidade ||
                0
              )}

              x

              ${moedaPDV20(
                item.valor
              )}

              &nbsp; • &nbsp;

              ${moedaPDV20(
                item.total
              )}

            </div>

          </div>
        `;

      }
    )
    .join('');


  const contato = [

    dados.instagram
      ? dados.instagram
      : '',

    dados.whatsapp
      ? formatarTelefonePDV34(
          dados.whatsapp
        )
      : ''

  ]
  .filter(Boolean)
  .join(' • ');


  return `
    <div
      style="
        text-align:center;
        margin-bottom:18px;
      ">

      <div
        style="
          color:var(--gold2);
          font-family:'Cinzel',serif;
          font-size:24px;
          font-weight:700;
          letter-spacing:.08em;
        ">
        ${escaparHtmlPDV20(
          dados.nomeLoja ||
          'VNNUS'
        )}
      </div>

      <div
        style="
          color:var(--gold-soft);
          font-size:11px;
          margin-top:4px;
          letter-spacing:.10em;
        ">
        COMPROVANTE DE VENDA
      </div>

    </div>


    <div>
      <strong>Venda:</strong>
      ${escaparHtmlPDV20(
        dados.idVenda
      )}
    </div>

    <div>
      <strong>Data:</strong>
      ${escaparHtmlPDV20(
        dados.data
      )}
      ${escaparHtmlPDV20(
        dados.hora
      )}
    </div>

    <div>
      <strong>Cliente:</strong>
      ${escaparHtmlPDV20(
        dados.cliente
      )}
    </div>

    <div>
      <strong>Pagamento:</strong>
      ${escaparHtmlPDV20(
        formatarPagamentoPDV20(
          dados.formaPagamento
        )
      )}
    </div>


    <div
      style="
        margin-top:16px;
        border-top:1px solid rgba(212,168,77,.14);
        border-bottom:1px solid rgba(212,168,77,.14);
      ">

      ${itens}

    </div>


    <div
      style="
        margin-top:16px;
      ">

      <div>
        <strong>Subtotal:</strong>
        ${moedaPDV20(
          dados.subtotal
        )}
      </div>

      <div>
        <strong>Desconto:</strong>
        ${moedaPDV20(
          dados.desconto
        )}
      </div>

      <div
        style="
          font-size:21px;
          margin-top:8px;
          color:var(--gold2);
        ">

        <strong>
          Total:
          ${moedaPDV20(
            dados.total
          )}
        </strong>

      </div>

    </div>


    ${
      dados.observacao
        ? `
          <div
            style="
              margin-top:15px;
            ">

            <strong>
              Observação:
            </strong>

            ${escaparHtmlPDV20(
              dados.observacao
            )}

          </div>
        `
        : ''
    }


    <div
      style="
        margin-top:22px;
        text-align:center;
        padding-top:16px;
        border-top:1px solid rgba(212,168,77,.12);
      ">

      <div
        style="
          color:#f5eadb;
          font-size:13px;
          line-height:1.5;
        ">
        ${escaparHtmlPDV20(
          dados.mensagem ||
          ''
        )}
      </div>


      ${
        dados.rodape
          ? `
            <div
              style="
                color:var(--gold-soft);
                font-size:11px;
                margin-top:8px;
              ">

              ${escaparHtmlPDV20(
                dados.rodape
              )}

            </div>
          `
          : ''
      }


      ${
        contato
          ? `
            <div
              style="
                color:var(--muted);
                font-size:11px;
                margin-top:8px;
              ">

              ${escaparHtmlPDV20(
                contato
              )}

            </div>
          `
          : ''
      }

    </div>
  `;

}


/* =====================================================
   COMPROVANTE EM TEXTO
===================================================== */

function montarTextoComprovantePDV32(
  dados
) {

  const linhas = [

    dados.nomeLoja ||
      'VNNUS',

    'COMPROVANTE DE VENDA',

    '',

    'Venda: ' +
      (
        dados.idVenda ||
        ''
      ),

    'Data: ' +
      (
        dados.data ||
        ''
      ) +
      ' ' +
      (
        dados.hora ||
        ''
      ),

    'Cliente: ' +
      (
        dados.cliente ||
        'Consumidor Final'
      ),

    'Pagamento: ' +
      formatarPagamentoPDV20(
        dados.formaPagamento
      ),

    '',

    'ITENS'

  ];


  (
    dados.itens ||
    []
  )
  .forEach(
    function(item) {

      linhas.push(

        Number(
          item.quantidade ||
          0
        ) +

        'x ' +

        (
          item.produto ||
          ''
        ) +

        ' - ' +

        moedaPDV20(
          item.total
        )

      );

    }
  );


  linhas.push(

    '',

    'Subtotal: ' +
      moedaPDV20(
        dados.subtotal
      ),

    'Desconto: ' +
      moedaPDV20(
        dados.desconto
      ),

    'TOTAL: ' +
      moedaPDV20(
        dados.total
      )

  );


  if (
    dados.observacao
  ) {

    linhas.push(
      'Observação: ' +
      dados.observacao
    );

  }


  linhas.push(
    ''
  );


  if (
    dados.mensagem
  ) {

    linhas.push(
      dados.mensagem
    );

  }


  if (
    dados.rodape
  ) {

    linhas.push(
      dados.rodape
    );

  }


  if (
    dados.instagram
  ) {

    linhas.push(
      dados.instagram
    );

  }


  if (
    dados.whatsapp
  ) {

    linhas.push(
      formatarTelefonePDV34(
        dados.whatsapp
      )
    );

  }


  return linhas.join(
    '\n'
  );

}


/* =====================================================
   STATUS
===================================================== */

function definirStatusPDV31(
  texto
) {

  const status =
    document.getElementById(
      'pdvStatus'
    );


  if (status) {

    status.textContent =
      texto;

  }

}


/* =====================================================
   FIM
   VNNUS PDV 2.0
===================================================== */
