/* =====================================================
   VNNUS ERP
   DESPESAS 1.0
===================================================== */

let despesasVnnus = [];
let despesaSelecionadaVnnus = null;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.init_despesas = async function() {

  configurarEventosDespesasVnnus();

  await carregarDespesasVnnus();

};


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventosDespesasVnnus() {

  const nova =
    document.getElementById(
      'despNova'
    );

  const atualizar =
    document.getElementById(
      'despAtualizar'
    );

  const busca =
    document.getElementById(
      'despBusca'
    );

  const filtroStatus =
    document.getElementById(
      'despFiltroStatus'
    );

  const filtroCategoria =
    document.getElementById(
      'despFiltroCategoria'
    );

  const fecharModal =
    document.getElementById(
      'despFecharModal'
    );

  const cancelarModal =
    document.getElementById(
      'despCancelarModal'
    );

  const salvar =
    document.getElementById(
      'despSalvar'
    );

  const fecharDetalhes =
    document.getElementById(
      'despFecharDetalhes'
    );

  const editar =
    document.getElementById(
      'despEditar'
    );

  const pagar =
    document.getElementById(
      'despPagar'
    );

  const cancelar =
    document.getElementById(
      'despCancelar'
    );

  const reabrir =
    document.getElementById(
      'despReabrir'
    );


  if (nova) {

    nova.onclick =
      abrirNovaDespesaVnnus;

  }


  if (atualizar) {

    atualizar.onclick =
      carregarDespesasVnnus;

  }


  if (busca) {

    busca.oninput =
      renderDespesasVnnus;

  }


  if (filtroStatus) {

    filtroStatus.onchange =
      renderDespesasVnnus;

  }


  if (filtroCategoria) {

    filtroCategoria.onchange =
      renderDespesasVnnus;

  }


  if (fecharModal) {

    fecharModal.onclick =
      fecharModalDespesaVnnus;

  }


  if (cancelarModal) {

    cancelarModal.onclick =
      fecharModalDespesaVnnus;

  }


  if (salvar) {

    salvar.onclick =
      salvarDespesaFrontVnnus;

  }


  if (fecharDetalhes) {

    fecharDetalhes.onclick =
      fecharDetalhesDespesaVnnus;

  }


  if (editar) {

    editar.onclick =
      editarDespesaSelecionadaVnnus;

  }


  if (pagar) {

    pagar.onclick =
      pagarDespesaSelecionadaVnnus;

  }


  if (cancelar) {

    cancelar.onclick =
      cancelarDespesaSelecionadaVnnus;

  }


  if (reabrir) {

    reabrir.onclick =
      reabrirDespesaSelecionadaVnnus;

  }

}


/* =====================================================
   CARREGAR DESPESAS
===================================================== */

async function carregarDespesasVnnus() {

  definirStatusDespesasVnnus(
    'Carregando despesas...'
  );


  try {

    despesasVnnus =
      await VNNUS_API
        .despesas();


    despesasVnnus =
      Array.isArray(
        despesasVnnus
      )
        ? despesasVnnus
        : [];


    await carregarResumoDespesasVnnus();


    renderDespesasVnnus();


    definirStatusDespesasVnnus(
      despesasVnnus.length +
      ' despesa(s) carregada(s).'
    );

  }

  catch (erro) {

    console.error(
      'Despesas:',
      erro
    );


    definirStatusDespesasVnnus(
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   RESUMO
===================================================== */

async function carregarResumoDespesasVnnus() {

  try {

    const resumo =
      await VNNUS_API
        .resumoDespesas(
          '',
          ''
        );


    definirTextoDespesasVnnus(
      'despTotal',
      moedaDespesasVnnus(
        resumo.total
      )
    );


    definirTextoDespesasVnnus(
      'despPago',
      moedaDespesasVnnus(
        resumo.pago
      )
    );


    definirTextoDespesasVnnus(
      'despPendente',
      moedaDespesasVnnus(
        resumo.pendente
      )
    );


    definirTextoDespesasVnnus(
      'despVencido',
      moedaDespesasVnnus(
        resumo.vencido
      )
    );

  }

  catch (erro) {

    console.warn(
      'Resumo despesas:',
      erro
    );

  }

}


/* =====================================================
   FILTRO
===================================================== */

function filtrarDespesasVnnus() {

  const busca =
    String(
      obterValorDespesasVnnus(
        'despBusca'
      ) ||
      ''
    )
    .trim()
    .toLowerCase();


  const status =
    String(
      obterValorDespesasVnnus(
        'despFiltroStatus'
      ) ||
      ''
    )
    .trim()
    .toUpperCase();


  const categoria =
    String(
      obterValorDespesasVnnus(
        'despFiltroCategoria'
      ) ||
      ''
    )
    .trim()
    .toUpperCase();


  return despesasVnnus
    .filter(
      function(item) {

        if (
          status &&
          String(
            item.STATUS ||
            ''
          )
          .toUpperCase() !==
          status
        ) {

          return false;

        }


        if (
          categoria &&
          String(
            item.CATEGORIA ||
            ''
          )
          .toUpperCase() !==
          categoria
        ) {

          return false;

        }


        if (busca) {

          const texto = [

            item.DESCRICAO,
            item.FORNECEDOR,
            item.CATEGORIA,
            item.ID_DESPESA

          ]
          .join(' ')
          .toLowerCase();


          if (
            !texto.includes(
              busca
            )
          ) {

            return false;

          }

        }


        return true;

      }
    );

}


/* =====================================================
   RENDER
===================================================== */

function renderDespesasVnnus() {

  const area =
    document.getElementById(
      'despLista'
    );


  if (!area) {
    return;
  }


  const filtradas =
    filtrarDespesasVnnus();


  definirTextoDespesasVnnus(
    'despQuantidade',
    filtradas.length +
    ' registro(s)'
  );


  if (
    !filtradas.length
  ) {

    area.innerHTML = `
      <div class="empty-state">
        Nenhuma despesa encontrada.
      </div>
    `;

    return;

  }


  area.innerHTML =
    filtradas
      .map(
        function(item) {

          return montarCardDespesaVnnus(
            item
          );

        }
      )
      .join('');

}


/* =====================================================
   CARD
===================================================== */

function montarCardDespesaVnnus(
  item
) {

  const status =
    String(
      item.STATUS ||
      'PENDENTE'
    )
    .toUpperCase();


  let classeStatus =
    'status-badge';


  if (
    status ===
    'PAGA'
  ) {

    classeStatus +=
      ' status-ok';

  }

  else if (
    status ===
    'VENCIDA'
  ) {

    classeStatus +=
      ' status-danger';

  }


  return `
    <div
      class="card"
      style="
        margin-bottom:12px;
        cursor:pointer;
      "
      onclick="abrirDetalhesDespesaVnnus('${escaparAtributoDespesaVnnus(
        item.ID_DESPESA
      )}')">

      <div
        style="
          display:flex;
          justify-content:space-between;
          gap:14px;
          align-items:flex-start;
        ">

        <div style="min-width:0;">

          <div
            style="
              color:var(--gold2);
              font-size:11px;
              letter-spacing:.08em;
            ">
            ${escaparHtmlDespesaVnnus(
              item.ID_DESPESA ||
              ''
            )}
          </div>

          <div
            style="
              font-weight:800;
              margin-top:5px;
              font-size:15px;
            ">
            ${escaparHtmlDespesaVnnus(
              item.DESCRICAO ||
              '-'
            )}
          </div>

          <div
            style="
              color:var(--muted);
              font-size:12px;
              margin-top:5px;
            ">

            ${escaparHtmlDespesaVnnus(
              item.CATEGORIA ||
              ''
            )}

            ${
              item.FORNECEDOR
                ? ' • ' +
                  escaparHtmlDespesaVnnus(
                    item.FORNECEDOR
                  )
                : ''
            }

          </div>

        </div>


        <div
          style="
            text-align:right;
            flex-shrink:0;
          ">

          <div
            style="
              color:var(--gold2);
              font-weight:800;
              font-size:16px;
            ">
            ${moedaDespesasVnnus(
              item.VALOR
            )}
          </div>

          <div
            class="${classeStatus}"
            style="margin-top:7px;">
            ${escaparHtmlDespesaVnnus(
              status
            )}
          </div>

        </div>

      </div>


      <div
        style="
          margin-top:13px;
          padding-top:12px;
          border-top:1px solid rgba(212,168,77,.10);
          display:flex;
          justify-content:space-between;
          gap:10px;
          color:var(--muted);
          font-size:11px;
        ">

        <span>
          Vencimento:
          ${escaparHtmlDespesaVnnus(
            item.VENCIMENTO ||
            '-'
          )}
        </span>

        <span>
          ${item.RECORRENTE === 'SIM'
            ? '🔁 Recorrente'
            : ''
          }
        </span>

      </div>

    </div>
  `;

}


/* =====================================================
   NOVA DESPESA
===================================================== */

function abrirNovaDespesaVnnus() {

  limparFormularioDespesaVnnus();


  definirTextoDespesasVnnus(
    'despModalTitulo',
    '💳 Nova Despesa'
  );


  const modal =
    document.getElementById(
      'modalDespesa'
    );


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


/* =====================================================
   EDITAR
===================================================== */

function editarDespesaSelecionadaVnnus() {

  if (
    !despesaSelecionadaVnnus
  ) {

    return;

  }


  const item =
    despesaSelecionadaVnnus;


  definirValorDespesasVnnus(
    'despId',
    item.ID_DESPESA
  );

  definirValorDespesasVnnus(
    'despDescricao',
    item.DESCRICAO
  );

  definirValorDespesasVnnus(
    'despCategoria',
    item.CATEGORIA
  );

  definirValorDespesasVnnus(
    'despValor',
    Number(
      item.VALOR ||
      0
    )
  );

  definirValorDespesasVnnus(
    'despVencimento',
    converterDataInputDespesaVnnus(
      item.VENCIMENTO
    )
  );

  definirValorDespesasVnnus(
    'despFornecedor',
    item.FORNECEDOR
  );

  definirValorDespesasVnnus(
    'despFormaPagamento',
    item.FORMA_PAGAMENTO
  );

  definirValorDespesasVnnus(
    'despRecorrente',
    item.RECORRENTE ||
    'NAO'
  );

  definirValorDespesasVnnus(
    'despObservacao',
    item.OBSERVACAO
  );


  definirTextoDespesasVnnus(
    'despModalTitulo',
    '✏️ Editar Despesa'
  );


  fecharDetalhesDespesaVnnus();


  const modal =
    document.getElementById(
      'modalDespesa'
    );


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


/* =====================================================
   SALVAR
===================================================== */

async function salvarDespesaFrontVnnus() {

  const mensagem =
    document.getElementById(
      'despMensagemModal'
    );


  const botao =
    document.getElementById(
      'despSalvar'
    );


  const dados = {

    ID_DESPESA:
      obterValorDespesasVnnus(
        'despId'
      ),

    DESCRICAO:
      obterValorDespesasVnnus(
        'despDescricao'
      )
      .trim(),

    CATEGORIA:
      obterValorDespesasVnnus(
        'despCategoria'
      ),

    VALOR:
      Number(
        obterValorDespesasVnnus(
          'despValor'
        ) ||
        0
      ),

    VENCIMENTO:
      obterValorDespesasVnnus(
        'despVencimento'
      ),

    FORNECEDOR:
      obterValorDespesasVnnus(
        'despFornecedor'
      )
      .trim(),

    FORMA_PAGAMENTO:
      obterValorDespesasVnnus(
        'despFormaPagamento'
      ),

    RECORRENTE:
      obterValorDespesasVnnus(
        'despRecorrente'
      ) ||
      'NAO',

    OBSERVACAO:
      obterValorDespesasVnnus(
        'despObservacao'
      )
      .trim()

  };


  if (
    !dados.DESCRICAO
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Informe a descrição.';

    }

    return;

  }


  if (
    !dados.VENCIMENTO
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Informe o vencimento.';

    }

    return;

  }


  if (
    !Number.isFinite(
      dados.VALOR
    ) ||
    dados.VALOR <= 0
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Informe um valor válido.';

    }

    return;

  }


  try {

    if (botao) {

      botao.disabled =
        true;

    }


    if (mensagem) {

      mensagem.textContent =
        'Salvando despesa...';

    }


    const resposta =
      await VNNUS_API
        .salvarDespesa(
          dados
        );


    if (mensagem) {

      mensagem.textContent =
        resposta.mensagem ||
        'Despesa salva.';

    }


    await carregarDespesasVnnus();


    fecharModalDespesaVnnus();

  }

  catch (erro) {

    console.error(
      'Salvar despesa:',
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
   DETALHES
===================================================== */

function abrirDetalhesDespesaVnnus(
  idDespesa
) {

  const item =
    despesasVnnus.find(
      function(despesa) {

        return (
          String(
            despesa.ID_DESPESA ||
            ''
          ) ===
          String(
            idDespesa ||
            ''
          )
        );

      }
    );


  if (!item) {
    return;
  }


  despesaSelecionadaVnnus =
    item;


  const area =
    document.getElementById(
      'despDetalhesConteudo'
    );


  if (area) {

    area.innerHTML =
      montarDetalhesDespesaVnnus(
        item
      );

  }


  atualizarAcoesDetalhesDespesaVnnus(
    item
  );


  const modal =
    document.getElementById(
      'modalDespesaDetalhes'
    );


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


/* =====================================================
   HTML DETALHES
===================================================== */

function montarDetalhesDespesaVnnus(
  item
) {

  return `
    <div class="card">

      <div
        style="
          color:var(--gold2);
          font-size:12px;
        ">
        ${escaparHtmlDespesaVnnus(
          item.ID_DESPESA
        )}
      </div>

      <h3
        style="
          margin-top:7px;
          font-size:20px;
        ">
        ${escaparHtmlDespesaVnnus(
          item.DESCRICAO
        )}
      </h3>

      <div
        style="
          color:var(--muted);
          margin-top:5px;
        ">
        ${escaparHtmlDespesaVnnus(
          item.CATEGORIA
        )}
      </div>


      <div
        style="
          margin-top:20px;
          font-size:28px;
          font-weight:900;
          color:var(--gold2);
        ">
        ${moedaDespesasVnnus(
          item.VALOR
        )}
      </div>


      <div
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
          margin-top:20px;
        ">

        <div>
          <div class="card-label">
            Vencimento
          </div>
          <strong>
            ${escaparHtmlDespesaVnnus(
              item.VENCIMENTO ||
              '-'
            )}
          </strong>
        </div>

        <div>
          <div class="card-label">
            Status
          </div>
          <strong>
            ${escaparHtmlDespesaVnnus(
              item.STATUS
            )}
          </strong>
        </div>

        <div>
          <div class="card-label">
            Fornecedor
          </div>
          <strong>
            ${escaparHtmlDespesaVnnus(
              item.FORNECEDOR ||
              '-'
            )}
          </strong>
        </div>

        <div>
          <div class="card-label">
            Pagamento
          </div>
          <strong>
            ${escaparHtmlDespesaVnnus(
              item.FORMA_PAGAMENTO ||
              '-'
            )}
          </strong>
        </div>

      </div>


      ${
        item.PAGAMENTO
          ? `
            <div
              style="
                margin-top:18px;
                color:var(--muted);
                font-size:12px;
              ">
              Pago em:
              ${escaparHtmlDespesaVnnus(
                item.PAGAMENTO
              )}
            </div>
          `
          : ''
      }


      ${
        item.OBSERVACAO
          ? `
            <div
              style="
                margin-top:18px;
                border-top:1px solid rgba(212,168,77,.12);
                padding-top:14px;
              ">

              <div class="card-label">
                Observação
              </div>

              <div style="margin-top:5px;">
                ${escaparHtmlDespesaVnnus(
                  item.OBSERVACAO
                )}
              </div>

            </div>
          `
          : ''
      }

    </div>
  `;

}


/* =====================================================
   AÇÕES DETALHES
===================================================== */

function atualizarAcoesDetalhesDespesaVnnus(
  item
) {

  const pagar =
    document.getElementById(
      'despPagar'
    );

  const cancelar =
    document.getElementById(
      'despCancelar'
    );

  const editar =
    document.getElementById(
      'despEditar'
    );

  const reabrir =
    document.getElementById(
      'despReabrir'
    );


  const status =
    String(
      item.STATUS ||
      ''
    )
    .toUpperCase();


  if (pagar) {

    pagar.style.display =
      (
        status === 'PENDENTE' ||
        status === 'VENCIDA'
      )
        ? ''
        : 'none';

  }


  if (cancelar) {

    cancelar.style.display =
      (
        status === 'PENDENTE' ||
        status === 'VENCIDA'
      )
        ? ''
        : 'none';

  }


  if (editar) {

    editar.style.display =
      status === 'PAGA'
        ? 'none'
        : '';

  }


  if (reabrir) {

    reabrir.style.display =
      (
        status === 'PAGA' ||
        status === 'CANCELADA'
      )
        ? ''
        : 'none';

  }

}


/* =====================================================
   PAGAR
===================================================== */

async function pagarDespesaSelecionadaVnnus() {

  if (
    !despesaSelecionadaVnnus
  ) {

    return;

  }


  const forma =
    prompt(
      'Forma de pagamento:',
      despesaSelecionadaVnnus
        .FORMA_PAGAMENTO ||
      'PIX'
    );


  if (
    forma === null
  ) {

    return;

  }


  try {

    definirMensagemDetalhesDespesaVnnus(
      'Atualizando...'
    );


    await VNNUS_API
      .pagarDespesa(
        despesaSelecionadaVnnus
          .ID_DESPESA,
        forma
      );


    fecharDetalhesDespesaVnnus();


    await carregarDespesasVnnus();

  }

  catch (erro) {

    definirMensagemDetalhesDespesaVnnus(
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   CANCELAR
===================================================== */

async function cancelarDespesaSelecionadaVnnus() {

  if (
    !despesaSelecionadaVnnus
  ) {

    return;

  }


  if (
    !confirm(
      'Cancelar esta despesa?'
    )
  ) {

    return;

  }


  try {

    definirMensagemDetalhesDespesaVnnus(
      'Cancelando...'
    );


    await VNNUS_API
      .cancelarDespesa(
        despesaSelecionadaVnnus
          .ID_DESPESA
      );


    fecharDetalhesDespesaVnnus();


    await carregarDespesasVnnus();

  }

  catch (erro) {

    definirMensagemDetalhesDespesaVnnus(
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   REABRIR
===================================================== */

async function reabrirDespesaSelecionadaVnnus() {

  if (
    !despesaSelecionadaVnnus
  ) {

    return;

  }


  try {

    definirMensagemDetalhesDespesaVnnus(
      'Reabrindo...'
    );


    await VNNUS_API
      .reabrirDespesa(
        despesaSelecionadaVnnus
          .ID_DESPESA
      );


    fecharDetalhesDespesaVnnus();


    await carregarDespesasVnnus();

  }

  catch (erro) {

    definirMensagemDetalhesDespesaVnnus(
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   FECHAR MODAIS
===================================================== */

function fecharModalDespesaVnnus() {

  const modal =
    document.getElementById(
      'modalDespesa'
    );


  if (modal) {

    modal.classList.remove(
      'aberto'
    );

  }

}


function fecharDetalhesDespesaVnnus() {

  const modal =
    document.getElementById(
      'modalDespesaDetalhes'
    );


  if (modal) {

    modal.classList.remove(
      'aberto'
    );

  }


  despesaSelecionadaVnnus =
    null;

}


/* =====================================================
   LIMPAR FORM
===================================================== */

function limparFormularioDespesaVnnus() {

  definirValorDespesasVnnus(
    'despId',
    ''
  );

  definirValorDespesasVnnus(
    'despDescricao',
    ''
  );

  definirValorDespesasVnnus(
    'despCategoria',
    'OUTROS'
  );

  definirValorDespesasVnnus(
    'despValor',
    ''
  );

  definirValorDespesasVnnus(
    'despVencimento',
    ''
  );

  definirValorDespesasVnnus(
    'despFornecedor',
    ''
  );

  definirValorDespesasVnnus(
    'despFormaPagamento',
    ''
  );

  definirValorDespesasVnnus(
    'despRecorrente',
    'NAO'
  );

  definirValorDespesasVnnus(
    'despObservacao',
    ''
  );


  definirTextoDespesasVnnus(
    'despMensagemModal',
    ''
  );

}


/* =====================================================
   UTILITÁRIOS
===================================================== */

function moedaDespesasVnnus(
  valor
) {

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

}


function obterValorDespesasVnnus(
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


function definirValorDespesasVnnus(
  id,
  valor
) {

  const elemento =
    document.getElementById(
      id
    );


  if (elemento) {

    elemento.value =
      valor == null
        ? ''
        : valor;

  }

}


function definirTextoDespesasVnnus(
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


function definirStatusDespesasVnnus(
  texto
) {

  definirTextoDespesasVnnus(
    'despStatus',
    texto
  );

}


function definirMensagemDetalhesDespesaVnnus(
  texto
) {

  definirTextoDespesasVnnus(
    'despMensagemDetalhes',
    texto
  );

}


/* =====================================================
   DATA PARA INPUT
===================================================== */

function converterDataInputDespesaVnnus(
  valor
) {

  const texto =
    String(
      valor ||
      ''
    )
    .trim();


  const match =
    texto.match(
      /^(\d{2})\/(\d{2})\/(\d{4})/
    );


  if (!match) {

    return '';

  }


  return (
    match[3] +
    '-' +
    match[2] +
    '-' +
    match[1]
  );

}


/* =====================================================
   SEGURANÇA
===================================================== */

function escaparHtmlDespesaVnnus(
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


function escaparAtributoDespesaVnnus(
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

}


/* =====================================================
   EXPORTAR PARA ONCLICK
===================================================== */

window.abrirDetalhesDespesaVnnus =
  abrirDetalhesDespesaVnnus;


/* =====================================================
   FIM
   VNNUS DESPESAS 1.0
===================================================== */
