/* =====================================================
   VNNUS ERP 3.1A
   PDV PROFISSIONAL - FRONT-END
===================================================== */

let carrinhoPDV31 = [];


window.init_pdv =
  async function() {

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


    const params =
      new URLSearchParams(
        window.location.search
      );

    const gtinRecebido =
      params.get(
        'gtin'
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
              desconto.value = '0';
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
        renderCarrinhoPDV31;

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


    renderCarrinhoPDV31();

  };


/* =====================================================
   BUSCAR PRODUTO
===================================================== */

async function buscarProdutoPDV31(
  gtin
) {

  const codigo =
    String(
      gtin || ''
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


    if (
      Number(
        produto.estoque || 0
      ) <= 0
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

      campo.value = '';

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
   ADICIONAR
===================================================== */

function adicionarProdutoPDV31(
  produto
) {

  const existente =
    carrinhoPDV31.find(
      function(item) {

        return (
          item.id ===
          produto.id
        );

      }
    );


  if (existente) {

    if (
      existente.quantidade + 1 >
      Number(
        produto.estoque || 0
      )
    ) {

      alert(
        'Estoque disponível: ' +
        produto.estoque
      );

      return;

    }


    existente.quantidade++;

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
   AUMENTAR / DIMINUIR / REMOVER
===================================================== */

function alterarQuantidadePDV31(
  idProduto,
  variacao
) {

  const item =
    carrinhoPDV31.find(
      function(produto) {

        return (
          produto.id ===
          idProduto
        );

      }
    );


  if (!item) {
    return;
  }


  const novaQuantidade =
    Number(
      item.quantidade || 0
    ) +
    Number(
      variacao || 0
    );


  if (
    novaQuantidade <= 0
  ) {

    removerProdutoPDV31(
      idProduto
    );

    return;

  }


  if (
    novaQuantidade >
    Number(
      item.estoque || 0
    )
  ) {

    alert(
      'Estoque disponível: ' +
      item.estoque
    );

    return;

  }


  item.quantidade =
    novaQuantidade;


  renderCarrinhoPDV31();

}


function removerProdutoPDV31(
  idProduto
) {

  carrinhoPDV31 =
    carrinhoPDV31.filter(
      function(item) {

        return (
          item.id !==
          idProduto
        );

      }
    );


  renderCarrinhoPDV31();

}


/* =====================================================
   TOTAIS
===================================================== */

function calcularTotaisPDV31() {

  const subtotal =
    carrinhoPDV31.reduce(
      function(soma, item) {

        return (
          soma +
          Number(
            item.preco || 0
          ) *
          Number(
            item.quantidade || 0
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


  if (
    desconto >
    subtotal
  ) {
    desconto = subtotal;
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
   RENDER
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


  if (!area) {
    return;
  }


  const moeda =
    function(valor) {

      return Number(
        valor || 0
      )
      .toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );

    };


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


  area.innerHTML = `
    <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd.</th>
            <th>Valor</th>
            <th>Total</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          ${
            carrinhoPDV31.map(
              function(item) {

                return `
                  <tr>

                    <td>
                      ${item.produto}
                    </td>

                    <td>
                      ${item.quantidade}
                    </td>

                    <td>
                      ${moeda(item.preco)}
                    </td>

                    <td>
                      ${moeda(
                        Number(item.preco) *
                        Number(item.quantidade)
                      )}
                    </td>

                    <td>

                      <button
                        class="btn-secondary"
                        onclick="alterarQuantidadePDV31('${item.id}', -1)">
                        −
                      </button>

                      <button
                        class="btn-secondary"
                        onclick="alterarQuantidadePDV31('${item.id}', 1)">
                        +
                      </button>

                      <button
                        class="btn-secondary"
                        onclick="removerProdutoPDV31('${item.id}')">
                        🗑️
                      </button>

                    </td>

                  </tr>
                `;

              }
            )
            .join('')
          }

        </tbody>

      </table>

    </div>
  `;


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
   MODAL FINALIZAÇÃO
===================================================== */

function abrirFinalizacaoPDV31() {

  if (
    !carrinhoPDV31.length
  ) {
    return;
  }


  const modal =
    document.getElementById(
      'modalFinalizarVenda'
    );


  const totalModal =
    document.getElementById(
      'pdvModalTotal'
    );


  const totais =
    calcularTotaisPDV31();


  if (totalModal) {

    totalModal.textContent =
      Number(
        totais.total
      )
      .toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );

  }


  const mensagem =
    document.getElementById(
      'pdvMensagemFinal'
    );


  if (mensagem) {
    mensagem.textContent = '';
  }


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


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
   CONFIRMAR VENDA
   BACKEND SERÁ LIGADO NA 3.1B
===================================================== */

function confirmarVendaPDV31() {

  const pagamento =
    document.getElementById(
      'pdvPagamento'
    );


  const mensagem =
    document.getElementById(
      'pdvMensagemFinal'
    );


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


  if (mensagem) {

    mensagem.textContent =
      '✅ PDV 3.1A funcionando. Próxima etapa: gravar a venda e baixar o estoque.';

  }

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
