/* =====================================================
   VNNUS ERP
   FINANCEIRO 2.2
===================================================== */

let financeiroPeriodoAtual = {
  tipo: 'MES',
  dataInicio: '',
  dataFim: ''
};


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.init_financeiro =
  async function() {

    configurarEventosFinanceiro();

    definirPeriodoMesFinanceiro();

    await carregarFinanceiroERP();

  };


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventosFinanceiro() {

  const btnAtualizar =
    document.getElementById(
      'btnAtualizarFinanceiro'
    );


  const btnHoje =
    document.getElementById(
      'filtroFinanceiroHoje'
    );


  const btnSemana =
    document.getElementById(
      'filtroFinanceiroSemana'
    );


  const btnMes =
    document.getElementById(
      'filtroFinanceiroMes'
    );


  const btnTudo =
    document.getElementById(
      'filtroFinanceiroTudo'
    );


  const btnPeriodo =
    document.getElementById(
      'btnAplicarPeriodoFinanceiro'
    );


  if (btnAtualizar) {

    btnAtualizar.onclick =
      carregarFinanceiroERP;

  }


  if (btnHoje) {

    btnHoje.onclick =
      async function() {

        financeiroPeriodoAtual = {
          tipo: 'HOJE',
          dataInicio: '',
          dataFim: ''
        };


        atualizarBotoesPeriodoFinanceiro(
          'HOJE'
        );


        await carregarFinanceiroERP();

      };

  }


  if (btnSemana) {

    btnSemana.onclick =
      async function() {

        financeiroPeriodoAtual = {
          tipo: 'SEMANA',
          dataInicio: '',
          dataFim: ''
        };


        atualizarBotoesPeriodoFinanceiro(
          'SEMANA'
        );


        await carregarFinanceiroERP();

      };

  }


  if (btnMes) {

    btnMes.onclick =
      async function() {

        definirPeriodoMesFinanceiro();

        await carregarFinanceiroERP();

      };

  }


  if (btnTudo) {

    btnTudo.onclick =
      async function() {

        financeiroPeriodoAtual = {
          tipo: 'TUDO',
          dataInicio: '',
          dataFim: ''
        };


        atualizarBotoesPeriodoFinanceiro(
          'TUDO'
        );


        limparPeriodoPersonalizadoFinanceiro();


        await carregarFinanceiroERP();

      };

  }


  if (btnPeriodo) {

    btnPeriodo.onclick =
      aplicarPeriodoPersonalizadoFinanceiro;

  }

}


/* =====================================================
   PERÍODO MÊS
===================================================== */

function definirPeriodoMesFinanceiro() {

  financeiroPeriodoAtual = {
    tipo: 'MES',
    dataInicio: '',
    dataFim: ''
  };


  atualizarBotoesPeriodoFinanceiro(
    'MES'
  );

}


/* =====================================================
   PERÍODO PERSONALIZADO
===================================================== */

async function aplicarPeriodoPersonalizadoFinanceiro() {

  const inicio =
    document.getElementById(
      'financeiroDataInicio'
    );


  const fim =
    document.getElementById(
      'financeiroDataFim'
    );


  const dataInicio =
    inicio
      ? inicio.value
      : '';


  const dataFim =
    fim
      ? fim.value
      : '';


  if (
    !dataInicio ||
    !dataFim
  ) {

    alert(
      'Informe a data inicial e a data final.'
    );

    return;

  }


  if (
    dataInicio >
    dataFim
  ) {

    alert(
      'A data inicial não pode ser maior que a data final.'
    );

    return;

  }


  financeiroPeriodoAtual = {

    tipo:
      'PERSONALIZADO',

    dataInicio:
      dataInicio,

    dataFim:
      dataFim

  };


  atualizarBotoesPeriodoFinanceiro(
    'PERSONALIZADO'
  );


  await carregarFinanceiroERP();

}


/* =====================================================
   LIMPAR PERÍODO PERSONALIZADO
===================================================== */

function limparPeriodoPersonalizadoFinanceiro() {

  const inicio =
    document.getElementById(
      'financeiroDataInicio'
    );


  const fim =
    document.getElementById(
      'financeiroDataFim'
    );


  if (inicio) {
    inicio.value = '';
  }


  if (fim) {
    fim.value = '';
  }

}


/* =====================================================
   BOTÕES DO PERÍODO
===================================================== */

function atualizarBotoesPeriodoFinanceiro(
  tipo
) {

  const mapa = {

    HOJE:
      'filtroFinanceiroHoje',

    SEMANA:
      'filtroFinanceiroSemana',

    MES:
      'filtroFinanceiroMes',

    TUDO:
      'filtroFinanceiroTudo'

  };


  Object.keys(
    mapa
  )
  .forEach(
    function(chave) {

      const botao =
        document.getElementById(
          mapa[chave]
        );


      if (!botao) {
        return;
      }


      if (
        chave === tipo
      ) {

        botao.classList.remove(
          'btn-secondary'
        );

        botao.classList.add(
          'btn-primary'
        );

      }

      else {

        botao.classList.remove(
          'btn-primary'
        );

        botao.classList.add(
          'btn-secondary'
        );

      }

    }
  );

}


/* =====================================================
   CARREGAR FINANCEIRO
===================================================== */

async function carregarFinanceiroERP() {

  const status =
    document.getElementById(
      'statusFinanceiro'
    );


  if (status) {

    status.textContent =
      'Carregando painel financeiro...';

  }


  preencherFinanceiroCarregando();


  try {

    const resposta =
      await VNNUS_API
        .financeiro({

          tipo:
            financeiroPeriodoAtual.tipo,

          dataInicio:
            financeiroPeriodoAtual.dataInicio,

          dataFim:
            financeiroPeriodoAtual.dataFim

        });


    if (
      !resposta ||
      resposta.sucesso === false
    ) {

      throw new Error(
        resposta &&
        resposta.erro
          ? resposta.erro
          : 'Não foi possível carregar o Financeiro.'
      );

    }


    const dados =
      resposta.financeiro ||
      resposta;


    renderizarFinanceiroERP(
      dados
    );


    if (status) {

      status.textContent =
        'Financeiro atualizado com sucesso.';

    }

  }

  catch (erro) {

    console.error(
      'Erro Financeiro:',
      erro
    );


    if (status) {

      status.textContent =
        'Erro: ' +
        erro.message;

    }


    renderizarErroFinanceiro(
      erro.message
    );

  }

}


/* =====================================================
   CARREGANDO
===================================================== */

function preencherFinanceiroCarregando() {

  definirTextoFinanceiro(
    'periodoFinanceiroAtual',
    'Carregando período...'
  );


  [
    'listaFormasPagamentoFinanceiro',
    'listaTopProdutosFinanceiro',
    'listaTopClientesFinanceiro',
    'listaVendasFinanceiro'
  ]
  .forEach(
    function(id) {

      const tbody =
        document.getElementById(
          id
        );


      if (tbody) {

        tbody.innerHTML = `
          <tr>
            <td colspan="6">
              Carregando...
            </td>
          </tr>
        `;

      }

    }
  );

}


/* =====================================================
   RENDERIZAR FINANCEIRO
===================================================== */

function renderizarFinanceiroERP(
  dados
) {

  dados =
    dados || {};


  const resumo =
    dados.resumo ||
    {};


  const faturamento =
    Number(
      resumo.faturamento || 0
    );


  const custo =
    Number(
      resumo.custo || 0
    );


  const lucro =
  Number(
    resumo.lucro || 0
  );


/* =====================================================
   FINANCEIRO 2.2
   RESULTADO LÍQUIDO
===================================================== */

const lucroBruto =
  Number(
    resumo.lucroBruto ??
    resumo.lucro ??
    0
  );


const despesasPagas =
  Number(
    resumo.despesasPagas ||
    0
  );


const despesasPendentes =
  Number(
    resumo.despesasPendentes ||
    0
  );


const despesasVencidas =
  Number(
    resumo.despesasVencidas ||
    0
  );


const lucroLiquido =
  Number(
    resumo.lucroLiquido ??
    (
      lucroBruto -
      despesasPagas
    )
  );


const margem =
  Number(
    resumo.margem || 0
  );


  const quantidadeVendas =
    Number(
      resumo.quantidadeVendas || 0
    );


  const itensVendidos =
    Number(
      resumo.itensVendidos || 0
    );


  const ticketMedio =
    Number(
      resumo.ticketMedio || 0
    );


  const canceladas =
    Number(
      resumo.vendasCanceladas || 0
    );


  definirTextoFinanceiro(
    'finFaturamento',
    formatarMoedaFinanceiro(
      faturamento
    )
  );


  definirTextoFinanceiro(
    'finCusto',
    formatarMoedaFinanceiro(
      custo
    )
  );


 definirTextoFinanceiro(
  'finLucro',
  formatarMoedaFinanceiro(
    lucroBruto
  )
);


/* LUCRO BRUTO */

definirTextoFinanceiro(
  'finLucroBruto',
  formatarMoedaFinanceiro(
    lucroBruto
  )
);


/* DESPESAS PAGAS */

definirTextoFinanceiro(
  'finDespesasPagas',
  formatarMoedaFinanceiro(
    despesasPagas
  )
);


/* LUCRO LÍQUIDO */

definirTextoFinanceiro(
  'finLucroLiquido',
  formatarMoedaFinanceiro(
    lucroLiquido
  )
);


/* CONTAS PENDENTES */

definirTextoFinanceiro(
  'finDespesasPendentes',
  formatarMoedaFinanceiro(
    despesasPendentes
  )
);


/* DESPESAS VENCIDAS */

definirTextoFinanceiro(
  'finDespesasVencidas',
  'Vencidas: ' +
  formatarMoedaFinanceiro(
    despesasVencidas
  )
);


definirTextoFinanceiro(
  'finMargem',
  formatarPercentualFinanceiro(
    margem
  )
);

  definirTextoFinanceiro(
    'finQtdVendas',
    String(
      quantidadeVendas
    )
  );


  definirTextoFinanceiro(
    'finItensVendidos',
    String(
      itensVendidos
    )
  );


  definirTextoFinanceiro(
    'finTicketMedio',
    formatarMoedaFinanceiro(
      ticketMedio
    )
  );


  definirTextoFinanceiro(
    'finVendasCanceladas',
    String(
      canceladas
    )
  );


  definirTextoFinanceiro(
    'periodoFinanceiroAtual',
    dados.periodoDescricao ||
    'Período selecionado'
  );


  renderizarDestaquesFinanceiro(
    dados.destaques || {}
  );


  renderizarFormasPagamentoFinanceiro(
    dados.formasPagamento || [],
    faturamento
  );


  renderizarTopProdutosFinanceiro(
    dados.topProdutos || []
  );


  renderizarTopClientesFinanceiro(
    dados.topClientes || []
  );


  renderizarVendasFinanceiro(
    dados.vendas || []
  );

}


/* =====================================================
   DESTAQUES
===================================================== */

function renderizarDestaquesFinanceiro(
  destaques
) {

  const produtoMaisVendido =
    destaques.produtoMaisVendido ||
    {};


  const produtoMaisLucrativo =
    destaques.produtoMaisLucrativo ||
    {};


  const clienteCampeao =
    destaques.clienteCampeao ||
    {};


  definirTextoFinanceiro(
    'finProdutoMaisVendido',
    produtoMaisVendido.produto ||
    '-'
  );


  definirTextoFinanceiro(
    'finProdutoMaisVendidoQtd',
    Number(
      produtoMaisVendido.quantidade || 0
    ) > 0
      ? (
          produtoMaisVendido.quantidade +
          ' unidade(s)'
        )
      : ''
  );


  definirTextoFinanceiro(
    'finProdutoMaisLucrativo',
    produtoMaisLucrativo.produto ||
    '-'
  );


  definirTextoFinanceiro(
    'finProdutoMaisLucrativoValor',
    Number(
      produtoMaisLucrativo.lucro || 0
    ) > 0
      ? (
          'Lucro: ' +
          formatarMoedaFinanceiro(
            produtoMaisLucrativo.lucro
          )
        )
      : ''
  );


  definirTextoFinanceiro(
    'finClienteCampeao',
    clienteCampeao.cliente ||
    '-'
  );


  definirTextoFinanceiro(
    'finClienteCampeaoValor',
    Number(
      clienteCampeao.total || 0
    ) > 0
      ? (
          'Comprou ' +
          formatarMoedaFinanceiro(
            clienteCampeao.total
          )
        )
      : ''
  );

}


/* =====================================================
   FORMAS DE PAGAMENTO
===================================================== */

function renderizarFormasPagamentoFinanceiro(
  formas,
  faturamento
) {

  const tbody =
    document.getElementById(
      'listaFormasPagamentoFinanceiro'
    );


  if (!tbody) {
    return;
  }


  if (
    !Array.isArray(formas) ||
    !formas.length
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          Nenhuma venda no período.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    formas.map(
      function(item) {

        const valor =
          Number(
            item.valor || 0
          );


        const percentual =
          faturamento > 0
            ? (
                valor /
                faturamento *
                100
              )
            : 0;


        return `
          <tr>

            <td>
              <strong>
                ${escaparHtmlFinanceiro(
                  item.forma ||
                  'Não informado'
                )}
              </strong>
            </td>

            <td>
              ${Number(
                item.quantidade || 0
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarMoedaFinanceiro(
                  valor
                )
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarPercentualFinanceiro(
                  percentual
                )
              )}
            </td>

          </tr>
        `;

      }
    )
    .join('');

}


/* =====================================================
   TOP PRODUTOS
===================================================== */

function renderizarTopProdutosFinanceiro(
  produtos
) {

  const tbody =
    document.getElementById(
      'listaTopProdutosFinanceiro'
    );


  if (!tbody) {
    return;
  }


  if (
    !Array.isArray(produtos) ||
    !produtos.length
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          Nenhum produto vendido no período.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    produtos.map(
      function(item, indice) {

        return `
          <tr>

            <td>
              ${indice + 1}º
            </td>

            <td>
              <strong>
                ${escaparHtmlFinanceiro(
                  item.produto ||
                  '-'
                )}
              </strong>
            </td>

            <td>
              ${Number(
                item.quantidade || 0
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarMoedaFinanceiro(
                  item.faturamento || 0
                )
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarMoedaFinanceiro(
                  item.lucro || 0
                )
              )}
            </td>

          </tr>
        `;

      }
    )
    .join('');

}


/* =====================================================
   TOP CLIENTES
===================================================== */

function renderizarTopClientesFinanceiro(
  clientes
) {

  const tbody =
    document.getElementById(
      'listaTopClientesFinanceiro'
    );


  if (!tbody) {
    return;
  }


  if (
    !Array.isArray(clientes) ||
    !clientes.length
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          Nenhum cliente identificado no período.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    clientes.map(
      function(item, indice) {

        const compras =
          Number(
            item.compras || 0
          );


        const total =
          Number(
            item.total || 0
          );


        const ticket =
          compras > 0
            ? (
                total /
                compras
              )
            : 0;


        return `
          <tr>

            <td>
              ${indice + 1}º
            </td>

            <td>
              <strong>
                ${escaparHtmlFinanceiro(
                  item.cliente ||
                  'Consumidor Final'
                )}
              </strong>
            </td>

            <td>
              ${compras}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarMoedaFinanceiro(
                  total
                )
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarMoedaFinanceiro(
                  ticket
                )
              )}
            </td>

          </tr>
        `;

      }
    )
    .join('');

}


/* =====================================================
   VENDAS DO PERÍODO
===================================================== */

function renderizarVendasFinanceiro(
  vendas
) {

  const tbody =
    document.getElementById(
      'listaVendasFinanceiro'
    );


  if (!tbody) {
    return;
  }


  if (
    !Array.isArray(vendas) ||
    !vendas.length
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Nenhuma venda finalizada no período.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    vendas.map(
      function(venda) {

        return `
          <tr>

            <td>
              <strong>
                ${escaparHtmlFinanceiro(
                  venda.ID_VENDA ||
                  '-'
                )}
              </strong>
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                venda.DATA ||
                '-'
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                venda.CLIENTE ||
                'Consumidor Final'
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                venda.FORMA_PAGAMENTO ||
                '-'
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarMoedaFinanceiro(
                  venda.TOTAL || 0
                )
              )}
            </td>

            <td>
              ${escaparHtmlFinanceiro(
                formatarMoedaFinanceiro(
                  venda.LUCRO || 0
                )
              )}
            </td>

          </tr>
        `;

      }
    )
    .join('');

}


/* =====================================================
   ERRO
===================================================== */

function renderizarErroFinanceiro(
  mensagem
) {

  [
    'listaFormasPagamentoFinanceiro',
    'listaTopProdutosFinanceiro',
    'listaTopClientesFinanceiro',
    'listaVendasFinanceiro'
  ]
  .forEach(
    function(id) {

      const tbody =
        document.getElementById(
          id
        );


      if (tbody) {

        tbody.innerHTML = `
          <tr>
            <td colspan="6">
              Erro: ${escaparHtmlFinanceiro(
                mensagem
              )}
            </td>
          </tr>
        `;

      }

    }
  );

}


/* =====================================================
   DEFINIR TEXTO
===================================================== */

function definirTextoFinanceiro(
  id,
  valor
) {

  const elemento =
    document.getElementById(
      id
    );


  if (elemento) {

    elemento.textContent =
      valor == null
        ? ''
        : valor;

  }

}


/* =====================================================
   MOEDA
===================================================== */

function formatarMoedaFinanceiro(
  valor
) {

  let numero =
    Number(
      valor || 0
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

}


/* =====================================================
   PERCENTUAL
===================================================== */

function formatarPercentualFinanceiro(
  valor
) {

  let numero =
    Number(
      valor || 0
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
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }
  ) + '%';

}


/* =====================================================
   SEGURANÇA HTML
===================================================== */

function escaparHtmlFinanceiro(
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


/* =====================================================
   FIM
   VNNUS FINANCEIRO 2.2
===================================================== */
