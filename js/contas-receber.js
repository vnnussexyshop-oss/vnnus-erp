/* =====================================================
   VNNUS ERP
   CONTAS A RECEBER 1.2
   FRONT-END RESPONSIVO
===================================================== */

window.VNNUS_CONTAS_RECEBER = {

  contas: [],
  filtradas: []

};


/* =====================================================
   INICIALIZAR
===================================================== */

async function init_contas_receber() {

  const status =
    document.getElementById(
      'receberStatus'
    );


  if (status) {

    status.textContent =
      'Carregando contas...';

  }


  try {

    if (
      !window.VNNUS_API ||
      typeof window.VNNUS_API.contasReceber !==
      'function'
    ) {

      throw new Error(
        'API de Contas a Receber não disponível.'
      );

    }


    const contas =
      await window
        .VNNUS_API
        .contasReceber();


    const lista =
      Array.isArray(contas)
        ? contas
        : [];


    window
      .VNNUS_CONTAS_RECEBER
      .contas =
        lista;


    window
      .VNNUS_CONTAS_RECEBER
      .filtradas =
        lista.slice();


    atualizarResumoContasReceber(
      lista
    );


    renderizarTabelaContasReceber(
      lista
    );


    renderizarMobileContasReceber(
      lista
    );


    if (status) {

      status.textContent =
        lista.length
          ? (
              lista.length +
              (
                lista.length === 1
                  ? ' parcela encontrada.'
                  : ' parcelas encontradas.'
              )
            )
          : 'Nenhuma parcela encontrada.';

    }

  }

  catch (erro) {

    console.error(
      'Contas a Receber:',
      erro
    );


    if (status) {

      status.textContent =
        'Erro: ' +
        (
          erro.message ||
          String(erro)
        );

    }


    const tabela =
      document.getElementById(
        'receberTabela'
      );


    if (tabela) {

      tabela.innerHTML = `
        <tr>
          <td colspan="9">
            Não foi possível carregar
            as contas a receber.
          </td>
        </tr>
      `;

    }


    const mobile =
      document.getElementById(
        'receberMobileLista'
      );


    if (mobile) {

      mobile.innerHTML = `
        <div class="receber-mobile-card">
          Não foi possível carregar
          as contas a receber.
        </div>
      `;

    }

  }

}


/* =====================================================
   RESUMO
===================================================== */

function atualizarResumoContasReceber(
  contas
) {

  contas =
    Array.isArray(contas)
      ? contas
      : [];


  let totalAberto = 0;
  let pendente = 0;
  let vencido = 0;
  let recebido = 0;


  contas.forEach(
    function(conta) {

      const saldo =
        numeroContaReceber(
          conta.SALDO
        );


      const valorRecebido =
        numeroContaReceber(
          conta.VALOR_RECEBIDO
        );


      const status =
        String(
          conta.STATUS ||
          ''
        )
        .trim()
        .toUpperCase();


      if (
        status !== 'PAGO'
      ) {

        totalAberto +=
          saldo;

      }


      if (
        status === 'PENDENTE' ||
        status === 'PARCIAL'
      ) {

        pendente +=
          saldo;

      }


      if (
        status === 'VENCIDO'
      ) {

        vencido +=
          saldo;

      }


      recebido +=
        valorRecebido;

    }
  );


  preencherTextoContaReceber(
    'receberTotalAberto',
    moedaContaReceber(
      totalAberto
    )
  );


  preencherTextoContaReceber(
    'receberPendente',
    moedaContaReceber(
      pendente
    )
  );


  preencherTextoContaReceber(
    'receberVencido',
    moedaContaReceber(
      vencido
    )
  );


  preencherTextoContaReceber(
    'receberPago',
    moedaContaReceber(
      recebido
    )
  );

}


/* =====================================================
   TABELA DESKTOP
===================================================== */

function renderizarTabelaContasReceber(
  contas
) {

  const tabela =
    document.getElementById(
      'receberTabela'
    );


  if (!tabela) {

    return;

  }


  contas =
    Array.isArray(contas)
      ? contas
      : [];


  if (!contas.length) {

    tabela.innerHTML = `
      <tr>
        <td colspan="9">
          Nenhuma conta encontrada.
        </td>
      </tr>
    `;

    return;

  }


  tabela.innerHTML =
    contas
      .map(
        function(conta) {

          const dados =
            dadosVisuaisContaReceber(
              conta
            );


          return `
            <tr>

              <td>
                ${escapeContaReceber(dados.id)}
              </td>

              <td>
                <strong>
                  ${escapeContaReceber(dados.cliente)}
                </strong>
              </td>

              <td>
                ${dados.parcela}/${dados.totalParcelas}
              </td>

              <td>
                ${escapeContaReceber(dados.vencimento)}
              </td>

              <td>
                ${moedaContaReceber(dados.valor)}
              </td>

              <td>
                ${moedaContaReceber(dados.valorRecebido)}
              </td>

              <td>
                <strong>
                  ${moedaContaReceber(dados.saldo)}
                </strong>
              </td>

              <td>
                ${badgeStatusContaReceber(dados.status)}
              </td>

              <td>
                ${botaoReceberContaHtml(dados)}
              </td>

            </tr>
          `;

        }
      )
      .join('');

}


/* =====================================================
   MOBILE
===================================================== */

function renderizarMobileContasReceber(
  contas
) {

  const container =
    document.getElementById(
      'receberMobileLista'
    );


  if (!container) {

    return;

  }


  contas =
    Array.isArray(contas)
      ? contas
      : [];


  if (!contas.length) {

    container.innerHTML = `
      <div class="receber-mobile-card">

        <div
          style="
            color:var(--muted);
            text-align:center;
            padding:12px 0;
          ">
          Nenhuma conta encontrada.
        </div>

      </div>
    `;

    return;

  }


  container.innerHTML =
    contas
      .map(
        function(conta) {

          const dados =
            dadosVisuaisContaReceber(
              conta
            );


          return `
            <div class="receber-mobile-card">

              <div class="receber-mobile-topo">

                <div>

                  <div class="receber-mobile-conta">
                    ${escapeContaReceber(dados.id)}
                  </div>

                  <div class="receber-mobile-cliente">
                    ${escapeContaReceber(dados.cliente)}
                  </div>

                </div>

                <div>
                  ${badgeStatusContaReceber(dados.status)}
                </div>

              </div>


              <div class="receber-mobile-grid">

                <div class="receber-mobile-item">

                  <span class="receber-mobile-label">
                    Parcela
                  </span>

                  <span class="receber-mobile-valor">
                    ${dados.parcela}/${dados.totalParcelas}
                  </span>

                </div>


                <div class="receber-mobile-item">

                  <span class="receber-mobile-label">
                    Vencimento
                  </span>

                  <span class="receber-mobile-valor">
                    ${escapeContaReceber(dados.vencimento)}
                  </span>

                </div>


                <div class="receber-mobile-item">

                  <span class="receber-mobile-label">
                    Valor
                  </span>

                  <span class="receber-mobile-valor">
                    ${moedaContaReceber(dados.valor)}
                  </span>

                </div>


                <div class="receber-mobile-item">

                  <span class="receber-mobile-label">
                    Recebido
                  </span>

                  <span class="receber-mobile-valor">
                    ${moedaContaReceber(dados.valorRecebido)}
                  </span>

                </div>


                <div
                  class="receber-mobile-item"
                  style="
                    grid-column:1 / -1;
                  ">

                  <span class="receber-mobile-label">
                    Saldo
                  </span>

                  <span
                    class="
                      receber-mobile-valor
                      receber-mobile-saldo
                    ">
                    ${moedaContaReceber(dados.saldo)}
                  </span>

                </div>

              </div>


              <div class="receber-mobile-acao">

                ${botaoReceberContaHtml(dados)}

              </div>

            </div>
          `;

        }
      )
      .join('');

}


/* =====================================================
   NORMALIZAR DADOS VISUAIS
===================================================== */

function dadosVisuaisContaReceber(
  conta
) {

  const id =
    String(
      conta.ID_CONTA ||
      ''
    );


  const cliente =
    String(
      conta.CLIENTE ||
      'Consumidor Final'
    );


  const parcela =
    numeroContaReceber(
      conta.PARCELA
    );


  const totalParcelas =
    numeroContaReceber(
      conta.TOTAL_PARCELAS
    );


  const vencimento =
    String(
      conta.VENCIMENTO ||
      ''
    );


  const valor =
    numeroContaReceber(
      conta.VALOR_PARCELA
    );


  const valorRecebido =
    numeroContaReceber(
      conta.VALOR_RECEBIDO
    );


  const saldo =
    numeroContaReceber(
      conta.SALDO
    );


  const status =
    String(
      conta.STATUS ||
      'PENDENTE'
    )
    .trim()
    .toUpperCase();


  return {

    id:
      id,

    cliente:
      cliente,

    parcela:
      parcela,

    totalParcelas:
      totalParcelas,

    vencimento:
      vencimento,

    valor:
      valor,

    valorRecebido:
      valorRecebido,

    saldo:
      saldo,

    status:
      status,

    podeReceber:
      (
        status !== 'PAGO' &&
        saldo > 0
      )

  };

}


/* =====================================================
   BOTÃO RECEBER
===================================================== */

function botaoReceberContaHtml(
  dados
) {

  if (
    dados.podeReceber
  ) {

    return `
      <button
        class="btn-primary"
        type="button"
        onclick="abrirModalContaReceber('${escapeContaReceber(dados.id)}')">
        💵 Receber
      </button>
    `;

  }


  return `
    <span
      style="
        color:var(--muted);
        font-size:12px;
        font-weight:700;
      ">
      ✅ Quitado
    </span>
  `;

}


/* =====================================================
   FILTRAR
===================================================== */

function filtrarContasReceber() {

  const cliente =
    String(
      document
        .getElementById(
          'receberFiltroCliente'
        )
        ?.value ||
      ''
    )
    .trim()
    .toLowerCase();


  const status =
    String(
      document
        .getElementById(
          'receberFiltroStatus'
        )
        ?.value ||
      ''
    )
    .trim()
    .toUpperCase();


  const venda =
    String(
      document
        .getElementById(
          'receberFiltroVenda'
        )
        ?.value ||
      ''
    )
    .trim()
    .toLowerCase();


  const contas =
    window
      .VNNUS_CONTAS_RECEBER
      .contas ||
    [];


  const filtradas =
    contas.filter(
      function(conta) {

        const contaCliente =
          String(
            conta.CLIENTE ||
            ''
          )
          .toLowerCase();


        const contaStatus =
          String(
            conta.STATUS ||
            ''
          )
          .trim()
          .toUpperCase();


        const contaVenda =
          String(
            conta.ID_VENDA ||
            ''
          )
          .toLowerCase();


        if (
          cliente &&
          !contaCliente.includes(
            cliente
          )
        ) {

          return false;

        }


        if (
          status &&
          contaStatus !==
          status
        ) {

          return false;

        }


        if (
          venda &&
          !contaVenda.includes(
            venda
          )
        ) {

          return false;

        }


        return true;

      }
    );


  window
    .VNNUS_CONTAS_RECEBER
    .filtradas =
      filtradas;


  atualizarResumoContasReceber(
    filtradas
  );


  renderizarTabelaContasReceber(
    filtradas
  );


  renderizarMobileContasReceber(
    filtradas
  );


  atualizarTextoQuantidadeContasReceber(
    filtradas.length
  );

}


/* =====================================================
   LIMPAR FILTROS
===================================================== */

function limparFiltrosContasReceber() {

  [
    'receberFiltroCliente',
    'receberFiltroStatus',
    'receberFiltroVenda'
  ]
  .forEach(
    function(id) {

      const campo =
        document.getElementById(
          id
        );


      if (campo) {

        campo.value = '';

      }

    }
  );


  const contas =
    window
      .VNNUS_CONTAS_RECEBER
      .contas ||
    [];


  window
    .VNNUS_CONTAS_RECEBER
    .filtradas =
      contas.slice();


  atualizarResumoContasReceber(
    contas
  );


  renderizarTabelaContasReceber(
    contas
  );


  renderizarMobileContasReceber(
    contas
  );


  atualizarTextoQuantidadeContasReceber(
    contas.length
  );

}


/* =====================================================
   QUANTIDADE
===================================================== */

function atualizarTextoQuantidadeContasReceber(
  quantidade
) {

  const status =
    document.getElementById(
      'receberStatus'
    );


  if (!status) {

    return;

  }


  quantidade =
    Number(
      quantidade ||
      0
    );


  if (
    quantidade === 0
  ) {

    status.textContent =
      'Nenhuma parcela encontrada.';

    return;

  }


  status.textContent =
    quantidade +
    (
      quantidade === 1
        ? ' parcela encontrada.'
        : ' parcelas encontradas.'
    );

}


/* =====================================================
   ABRIR MODAL
===================================================== */

function abrirModalContaReceber(
  idConta
) {

  const contas =
    window
      .VNNUS_CONTAS_RECEBER
      .contas ||
    [];


  const conta =
    contas.find(
      function(item) {

        return (
          String(
            item.ID_CONTA ||
            ''
          ) ===
          String(idConta)
        );

      }
    );


  if (!conta) {

    alert(
      'Conta a receber não encontrada.'
    );

    return;

  }


  const saldo =
    numeroContaReceber(
      conta.SALDO
    );


  const campoId =
    document.getElementById(
      'receberModalIdConta'
    );


  const textoConta =
    document.getElementById(
      'receberModalContaTexto'
    );


  const textoSaldo =
    document.getElementById(
      'receberModalSaldo'
    );


  const campoValor =
    document.getElementById(
      'receberModalValor'
    );


  const campoForma =
    document.getElementById(
      'receberModalForma'
    );


  const campoObs =
    document.getElementById(
      'receberModalObservacao'
    );


  if (campoId) {

    campoId.value =
      String(idConta);

  }


  if (textoConta) {

    textoConta.textContent =
      String(idConta) +
      ' • ' +
      String(
        conta.CLIENTE ||
        'Consumidor Final'
      );

  }


  if (textoSaldo) {

    textoSaldo.textContent =
      moedaContaReceber(
        saldo
      );

  }


  if (campoValor) {

    campoValor.value =
      saldo.toFixed(2);

    campoValor.max =
      saldo.toFixed(2);

  }


  if (campoForma) {

    campoForma.value = '';

  }


  if (campoObs) {

    campoObs.value = '';

  }


  const modal =
    document.getElementById(
      'receberModal'
    );


  if (modal) {

    modal.style.display =
      'flex';

  }

}


/* =====================================================
   FECHAR MODAL
===================================================== */

function fecharModalContaReceber() {

  const modal =
    document.getElementById(
      'receberModal'
    );


  if (modal) {

    modal.style.display =
      'none';

  }

}


/* =====================================================
   SALVAR PAGAMENTO
===================================================== */

async function salvarPagamentoContaReceber() {

  const idConta =
    String(
      document
        .getElementById(
          'receberModalIdConta'
        )
        ?.value ||
      ''
    )
    .trim();


  const valor =
    numeroContaReceber(
      document
        .getElementById(
          'receberModalValor'
        )
        ?.value
    );


  const forma =
    String(
      document
        .getElementById(
          'receberModalForma'
        )
        ?.value ||
      ''
    )
    .trim();


  const observacao =
    String(
      document
        .getElementById(
          'receberModalObservacao'
        )
        ?.value ||
      ''
    )
    .trim();


  if (!idConta) {

    alert(
      'Conta não identificada.'
    );

    return;

  }


  if (
    !Number.isFinite(valor) ||
    valor <= 0
  ) {

    alert(
      'Informe um valor válido.'
    );

    return;

  }


  if (!forma) {

    alert(
      'Selecione a forma de pagamento.'
    );

    return;

  }


  if (
    !window.VNNUS_API ||
    typeof window.VNNUS_API.baixarContaReceber !==
    'function'
  ) {

    alert(
      'API de baixa não disponível.'
    );

    return;

  }


  const botao =
    document.getElementById(
      'receberBtnSalvar'
    );


  if (botao) {

    botao.disabled =
      true;

    botao.textContent =
      'Registrando...';

  }


  try {

    const resposta =
      await window
        .VNNUS_API
        .baixarContaReceber(
          idConta,
          valor,
          forma,
          observacao
        );


    fecharModalContaReceber();


    alert(
      resposta.mensagem ||
      'Pagamento registrado com sucesso.'
    );


    await init_contas_receber();

  }

  catch (erro) {

    console.error(
      'Baixa Conta a Receber:',
      erro
    );


    alert(
      'Erro: ' +
      (
        erro.message ||
        String(erro)
      )
    );

  }

  finally {

    if (botao) {

      botao.disabled =
        false;

      botao.textContent =
        'Registrar pagamento';

    }

  }

}


/* =====================================================
   BADGE STATUS
===================================================== */

function badgeStatusContaReceber(
  status
) {

  status =
    String(
      status ||
      ''
    )
    .trim()
    .toUpperCase();


  let simbolo =
    '⏳';


  if (
    status === 'PAGO'
  ) {

    simbolo =
      '✅';

  }


  else if (
    status === 'VENCIDO'
  ) {

    simbolo =
      '🚨';

  }


  else if (
    status === 'PARCIAL'
  ) {

    simbolo =
      '◐';

  }


  return `
    <span
      style="
        display:inline-flex;
        align-items:center;
        gap:5px;
        white-space:nowrap;
        font-weight:700;
        font-size:12px;
      ">

      ${simbolo}

      ${escapeContaReceber(status)}

    </span>
  `;

}


/* =====================================================
   MOEDA
===================================================== */

function moedaContaReceber(
  valor
) {

  valor =
    numeroContaReceber(
      valor
    );


  return valor.toLocaleString(
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

function numeroContaReceber(
  valor
) {

  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {

    return 0;

  }


  if (
    typeof valor ===
    'number'
  ) {

    return Number.isFinite(
      valor
    )
      ? valor
      : 0;

  }


  let texto =
    String(
      valor
    )
    .trim()
    .replace(
      /R\$/gi,
      ''
    )
    .replace(
      /\s/g,
      ''
    );


  if (
    texto.includes(',')
  ) {

    texto =
      texto
        .replace(
          /\./g,
          ''
        )
        .replace(
          ',',
          '.'
        );

  }


  const numero =
    Number(
      texto
    );


  return Number.isFinite(
    numero
  )
    ? numero
    : 0;

}


/* =====================================================
   PREENCHER TEXTO
===================================================== */

function preencherTextoContaReceber(
  id,
  valor
) {

  const elemento =
    document.getElementById(
      id
    );


  if (elemento) {

    elemento.textContent =
      valor;

  }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeContaReceber(
  valor
) {

  return String(
    valor ??
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
   FIM
   CONTAS A RECEBER 1.2
===================================================== */
