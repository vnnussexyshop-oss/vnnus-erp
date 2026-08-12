/* =====================================================
   VNNUS ERP 3.2
   ESTOQUE - GITHUB PAGES + API VNNUS
===================================================== */

let estoqueCarregadoERP = [];


window.init_estoque =
  async function() {

    const btnNova =
      document.getElementById(
        'btnNovaMovimentacaoEstoque'
      );

    const btnAtualizar =
      document.getElementById(
        'btnAtualizarEstoque'
      );

    const btnFechar =
      document.getElementById(
        'btnFecharMovEstoque'
      );

    const btnCancelar =
      document.getElementById(
        'btnCancelarMovEstoque'
      );

    const btnSalvar =
      document.getElementById(
        'btnSalvarMovEstoque'
      );

    const pesquisa =
      document.getElementById(
        'pesquisaEstoque'
      );


    if (btnNova) {
      btnNova.onclick =
        abrirMovimentacaoEstoqueERP;
    }


    if (btnAtualizar) {
      btnAtualizar.onclick =
        carregarEstoqueERP;
    }


    if (btnFechar) {
      btnFechar.onclick =
        fecharMovimentacaoEstoqueERP;
    }


    if (btnCancelar) {
      btnCancelar.onclick =
        fecharMovimentacaoEstoqueERP;
    }


    if (btnSalvar) {
      btnSalvar.onclick =
        salvarMovimentacaoEstoqueERP;
    }


    if (pesquisa) {

      pesquisa.oninput =
        filtrarEstoqueERP;

    }


    await carregarEstoqueERP();

  };


/* =====================================================
   CARREGAR
===================================================== */

async function carregarEstoqueERP() {

  const tbody =
    document.getElementById(
      'listaEstoque'
    );

  const status =
    document.getElementById(
      'statusEstoque'
    );


  if (!tbody) {
    return;
  }


  tbody.innerHTML = `
    <tr>
      <td colspan="6">
        Carregando estoque...
      </td>
    </tr>
  `;


  if (status) {
    status.textContent =
      'Atualizando estoque...';
  }


  try {

    const estoque =
      await VNNUS_API.estoque();


    estoqueCarregadoERP =
      Array.isArray(estoque)
        ? estoque
        : [];


    renderizarEstoqueERP(
      estoqueCarregadoERP
    );


    atualizarResumoEstoqueERP();


    preencherProdutosMovimentacaoERP();


    if (status) {

      status.textContent =
        estoqueCarregadoERP.length +
        ' produto(s) carregado(s).';

    }

  }

  catch (erro) {

    console.error(
      'Estoque:',
      erro
    );


    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Erro: ${escaparHtmlEstoqueERP(erro.message)}
        </td>
      </tr>
    `;


    if (status) {

      status.textContent =
        'Erro ao carregar estoque.';

    }

  }

}


/* =====================================================
   RENDER
===================================================== */

function renderizarEstoqueERP(
  estoque
) {

  const tbody =
    document.getElementById(
      'listaEstoque'
    );


  if (!tbody) {
    return;
  }


  if (!estoque.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Nenhum produto encontrado.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    estoque.map(
      function(item) {

        const status =
          String(
            item.STATUS || ''
          )
          .trim()
          .toUpperCase();


        let classe =
          'status-ok';


        if (
          status ===
          'SEM ESTOQUE'
        ) {

          classe =
            'status-danger';

        }


        else if (
          status ===
          'ESTOQUE BAIXO'
        ) {

          classe =
            '';

        }


        const estilo =
          status === 'ESTOQUE BAIXO'
            ? 'style="background:rgba(255,184,77,.12);color:#ffc266"'
            : '';


        return `
          <tr>

            <td>
              ${escaparHtmlEstoqueERP(item.GTIN)}
            </td>

            <td>
              ${escaparHtmlEstoqueERP(item.PRODUTO)}
            </td>

            <td>
              <strong>
                ${Number(item.QTD_ATUAL || 0)}
              </strong>
            </td>

            <td>
              ${Number(item.ESTOQUE_MINIMO || 0)}
            </td>

            <td>
              <span
                class="status-badge ${classe}"
                ${estilo}>
                ${escaparHtmlEstoqueERP(status || '-')}
              </span>
            </td>

            <td>

              <button
                class="btn-secondary"
                onclick="movimentarProdutoEstoqueERP('${escaparAtributoEstoqueERP(item.ID_PRODUTO)}')">
                Movimentar
              </button>

            </td>

          </tr>
        `;

      }
    )
    .join('');

}


/* =====================================================
   RESUMO
===================================================== */

function atualizarResumoEstoqueERP() {

  const total =
    estoqueCarregadoERP.length;


  const baixo =
    estoqueCarregadoERP.filter(
      function(item) {

        return (
          String(
            item.STATUS || ''
          )
          .trim()
          .toUpperCase() ===
          'ESTOQUE BAIXO'
        );

      }
    ).length;


  const zerado =
    estoqueCarregadoERP.filter(
      function(item) {

        return (
          String(
            item.STATUS || ''
          )
          .trim()
          .toUpperCase() ===
          'SEM ESTOQUE'
        );

      }
    ).length;


  const elTotal =
    document.getElementById(
      'totalProdutosEstoque'
    );


  const elBaixo =
    document.getElementById(
      'totalEstoqueBaixo'
    );


  const elZerado =
    document.getElementById(
      'totalSemEstoque'
    );


  if (elTotal) {
    elTotal.textContent =
      total;
  }


  if (elBaixo) {
    elBaixo.textContent =
      baixo;
  }


  if (elZerado) {
    elZerado.textContent =
      zerado;
  }

}


/* =====================================================
   PESQUISA
===================================================== */

function filtrarEstoqueERP() {

  const campo =
    document.getElementById(
      'pesquisaEstoque'
    );


  if (!campo) {
    return;
  }


  const termo =
    campo.value
      .trim()
      .toLowerCase();


  const filtrados =
    estoqueCarregadoERP.filter(
      function(item) {

        return (
          String(
            item.PRODUTO || ''
          )
          .toLowerCase()
          .includes(termo)
          ||
          String(
            item.GTIN || ''
          )
          .toLowerCase()
          .includes(termo)
        );

      }
    );


  renderizarEstoqueERP(
    filtrados
  );

}


/* =====================================================
   MODAL
===================================================== */

function abrirMovimentacaoEstoqueERP() {

  limparMovimentacaoEstoqueERP();


  preencherProdutosMovimentacaoERP();


  const modal =
    document.getElementById(
      'modalMovimentacaoEstoque'
    );


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


function fecharMovimentacaoEstoqueERP() {

  const modal =
    document.getElementById(
      'modalMovimentacaoEstoque'
    );


  if (modal) {

    modal.classList.remove(
      'aberto'
    );

  }

}


/* =====================================================
   MOVIMENTAR PRODUTO
===================================================== */

function movimentarProdutoEstoqueERP(
  idProduto
) {

  abrirMovimentacaoEstoqueERP();


  const select =
    document.getElementById(
      'movProduto'
    );


  if (select) {

    select.value =
      idProduto;

  }

}


/* =====================================================
   PREENCHER PRODUTOS
===================================================== */

function preencherProdutosMovimentacaoERP() {

  const select =
    document.getElementById(
      'movProduto'
    );


  if (!select) {
    return;
  }


  select.innerHTML =
    '<option value="">Selecione...</option>';


  estoqueCarregadoERP.forEach(
    function(item) {

      const option =
        document.createElement(
          'option'
        );


      option.value =
        item.ID_PRODUTO;


      option.textContent =
        item.PRODUTO +
        ' | Saldo: ' +
        Number(
          item.QTD_ATUAL || 0
        );


      select.appendChild(
        option
      );

    }
  );

}


/* =====================================================
   SALVAR
===================================================== */

async function salvarMovimentacaoEstoqueERP() {

  const mensagem =
    document.getElementById(
      'mensagemMovEstoque'
    );


  const botao =
    document.getElementById(
      'btnSalvarMovEstoque'
    );


  const produto =
    document.getElementById(
      'movProduto'
    );


  const tipo =
    document.getElementById(
      'movTipo'
    );


  const quantidade =
    document.getElementById(
      'movQuantidade'
    );


  const origem =
    document.getElementById(
      'movOrigem'
    );


  const observacao =
    document.getElementById(
      'movObservacao'
    );


  const dados = {

    ID_PRODUTO:
      produto
        ? produto.value
        : '',

    TIPO:
      tipo
        ? tipo.value
        : '',

    QUANTIDADE:
      quantidade
        ? Number(
            quantidade.value || 0
          )
        : 0,

    ORIGEM:
      origem
        ? origem.value
        : 'MANUAL',

    OBSERVACAO:
      observacao
        ? observacao.value.trim()
        : ''

  };


  if (!dados.ID_PRODUTO) {

    if (mensagem) {
      mensagem.textContent =
        'Selecione um produto.';
    }

    return;

  }


  if (
    !Number.isFinite(
      dados.QUANTIDADE
    ) ||
    dados.QUANTIDADE <= 0
  ) {

    if (mensagem) {
      mensagem.textContent =
        'Informe uma quantidade válida.';
    }

    return;

  }


  if (mensagem) {

    mensagem.textContent =
      'Salvando movimentação...';

  }


  if (botao) {

    botao.disabled =
      true;

  }


  try {

    const resposta =
      await VNNUS_API
        .registrarMovimentacaoEstoque(
          dados
        );


    if (mensagem) {

      mensagem.textContent =
        (
          resposta.mensagem ||
          'Movimentação registrada.'
        ) +
        ' Novo saldo: ' +
        Number(
          resposta.saldoNovo || 0
        );

    }


    await carregarEstoqueERP();


    setTimeout(
      function() {

        fecharMovimentacaoEstoqueERP();

      },
      900
    );

  }

  catch (erro) {

    console.error(
      'Movimentação:',
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
   LIMPAR
===================================================== */

function limparMovimentacaoEstoqueERP() {

  const produto =
    document.getElementById(
      'movProduto'
    );


  const tipo =
    document.getElementById(
      'movTipo'
    );


  const quantidade =
    document.getElementById(
      'movQuantidade'
    );


  const origem =
    document.getElementById(
      'movOrigem'
    );


  const observacao =
    document.getElementById(
      'movObservacao'
    );


  const mensagem =
    document.getElementById(
      'mensagemMovEstoque'
    );


  if (produto) {
    produto.value = '';
  }


  if (tipo) {
    tipo.value = 'ENTRADA';
  }


  if (quantidade) {
    quantidade.value = '1';
  }


  if (origem) {
    origem.value = 'COMPRA';
  }


  if (observacao) {
    observacao.value = '';
  }


  if (mensagem) {
    mensagem.textContent = '';
  }

}


/* =====================================================
   ESCAPE
===================================================== */

function escaparHtmlEstoqueERP(
  valor
) {

  return String(
    valor ?? ''
  )
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


function escaparAtributoEstoqueERP(
  valor
) {

  return String(
    valor ?? ''
  )
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");

}
