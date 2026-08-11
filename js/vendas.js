/* =====================================================
   VNNUS ERP 3.3.3
   HISTÓRICO DE VENDAS
   DETALHE SEM MODAL
===================================================== */

let vendasHistorico33 = [];
let vendaDetalhada33 = null;


window.init_vendas =
  async function() {

    const atualizar =
      document.getElementById(
        'vendasAtualizar'
      );

    const busca =
      document.getElementById(
        'vendasBusca'
      );

    const status =
      document.getElementById(
        'vendasStatus'
      );

    const voltar =
      document.getElementById(
        'vendaVoltarHistorico'
      );

    const compartilhar =
      document.getElementById(
        'vendaCompartilhar'
      );


    if (atualizar) {
      atualizar.onclick =
        carregarHistoricoVendas33;
    }


    if (busca) {
      busca.oninput =
        aplicarFiltroVendas33;
    }


    if (status) {
      status.onchange =
        aplicarFiltroVendas33;
    }


    if (voltar) {
      voltar.onclick =
        voltarHistoricoVendas33;
    }


    if (compartilhar) {
      compartilhar.onclick =
        compartilharVenda33;
    }


    await carregarHistoricoVendas33();


    /*
      Se a URL tiver ?venda=VEN0000007
      abre o detalhe automaticamente.
      Isso evita depender do clique JS
      do botão Ver no celular.
    */
    const params =
      new URLSearchParams(
        window.location.search
      );


    const idVenda =
      String(
        params.get('venda') ||
        ''
      )
      .trim();


    if (idVenda) {

      await mostrarDetalheVenda33(
        idVenda
      );

    }

  };


async function carregarHistoricoVendas33() {

  const mensagem =
    document.getElementById(
      'vendasMensagem'
    );


  if (mensagem) {
    mensagem.textContent =
      'Carregando vendas...';
  }


  try {

    vendasHistorico33 =
      await VNNUS_API
        .historicoVendas();


    if (mensagem) {
      mensagem.textContent =
        vendasHistorico33.length +
        ' venda(s) carregada(s).';
    }


    aplicarFiltroVendas33();

  }

  catch (erro) {

    console.error(
      'Histórico de vendas:',
      erro
    );


    if (mensagem) {
      mensagem.textContent =
        'Erro: ' +
        erro.message;
    }


    const tabela =
      document.getElementById(
        'vendasTabela'
      );


    if (tabela) {
      tabela.innerHTML = `
        <tr>
          <td colspan="7">
            Não foi possível carregar o histórico.
          </td>
        </tr>
      `;
    }

  }

}


function aplicarFiltroVendas33() {

  const busca =
    document.getElementById(
      'vendasBusca'
    );


  const status =
    document.getElementById(
      'vendasStatus'
    );


  const termo =
    String(
      busca
        ? busca.value
        : ''
    )
    .trim()
    .toLowerCase();


  const statusSelecionado =
    String(
      status
        ? status.value
        : ''
    )
    .trim()
    .toUpperCase();


  const filtradas =
    vendasHistorico33.filter(
      function(venda) {

        const texto =
          [
            venda.ID_VENDA,
            venda.CLIENTE,
            venda.FORMA_PAGAMENTO,
            venda.DATA,
            venda.HORA
          ]
          .join(' ')
          .toLowerCase();


        const bateBusca =
          !termo ||
          texto.includes(
            termo
          );


        const statusVenda =
          String(
            venda.STATUS ||
            ''
          )
          .trim()
          .toUpperCase();


        const bateStatus =
          !statusSelecionado ||
          statusVenda ===
          statusSelecionado;


        return (
          bateBusca &&
          bateStatus
        );

      }
    );


  renderHistoricoVendas33(
    filtradas
  );

}


function renderHistoricoVendas33(
  vendas
) {

  const tabela =
    document.getElementById(
      'vendasTabela'
    );


  const qtd =
    document.getElementById(
      'vendasQtd'
    );


  const total =
    document.getElementById(
      'vendasTotal'
    );


  if (!tabela) {
    return;
  }


  if (qtd) {
    qtd.textContent =
      vendas.length;
  }


  const valorFinalizado =
    vendas.reduce(
      function(soma, venda) {

        const status =
          String(
            venda.STATUS ||
            ''
          )
          .trim()
          .toUpperCase();


        if (
          status !==
          'FINALIZADA'
        ) {
          return soma;
        }


        return (
          soma +
          Number(
            venda.TOTAL ||
            0
          )
        );

      },
      0
    );


  if (total) {
    total.textContent =
      moedaVendas33(
        valorFinalizado
      );
  }


  if (!vendas.length) {

    tabela.innerHTML = `
      <tr>
        <td colspan="7">
          Nenhuma venda encontrada.
        </td>
      </tr>
    `;

    return;

  }


  const base =
    window.location.origin +
    window.location.pathname;


  tabela.innerHTML =
    vendas.map(
      function(venda) {

        const status =
          String(
            venda.STATUS ||
            ''
          )
          .trim()
          .toUpperCase();


        const statusHtml =
          status ===
          'FINALIZADA'
            ? `
              <span class="status-badge status-ok">
                FINALIZADA
              </span>
            `
            : `
              <span class="status-badge status-danger">
                ${escaparVendas33(status || '-')}
              </span>
            `;


        const urlDetalhe =
          base +
          '?venda=' +
          encodeURIComponent(
            venda.ID_VENDA
          ) +
          '#vendas';


        return `
          <tr>

            <td>
              <strong>
                ${escaparVendas33(venda.ID_VENDA)}
              </strong>
            </td>

            <td>
              ${escaparVendas33(venda.DATA)}

              <div
                style="
                  color:var(--muted);
                  font-size:12px;
                ">
                ${escaparVendas33(venda.HORA)}
              </div>
            </td>

            <td>
              ${escaparVendas33(venda.CLIENTE)}
            </td>

            <td>
              ${escaparVendas33(venda.FORMA_PAGAMENTO)}
            </td>

            <td>
              <strong>
                ${moedaVendas33(venda.TOTAL)}
              </strong>
            </td>

            <td>
              ${statusHtml}
            </td>

            <td>

              <!--
                LINK REAL.
                Não depende de onclick.
                O navegador abre a própria URL.
              -->
              <a
                class="btn-secondary"
                href="${urlDetalhe}"
                style="
                  display:inline-block;
                  text-decoration:none;
                ">
                👁️ Ver
              </a>

            </td>

          </tr>
        `;

      }
    )
    .join('');

}


async function mostrarDetalheVenda33(
  idVenda
) {

  const detalheArea =
    document.getElementById(
      'vendaDetalheArea'
    );


  const listaArea =
    document.getElementById(
      'vendasListaArea'
    );


  const conteudo =
    document.getElementById(
      'vendaDetalheConteudo'
    );


  const subtitulo =
    document.getElementById(
      'vendaDetalheSubtitulo'
    );


  if (
    !detalheArea ||
    !conteudo
  ) {

    alert(
      'Área de detalhes da venda não encontrada.'
    );

    return;

  }


  if (listaArea) {
    listaArea.style.display =
      'none';
  }


  detalheArea.style.display =
    'block';


  if (subtitulo) {
    subtitulo.textContent =
      idVenda;
  }


  conteudo.innerHTML = `
    <div class="empty-state">
      Carregando detalhes...
    </div>
  `;


  window.scrollTo(
    0,
    0
  );


  try {

    vendaDetalhada33 =
      await VNNUS_API
        .detalhesVenda(
          idVenda
        );


    conteudo.innerHTML =
      montarDetalheVenda33(
        vendaDetalhada33
      );

  }

  catch (erro) {

    console.error(
      'Detalhes da venda:',
      erro
    );


    conteudo.innerHTML = `
      <div class="empty-state">
        <strong>
          Erro ao abrir a venda.
        </strong>

        <p style="margin-top:8px;">
          ${escaparVendas33(erro.message)}
        </p>
      </div>
    `;

  }

}


function voltarHistoricoVendas33() {

  const url =
    window.location.origin +
    window.location.pathname +
    '#vendas';


  window.location.href =
    url;

}


function montarDetalheVenda33(
  dados
) {

  const venda =
    dados &&
    dados.venda
      ? dados.venda
      : {};


  const itens =
    dados &&
    Array.isArray(
      dados.itens
    )
      ? dados.itens
      : [];


  const itensHtml =
    itens.map(
      function(item) {

        return `
          <div
            style="
              padding:11px 0;
              border-bottom:1px solid var(--border);
            ">

            <strong>
              ${escaparVendas33(item.PRODUTO)}
            </strong>

            <div
              style="
                color:var(--muted);
                font-size:13px;
                margin-top:4px;
              ">

              ${Number(item.QUANTIDADE || 0)}
              x
              ${moedaVendas33(item.VALOR_UNITARIO)}
              •
              ${moedaVendas33(item.TOTAL)}

            </div>

          </div>
        `;

      }
    )
    .join('');


  return `
    <div
      style="
        text-align:center;
        margin-bottom:18px;
      ">

      <div
        style="
          font-size:26px;
          font-weight:900;
        ">
        VNNUS
      </div>

      <div
        style="
          color:var(--muted);
          font-size:12px;
        ">
        COMPROVANTE DE VENDA
      </div>

    </div>


    <div>
      <strong>Venda:</strong>
      ${escaparVendas33(venda.ID_VENDA)}
    </div>

    <div>
      <strong>Data:</strong>
      ${escaparVendas33(venda.DATA)}
      ${escaparVendas33(venda.HORA)}
    </div>

    <div>
      <strong>Cliente:</strong>
      ${escaparVendas33(venda.CLIENTE)}
    </div>

    <div>
      <strong>Pagamento:</strong>
      ${escaparVendas33(venda.FORMA_PAGAMENTO)}
    </div>

    <div>
      <strong>Status:</strong>
      ${escaparVendas33(venda.STATUS)}
    </div>


    <div
      style="
        margin-top:15px;
        border-top:1px solid var(--border);
      ">
      ${itensHtml}
    </div>


    <div
      style="
        margin-top:15px;
      ">

      <div>
        <strong>Subtotal:</strong>
        ${moedaVendas33(venda.SUBTOTAL)}
      </div>

      <div>
        <strong>Desconto:</strong>
        ${moedaVendas33(venda.DESCONTO)}
      </div>

      <div
        style="
          font-size:22px;
          margin-top:7px;
        ">
        <strong>
          Total:
          ${moedaVendas33(venda.TOTAL)}
        </strong>
      </div>

    </div>


    ${
      venda.OBSERVACAO
        ? `
          <div style="margin-top:15px;">
            <strong>Observação:</strong>
            ${escaparVendas33(venda.OBSERVACAO)}
          </div>
        `
        : ''
    }
  `;

}


async function compartilharVenda33() {

  if (
    !vendaDetalhada33 ||
    !vendaDetalhada33.venda
  ) {

    alert(
      'Nenhum comprovante aberto.'
    );

    return;

  }


  const texto =
    montarTextoVenda33(
      vendaDetalhada33
    );


  try {

    if (
      navigator.share
    ) {

      await navigator.share({
        title:
          'Comprovante ' +
          (
            vendaDetalhada33
              .venda
              .ID_VENDA ||
            'VNNUS'
          ),
        text:
          texto
      });

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


      alert(
        'Comprovante copiado. Agora você pode colar no WhatsApp.'
      );

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


    alert(
      'Não foi possível compartilhar: ' +
      erro.message
    );

  }

}


function montarTextoVenda33(
  dados
) {

  const venda =
    dados.venda ||
    {};


  const itens =
    dados.itens ||
    [];


  const linhas = [

    'VNNUS',

    'COMPROVANTE DE VENDA',

    '',

    'Venda: ' +
      (
        venda.ID_VENDA ||
        ''
      ),

    'Data: ' +
      (
        venda.DATA ||
        ''
      ) +
      ' ' +
      (
        venda.HORA ||
        ''
      ),

    'Cliente: ' +
      (
        venda.CLIENTE ||
        'Consumidor Final'
      ),

    'Pagamento: ' +
      (
        venda.FORMA_PAGAMENTO ||
        ''
      ),

    'Status: ' +
      (
        venda.STATUS ||
        ''
      ),

    '',

    'ITENS'

  ];


  itens.forEach(
    function(item) {

      linhas.push(

        Number(
          item.QUANTIDADE ||
          0
        ) +
        'x ' +
        (
          item.PRODUTO ||
          ''
        ) +
        ' - ' +
        moedaVendas33(
          item.TOTAL
        )

      );

    }
  );


  linhas.push(

    '',

    'Subtotal: ' +
      moedaVendas33(
        venda.SUBTOTAL
      ),

    'Desconto: ' +
      moedaVendas33(
        venda.DESCONTO
      ),

    'TOTAL: ' +
      moedaVendas33(
        venda.TOTAL
      )

  );


  if (
    venda.OBSERVACAO
  ) {

    linhas.push(
      'Observação: ' +
      venda.OBSERVACAO
    );

  }


  return linhas.join(
    '\n'
  );

}


function moedaVendas33(
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


function escaparVendas33(
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
