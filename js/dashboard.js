/* =====================================================
   VNNUS ERP
   DASHBOARD 2.4
   INDICADORES + DESPESAS + EVOLUÇÃO + COMPARAÇÃO
===================================================== */


let dashboardGraficoDias =
  7;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.init_dashboard =
  async function() {

    atualizarDataDashboard();


    const status =
      document.getElementById(
        'dashStatus'
      );


    try {

      if (status) {

        status.textContent =
          'Atualizando indicadores...';

      }


      const hojeIso =
        dataIsoDashboardHoje();


      /*
        Carregamos em paralelo:

        1) Dashboard
        2) Despesas de hoje
        3) Comparação hoje x ontem
      */

      const resultados =
        await Promise.all([

          VNNUS_API.dashboard(),

          VNNUS_API.resumoDespesas(
            hojeIso,
            hojeIso
          ),

          VNNUS_API.comparacaoDashboard()

        ]);


      const dados =
        resultados[0] ||
        {};


      const despesas =
        resultados[1] ||
        {};


      const comparacao =
        resultados[2] ||
        {};


      /* INDICADORES */

      preencherIndicadoresDashboard(
        dados
      );


      /* DESPESAS / RESULTADO */

      preencherDespesasDashboard(
        despesas,
        dados
      );


      /* COMPARAÇÃO */

      preencherComparacaoDashboard(
        comparacao
      );


      /* PRODUTO DESTAQUE */

      preencherProdutoMaisVendidoDashboard(
        dados &&
        dados.produtoMaisVendido
          ? dados.produtoMaisVendido
          : {}
      );


      /* ÚLTIMAS VENDAS */

      preencherUltimasVendasDashboard(
        dados &&
        Array.isArray(
          dados.ultimasVendas
        )
          ? dados.ultimasVendas
          : []
      );


      /* GRÁFICO */

      configurarGraficoDashboard();


      atualizarBotoesGraficoDashboard(
        dashboardGraficoDias
      );


      await carregarGraficoDashboard(
        dashboardGraficoDias
      );


      if (status) {

        status.textContent =
          'Dados reais atualizados';

      }

    }

    catch (erro) {

      console.error(
        'Dashboard:',
        erro
      );


      if (status) {

        status.textContent =
          'Erro: ' +
          erro.message;

      }


      preencherErroUltimasVendasDashboard(
        erro.message
      );

    }

  };


/* =====================================================
   DATA ATUAL
===================================================== */

function atualizarDataDashboard() {

  const agora =
    new Date();


  const data =
    agora.toLocaleDateString(
      'pt-BR',
      {
        day:
          '2-digit',

        month:
          '2-digit',

        year:
          'numeric'
      }
    );


  let diaSemana =
    agora.toLocaleDateString(
      'pt-BR',
      {
        weekday:
          'long'
      }
    );


  if (diaSemana) {

    diaSemana =
      diaSemana
        .charAt(0)
        .toUpperCase() +
      diaSemana.slice(1);

  }


  definirTextoDashboard(
    'dashDataHoje',
    data
  );


  definirTextoDashboard(
    'dashDiaSemana',
    diaSemana
  );

}


/* =====================================================
   DATA DE HOJE ISO
===================================================== */

function dataIsoDashboardHoje() {

  const agora =
    new Date();


  const ano =
    agora.getFullYear();


  const mes =
    String(
      agora.getMonth() + 1
    )
    .padStart(
      2,
      '0'
    );


  const dia =
    String(
      agora.getDate()
    )
    .padStart(
      2,
      '0'
    );


  return (
    ano +
    '-' +
    mes +
    '-' +
    dia
  );

}


/* =====================================================
   INDICADORES PRINCIPAIS
===================================================== */

function preencherIndicadoresDashboard(
  dados
) {

  dados =
    dados || {};


  definirTextoDashboard(

    'dashVendasHoje',

    moedaDashboard(
      dados.vendasHoje
    )

  );


  definirTextoDashboard(

    'dashPedidosHoje',

    numeroDashboard(
      dados.pedidosHoje
    )

  );


  definirTextoDashboard(

    'dashProdutos',

    numeroDashboard(
      dados.produtos
    )

  );


  definirTextoDashboard(

    'dashEstoqueCritico',

    numeroDashboard(
      dados.estoqueCritico
    )

  );


  definirTextoDashboard(

    'dashLucroHoje',

    moedaDashboard(
      dados.lucroHoje
    )

  );


  definirTextoDashboard(

    'dashTicketMedio',

    moedaDashboard(
      dados.ticketMedio
    )

  );


  definirTextoDashboard(

    'dashItensVendidos',

    numeroDashboard(
      dados.itensVendidos
    )

  );


  definirTextoDashboard(

    'dashSemEstoque',

    numeroDashboard(
      dados.semEstoque
    )

  );

}


/* =====================================================
   DESPESAS / LUCRO LÍQUIDO
===================================================== */

function preencherDespesasDashboard(
  despesas,
  dadosDashboard
) {

  despesas =
    despesas || {};


  dadosDashboard =
    dadosDashboard || {};


  const pagas =
    Number(
      despesas.pago ||
      0
    );


  const pendentes =
    Number(
      despesas.pendente ||
      0
    );


  const vencidas =
    Number(
      despesas.vencido ||
      0
    );


  const lucroBruto =
    Number(
      dadosDashboard.lucroHoje ||
      0
    );


  const lucroLiquido =
    lucroBruto -
    pagas;


  definirTextoDashboard(
    'dashDespesasHoje',
    moedaDashboard(
      pagas
    )
  );


  definirTextoDashboard(
    'dashLucroLiquidoHoje',
    moedaDashboard(
      lucroLiquido
    )
  );


  definirTextoDashboard(
    'dashDespesasPendentes',
    moedaDashboard(
      pendentes
    )
  );


  definirTextoDashboard(
    'dashDespesasVencidas',
    moedaDashboard(
      vencidas
    )
  );

}


/* =====================================================
   COMPARAÇÃO HOJE X ONTEM
===================================================== */

function preencherComparacaoDashboard(
  comparacao
) {

  comparacao =
    comparacao || {};


  const variacao =
    comparacao.variacao ||
    {};


  renderizarComparativoDashboard(
    'dashCompFaturamento',
    variacao.faturamento
  );


  renderizarComparativoDashboard(
    'dashCompPedidos',
    variacao.pedidos
  );


  renderizarComparativoDashboard(
    'dashCompLucro',
    variacao.lucroBruto
  );


  renderizarComparativoDashboard(
    'dashCompItens',
    variacao.itensVendidos
  );
renderizarComparativoDashboard(
  'dashCompDespesas',
  variacao.despesasPagas
);


renderizarComparativoDashboard(
  'dashCompLucroLiquido',
  variacao.lucroLiquido
);
}


/* =====================================================
   RENDERIZAR UMA VARIAÇÃO
===================================================== */

function renderizarComparativoDashboard(
  id,
  variacao
) {

  const elemento =
    document.getElementById(
      id
    );


  if (!elemento) {

    return;

  }


  variacao =
    variacao || {};


  const direcao =
    String(
      variacao.direcao ||
      'IGUAL'
    )
    .toUpperCase();


  const comparavel =
    variacao.comparavel !==
    false;


  /* ================================================
     NOVO MOVIMENTO
  ================================================= */

  if (
    direcao ===
    'NOVO'
  ) {

    elemento.textContent =
      '✦ Novo movimento hoje';

    elemento.style.color =
      'var(--gold2)';

    return;

  }


  /* ================================================
     SEM BASE DE COMPARAÇÃO
  ================================================= */

  if (!comparavel) {

    elemento.textContent =
      'Sem base para comparação';

    elemento.style.color =
      'var(--muted)';

    return;

  }


  const percentual =
    Number(
      variacao.percentual ||
      0
    );


  const percentualTexto =
    Math.abs(
      percentual
    )
    .toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits:
          1,

        maximumFractionDigits:
          1
      }
    ) +
    '%';


  /* ================================================
     ALTA
  ================================================= */

  if (
    direcao ===
    'ALTA'
  ) {

    elemento.textContent =
      '↑ ' +
      percentualTexto +
      ' vs ontem';


    elemento.style.color =
      '#78e498';

    return;

  }


  /* ================================================
     BAIXA
  ================================================= */

  if (
    direcao ===
    'BAIXA'
  ) {

    elemento.textContent =
      '↓ ' +
      percentualTexto +
      ' vs ontem';


    elemento.style.color =
      '#ff8c8c';

    return;

  }


  /* ================================================
     IGUAL
  ================================================= */

  elemento.textContent =
    '→ Sem alteração vs ontem';


  elemento.style.color =
    'var(--muted)';

}


/* =====================================================
   PRODUTO MAIS VENDIDO
===================================================== */

function preencherProdutoMaisVendidoDashboard(
  produto
) {

  produto =
    produto || {};


  const nome =
    produto.produto ||
    produto.PRODUTO ||
    'Nenhum produto vendido hoje';


  const quantidade =
    Number(
      produto.quantidade ||
      produto.QUANTIDADE ||
      produto.QTD ||
      0
    );


  definirTextoDashboard(
    'dashMaisVendidoNome',
    nome
  );


  definirTextoDashboard(

    'dashMaisVendidoQtd',

    quantidade > 0
      ? (
          quantidade +
          (
            quantidade === 1
              ? ' unidade vendida'
              : ' unidades vendidas'
          )
        )
      : ''

  );

}


/* =====================================================
   ÚLTIMAS VENDAS
===================================================== */

function preencherUltimasVendasDashboard(
  vendas
) {

  const tbody =
    document.getElementById(
      'dashUltimasVendas'
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
        <td colspan="5">
          Nenhuma venda recente.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    vendas
      .slice(
        0,
        8
      )
      .map(
        function(venda) {

          const id =
            venda.ID_VENDA ||
            venda.idVenda ||
            venda.id ||
            '-';


          const data =
            venda.DATA ||
            venda.DATA_VENDA ||
            venda.DATA_HORA ||
            '-';


          const cliente =
            venda.CLIENTE ||
            venda.NOME_CLIENTE ||
            venda.cliente ||
            'Consumidor Final';


          const pagamento =
            venda.FORMA_PAGAMENTO ||
            venda.PAGAMENTO ||
            venda.formaPagamento ||
            '-';


          const total =
            Number(
              venda.TOTAL ||
              venda.VALOR_TOTAL ||
              venda.total ||
              0
            );


          return `
            <tr>

              <td>
                <strong>
                  ${escaparHtmlDashboard(
                    id
                  )}
                </strong>
              </td>

              <td>
                ${escaparHtmlDashboard(
                  data
                )}
              </td>

              <td>
                ${escaparHtmlDashboard(
                  cliente
                )}
              </td>

              <td>
                ${escaparHtmlDashboard(
                  pagamento
                )}
              </td>

              <td>
                <strong>
                  ${escaparHtmlDashboard(
                    moedaDashboard(
                      total
                    )
                  )}
                </strong>
              </td>

            </tr>
          `;

        }
      )
      .join('');

}


/* =====================================================
   ERRO ÚLTIMAS VENDAS
===================================================== */

function preencherErroUltimasVendasDashboard(
  mensagem
) {

  const tbody =
    document.getElementById(
      'dashUltimasVendas'
    );


  if (!tbody) {

    return;

  }


  tbody.innerHTML = `
    <tr>
      <td colspan="5">
        Não foi possível carregar:
        ${escaparHtmlDashboard(
          mensagem
        )}
      </td>
    </tr>
  `;

}


/* =====================================================
   NAVEGAÇÃO DAS AÇÕES RÁPIDAS
===================================================== */

function navegarDashboardPagina(
  pagina
) {

  const botao =
    document.querySelector(
      '.menu-item[data-page="' +
      pagina +
      '"]'
    );


  if (botao) {

    botao.click();

    return;

  }


  console.warn(
    'Página não encontrada:',
    pagina
  );

}


window.abrirPagina =
  navegarDashboardPagina;


/* =====================================================
   CONFIGURAR GRÁFICO
===================================================== */

function configurarGraficoDashboard() {

  const botao7 =
    document.getElementById(
      'dashGrafico7'
    );


  const botao30 =
    document.getElementById(
      'dashGrafico30'
    );


  if (botao7) {

    botao7.onclick =
      async function() {

        dashboardGraficoDias =
          7;


        atualizarBotoesGraficoDashboard(
          7
        );


        await carregarGraficoDashboard(
          7
        );

      };

  }


  if (botao30) {

    botao30.onclick =
      async function() {

        dashboardGraficoDias =
          30;


        atualizarBotoesGraficoDashboard(
          30
        );


        await carregarGraficoDashboard(
          30
        );

      };

  }

}


/* =====================================================
   BOTÕES 7 / 30 DIAS
===================================================== */

function atualizarBotoesGraficoDashboard(
  dias
) {

  const botao7 =
    document.getElementById(
      'dashGrafico7'
    );


  const botao30 =
    document.getElementById(
      'dashGrafico30'
    );


  if (
    !botao7 ||
    !botao30
  ) {

    return;

  }


  if (
    Number(dias) ===
    7
  ) {

    botao7.classList.remove(
      'btn-secondary'
    );

    botao7.classList.add(
      'btn-primary'
    );


    botao30.classList.remove(
      'btn-primary'
    );

    botao30.classList.add(
      'btn-secondary'
    );

  }

  else {

    botao30.classList.remove(
      'btn-secondary'
    );

    botao30.classList.add(
      'btn-primary'
    );


    botao7.classList.remove(
      'btn-primary'
    );

    botao7.classList.add(
      'btn-secondary'
    );

  }

}


/* =====================================================
   CARREGAR EVOLUÇÃO
===================================================== */

async function carregarGraficoDashboard(
  dias
) {

  const area =
    document.getElementById(
      'dashGraficoFinanceiro'
    );


  const status =
    document.getElementById(
      'dashGraficoStatus'
    );


  const periodo =
    document.getElementById(
      'dashGraficoPeriodo'
    );


  if (!area) {

    return;

  }


  if (status) {

    status.textContent =
      'Carregando evolução financeira...';

  }


  area.innerHTML = `
    <div class="loading-card">
      Preparando gráfico...
    </div>
  `;


  try {

    const resposta =
      await VNNUS_API
        .evolucaoFinanceira(
          dias
        );


    const dados =
      resposta &&
      Array.isArray(
        resposta.dados
      )
        ? resposta.dados
        : [];


    if (
      !dados.length
    ) {

      area.innerHTML = `
        <div class="empty-state">
          Ainda não há dados suficientes para o gráfico.
        </div>
      `;


      if (status) {

        status.textContent =
          'Nenhum dado encontrado.';

      }


      if (periodo) {

        periodo.textContent =
          '';

      }


      return;

    }


    desenharGraficoFinanceiroDashboard(
      dados
    );


    if (status) {

      status.textContent =
        'Evolução atualizada.';

    }


    if (periodo) {

      periodo.textContent =
        (
          resposta.inicio &&
          resposta.fim
        )
          ? (
              'Período: ' +
              resposta.inicio +
              ' até ' +
              resposta.fim
            )
          : '';

    }

  }

  catch (erro) {

    console.error(
      'Gráfico Dashboard:',
      erro
    );


    area.innerHTML = `
      <div class="empty-state">
        Não foi possível carregar o gráfico.
      </div>
    `;


    if (status) {

      status.textContent =
        'Erro: ' +
        erro.message;

    }

  }

}


/* =====================================================
   DESENHAR GRÁFICO SVG
===================================================== */

function desenharGraficoFinanceiroDashboard(
  dados
) {

  const area =
    document.getElementById(
      'dashGraficoFinanceiro'
    );


  if (!area) {

    return;

  }


  const largura =
    Math.max(
      720,

      dados.length *
      (
        dashboardGraficoDias === 30
          ? 42
          : 90
      )
    );


  const altura =
    310;


  const margem = {

    topo:
      20,

    direita:
      25,

    baixo:
      48,

    esquerda:
      72

  };


  const larguraUtil =
    largura -
    margem.esquerda -
    margem.direita;


  const alturaUtil =
    altura -
    margem.topo -
    margem.baixo;


  let maiorValor =
    0;


  let menorValor =
    0;


  dados.forEach(
    function(item) {

      const valores = [

        Number(
          item.faturamento ||
          0
        ),

        Number(
          item.lucroBruto ||
          0
        ),

        Number(
          item.despesasPagas ||
          0
        ),

        Number(
          item.lucroLiquido ||
          0
        )

      ];


      maiorValor =
        Math.max(
          maiorValor,
          ...valores
        );


      menorValor =
        Math.min(
          menorValor,
          ...valores
        );

    }
  );


  if (
    maiorValor === 0 &&
    menorValor === 0
  ) {

    maiorValor =
      100;

  }


  if (
    maiorValor > 0
  ) {

    maiorValor *=
      1.15;

  }


  if (
    menorValor < 0
  ) {

    menorValor *=
      1.15;

  }


  const intervalo =
    maiorValor -
    menorValor ||
    1;


  function x(indice) {

    if (
      dados.length === 1
    ) {

      return (
        margem.esquerda +
        larguraUtil / 2
      );

    }


    return (
      margem.esquerda +
      (
        indice /
        (
          dados.length - 1
        )
      ) *
      larguraUtil
    );

  }


  function y(valor) {

    return (
      margem.topo +
      alturaUtil -
      (
        (
          Number(
            valor ||
            0
          ) -
          menorValor
        ) /
        intervalo
      ) *
      alturaUtil
    );

  }


  function pontos(
    chave
  ) {

    return dados
      .map(
        function(item, indice) {

          return (
            x(indice) +
            ',' +
            y(
              item[chave]
            )
          );

        }
      )
      .join(' ');

  }


  let linhasGrade =
    '';


  for (
    let i = 0;
    i <= 4;
    i++
  ) {

    const valor =
      maiorValor -
      (
        intervalo *
        i / 4
      );


    const posicaoY =
      margem.topo +
      (
        alturaUtil *
        i / 4
      );


    linhasGrade += `
      <line
        x1="${margem.esquerda}"
        y1="${posicaoY}"
        x2="${largura - margem.direita}"
        y2="${posicaoY}"
        stroke="rgba(255,255,255,.07)"
        stroke-width="1"
      />

      <text
        x="${margem.esquerda - 10}"
        y="${posicaoY + 4}"
        text-anchor="end"
        fill="#8f8f8f"
        font-size="10">

        ${escaparHtmlDashboard(
          formatarValorEixoDashboard(
            valor
          )
        )}

      </text>
    `;

  }


  let linhaZero =
    '';


  if (
    menorValor < 0 &&
    maiorValor > 0
  ) {

    linhaZero = `
      <line
        x1="${margem.esquerda}"
        y1="${y(0)}"
        x2="${largura - margem.direita}"
        y2="${y(0)}"
        stroke="rgba(212,168,77,.35)"
        stroke-width="1"
        stroke-dasharray="5 5"
      />
    `;

  }


  let labelsDatas =
    '';


  dados.forEach(
    function(item, indice) {

      const mostrar =
        dashboardGraficoDias === 30
          ? (
              indice % 3 === 0 ||
              indice ===
              dados.length - 1
            )
          : true;


      if (!mostrar) {

        return;

      }


      labelsDatas += `
        <text
          x="${x(indice)}"
          y="${altura - 18}"
          text-anchor="middle"
          fill="#8f8f8f"
          font-size="10">

          ${escaparHtmlDashboard(
            item.data ||
            ''
          )}

        </text>
      `;

    }
  );


  let pontosInterativos =
    '';


  dados.forEach(
    function(item, indice) {

      pontosInterativos += `

        ${criarPontoGraficoDashboard(
          x(indice),
          y(item.faturamento),
          item,
          'Faturamento',
          item.faturamento,
          '#d4a84d'
        )}

        ${criarPontoGraficoDashboard(
          x(indice),
          y(item.lucroBruto),
          item,
          'Lucro bruto',
          item.lucroBruto,
          '#f0d99a'
        )}

        ${criarPontoGraficoDashboard(
          x(indice),
          y(item.despesasPagas),
          item,
          'Despesas',
          item.despesasPagas,
          '#a82132'
        )}

        ${criarPontoGraficoDashboard(
          x(indice),
          y(item.lucroLiquido),
          item,
          'Lucro líquido',
          item.lucroLiquido,
          '#ffffff'
        )}

      `;

    }
  );


  area.innerHTML = `

    <div
      style="
        min-width:${largura}px;
        position:relative;
      ">

      <svg
        width="${largura}"
        height="${altura}"
        viewBox="0 0 ${largura} ${altura}"
        role="img"
        aria-label="Evolução financeira">

        ${linhasGrade}

        ${linhaZero}

        ${labelsDatas}


        <polyline
          points="${pontos(
            'faturamento'
          )}"
          fill="none"
          stroke="#d4a84d"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        <polyline
          points="${pontos(
            'lucroBruto'
          )}"
          fill="none"
          stroke="#f0d99a"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        <polyline
          points="${pontos(
            'despesasPagas'
          )}"
          fill="none"
          stroke="#a82132"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        <polyline
          points="${pontos(
            'lucroLiquido'
          )}"
          fill="none"
          stroke="#ffffff"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        ${pontosInterativos}

      </svg>

    </div>
  `;

}


/* =====================================================
   PONTO + TOOLTIP
===================================================== */

function criarPontoGraficoDashboard(
  x,
  y,
  item,
  titulo,
  valor,
  cor
) {

  const texto =
    (
      item.dataCompleta ||
      item.data ||
      ''
    ) +
    ' • ' +
    titulo +
    ': ' +
    moedaDashboard(
      valor
    );


  return `
    <circle
      cx="${x}"
      cy="${y}"
      r="4"
      fill="${cor}"
      stroke="#0f0f0f"
      stroke-width="2">

      <title>
        ${escaparHtmlDashboard(
          texto
        )}
      </title>

    </circle>
  `;

}


/* =====================================================
   VALORES DO EIXO
===================================================== */

function formatarValorEixoDashboard(
  valor
) {

  const numero =
    Number(
      valor ||
      0
    );


  if (
    Math.abs(numero) >=
    1000
  ) {

    return (
      'R$ ' +
      (
        numero /
        1000
      )
      .toLocaleString(
        'pt-BR',
        {
          maximumFractionDigits:
            1
        }
      ) +
      ' mil'
    );

  }


  return (
    'R$ ' +
    numero.toLocaleString(
      'pt-BR',
      {
        maximumFractionDigits:
          0
      }
    )
  );

}


/* =====================================================
   MOEDA
===================================================== */

function moedaDashboard(
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

    numero =
      0;

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
   NÚMERO
===================================================== */

function numeroDashboard(
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

    numero =
      0;

  }


  return numero.toLocaleString(
    'pt-BR'
  );

}


/* =====================================================
   DEFINIR TEXTO
===================================================== */

function definirTextoDashboard(
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
   SEGURANÇA HTML
===================================================== */

function escaparHtmlDashboard(
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
   VNNUS DASHBOARD 2.4
===================================================== */
