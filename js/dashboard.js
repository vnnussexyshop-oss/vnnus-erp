/* =====================================================
   VNNUS ERP
   DASHBOARD 2.0
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


      const dados =
        await VNNUS_API
          .dashboard();


      preencherIndicadoresDashboard(
        dados || {}
      );


      preencherProdutoMaisVendidoDashboard(
        dados &&
        dados.produtoMaisVendido
          ? dados.produtoMaisVendido
          : {}
      );


      preencherUltimasVendasDashboard(
        dados &&
        Array.isArray(
          dados.ultimasVendas
        )
          ? dados.ultimasVendas
          : []
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
   INDICADORES
===================================================== */

function preencherIndicadoresDashboard(
  dados
) {

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


/*
   Compatibilidade com o HTML do Dashboard 2.0.

   Assim os botões de ações rápidas funcionam
   sem depender de uma função específica do router.
*/

window.abrirPagina =
  navegarDashboardPagina;


/* =====================================================
   MOEDA
===================================================== */

function moedaDashboard(
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
   NÚMERO
===================================================== */

function numeroDashboard(
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
   VNNUS DASHBOARD 2.0
===================================================== */
