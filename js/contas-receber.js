/* =====================================================
   VNNUS ERP
   CONTAS A RECEBER 1.1
   FRONT-END
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
   TABELA
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


          const podeReceber =
            status !== 'PAGO' &&
            saldo > 0;


          return `
            <tr>

              <td>
                ${escapeContaReceber(id)}
              </td>

              <td>
                <strong>
                  ${escapeContaReceber(cliente)}
                </strong>
              </td>

              <td>
                ${parcela}/${totalParcelas}
              </td>

              <td>
                ${escapeContaReceber(vencimento)}
              </td>

              <td>
                ${moedaContaReceber(valor)}
              </td>

              <td>
                ${moedaContaReceber(valorRecebido)}
              </td>

              <td>
                <strong>
                  ${moedaContaReceber(saldo)}
                </strong>
              </td>

              <td>
                ${badgeStatusContaReceber(status)}
              </td>

              <td>

                ${
                  podeReceber
                    ? `
                      <button
                        class="btn-primary"
                        type="button"
                        onclick="abrirModalContaReceber('${escapeContaReceber(id)}')">
                        Receber
                      </button>
                    `
                    : `
                      <span
                        style="
                          color:var(--muted);
                          font-size:12px;
                        ">
                        Quitado
                      </span>
                    `
                }

              </td>

            </tr>
          `;

        }
      )
      .join('');

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


  const statusTexto =
    document.getElementById(
      'receberStatus'
    );


  if (statusTexto) {

    statusTexto.textContent =
      filtradas.length +
      (
        filtradas.length === 1
          ? ' parcela encontrada.'
          : ' parcelas encontradas.'
      );

  }

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


  const status =
    document.getElementById(
      'receberStatus'
    );


  if (status) {

    status.textContent =
      contas.length +
      (
        contas.length === 1
          ? ' parcela encontrada.'
          : ' parcelas encontradas.'
      );

  }

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
   CONTAS A RECEBER 1.1
===================================================== */
