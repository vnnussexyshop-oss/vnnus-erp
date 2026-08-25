/* =====================================================
   VNNUS ERP 3.6
   CLIENTES + HISTÓRICO DE COMPRAS
===================================================== */

let clientesCarregadosERP = [];


/* =====================================================
   INICIALIZAÇÃO CORRETA PARA O ROUTER
===================================================== */

window.init_clientes =
  async function() {

    configurarEventosClientesERP();

    await carregarClientesERP();

  };


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventosClientesERP() {

  const btnNovo =
    document.getElementById(
      'btnNovoCliente'
    );


  const btnAtualizar =
    document.getElementById(
      'btnAtualizarClientes'
    );


  const pesquisa =
    document.getElementById(
      'pesquisaClientes'
    );


  const btnFechar =
    document.getElementById(
      'btnFecharCliente'
    );


  const btnCancelar =
    document.getElementById(
      'btnCancelarCliente'
    );


  const btnSalvar =
    document.getElementById(
      'btnSalvarCliente'
    );


  const btnBuscarCep =
    document.getElementById(
      'btnBuscarCepCliente'
    );


  const campoCep =
    document.getElementById(
      'clienteCep'
    );


  const campoCpf =
    document.getElementById(
      'clienteCpf'
    );


  const btnFecharHistorico =
    document.getElementById(
      'btnFecharHistoricoCliente'
    );


  const btnFecharHistoricoRodape =
    document.getElementById(
      'btnFecharHistoricoClienteRodape'
    );


  const btnFecharDetalhes =
    document.getElementById(
      'btnFecharDetalhesCompraCliente'
    );


  if (btnNovo) {

    btnNovo.onclick =
      abrirNovoClienteERP;

  }


  if (btnAtualizar) {

    btnAtualizar.onclick =
      carregarClientesERP;

  }


  if (pesquisa) {

    pesquisa.oninput =
      filtrarClientesERP;

  }


  if (btnFechar) {

    btnFechar.onclick =
      fecharModalClienteERP;

  }


  if (btnCancelar) {

    btnCancelar.onclick =
      fecharModalClienteERP;

  }


  if (btnSalvar) {

    btnSalvar.onclick =
      salvarClienteERP;

  }


  if (btnBuscarCep) {

    btnBuscarCep.onclick =
      buscarCepClienteERP;

  }


  if (btnFecharHistorico) {

    btnFecharHistorico.onclick =
      fecharHistoricoClienteERP;

  }


  if (btnFecharHistoricoRodape) {

    btnFecharHistoricoRodape.onclick =
      fecharHistoricoClienteERP;

  }


  if (btnFecharDetalhes) {

    btnFecharDetalhes.onclick =
      fecharDetalhesCompraClienteERP;

  }


  if (campoCep) {

    campoCep.oninput =
      function() {

        campoCep.value =
          formatarCepVisualClienteERP(
            campoCep.value
          );

      };


    campoCep.onblur =
      function() {

        const cep =
          somenteNumerosClienteERP(
            campoCep.value
          );


        if (
          cep.length === 8
        ) {

          buscarCepClienteERP();

        }

      };

  }


  if (campoCpf) {

    campoCpf.oninput =
      function() {

        campoCpf.value =
          formatarCpfVisualClienteERP(
            campoCpf.value
          );

      };

  }

}


/* =====================================================
   CARREGAR CLIENTES
===================================================== */

async function carregarClientesERP() {

  const tbody =
    document.getElementById(
      'listaClientes'
    );


  const status =
    document.getElementById(
      'statusClientes'
    );


  if (!tbody) {
    return;
  }


  tbody.innerHTML = `
    <tr>
      <td colspan="7">
        Carregando clientes...
      </td>
    </tr>
  `;


  if (status) {

    status.textContent =
      'Carregando clientes...';

  }


  try {

    const clientes =
      await VNNUS_API
        .clientes();


    clientesCarregadosERP =
      Array.isArray(
        clientes
      )
        ? clientes
        : [];


    renderizarClientesERP(
      clientesCarregadosERP
    );


    atualizarResumoClientesERP();


    if (status) {

      status.textContent =
        clientesCarregadosERP.length +
        ' cliente(s) carregado(s).';

    }

  }

  catch (erro) {

    console.error(
      'Erro ao carregar clientes:',
      erro
    );


    clientesCarregadosERP = [];


    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          Erro ao carregar clientes:
          ${escaparHtmlClienteERP(
            erro.message
          )}
        </td>
      </tr>
    `;


    if (status) {

      status.textContent =
        'Erro: ' +
        erro.message;

    }

  }

}


/* =====================================================
   RENDERIZAR CLIENTES
===================================================== */

function renderizarClientesERP(
  clientes
) {

  const tbody =
    document.getElementById(
      'listaClientes'
    );


  if (!tbody) {
    return;
  }


  if (!clientes.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          Nenhum cliente cadastrado.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    clientes.map(
      function(cliente) {

        const cidadeUf =
          [
            cliente.CIDADE || '',
            cliente.UF || ''
          ]
          .filter(Boolean)
          .join(' / ');


        const ativo =
          String(
            cliente.ATIVO || 'SIM'
          )
          .trim()
          .toUpperCase();


        return `
          <tr>

            <td>
              ${escaparHtmlClienteERP(
                cliente.ID_CLIENTE
              )}
            </td>

            <td>
              <strong>
                ${escaparHtmlClienteERP(
                  cliente.NOME
                )}
              </strong>
            </td>

            <td>
              ${escaparHtmlClienteERP(
                formatarTelefoneVisualClienteERP(
                  cliente.WHATSAPP
                )
              )}
            </td>

            <td>
              ${escaparHtmlClienteERP(
                formatarTelefoneVisualClienteERP(
                  cliente.TELEFONE
                )
              )}
            </td>

            <td>
              ${escaparHtmlClienteERP(
                cidadeUf || '-'
              )}
            </td>

            <td>

              <span
                class="status-badge ${
                  ativo === 'SIM'
                    ? 'status-ok'
                    : 'status-danger'
                }">

                ${
                  ativo === 'SIM'
                    ? 'ATIVO'
                    : 'INATIVO'
                }

              </span>

            </td>

            <td>

              <button
                class="btn-secondary"
                onclick="abrirHistoricoClienteERP('${escaparAtributoClienteERP(
                  cliente.ID_CLIENTE
                )}')">
                Compras
              </button>

              <button
                class="btn-secondary"
                onclick="editarClienteERP('${escaparAtributoClienteERP(
                  cliente.ID_CLIENTE
                )}')">
                Editar
              </button>

            </td>

          </tr>
        `;

      }
    )
    .join('');

}


/* =====================================================
   RESUMO DOS CLIENTES
===================================================== */

function atualizarResumoClientesERP() {

  const total =
    clientesCarregadosERP.length;


  const ativos =
    clientesCarregadosERP.filter(
      function(cliente) {

        return (
          String(
            cliente.ATIVO || 'SIM'
          )
          .trim()
          .toUpperCase() ===
          'SIM'
        );

      }
    ).length;


  const whatsapp =
    clientesCarregadosERP.filter(
      function(cliente) {

        return (
          String(
            cliente.WHATSAPP || ''
          )
          .trim() !== ''
        );

      }
    ).length;


  definirTextoClienteERP(
    'totalClientes',
    total
  );


  definirTextoClienteERP(
    'totalClientesAtivos',
    ativos
  );


  definirTextoClienteERP(
    'totalClientesWhatsapp',
    whatsapp
  );

}/* =====================================================
   PESQUISA
===================================================== */

function filtrarClientesERP() {

  const campo =
    document.getElementById(
      'pesquisaClientes'
    );


  const termo =
    String(
      campo
        ? campo.value
        : ''
    )
    .trim()
    .toLowerCase();


  if (!termo) {

    renderizarClientesERP(
      clientesCarregadosERP
    );

    return;

  }


  const filtrados =
    clientesCarregadosERP.filter(
      function(cliente) {

        const texto =
          [
            cliente.ID_CLIENTE,
            cliente.NOME,
            cliente.TELEFONE,
            cliente.WHATSAPP,
            cliente.CPF,
            cliente.EMAIL,
            cliente.CIDADE,
            cliente.UF
          ]
          .join(' ')
          .toLowerCase();


        return texto.includes(
          termo
        );

      }
    );


  renderizarClientesERP(
    filtrados
  );

}


/* =====================================================
   NOVO CLIENTE
===================================================== */

function abrirNovoClienteERP() {

  limparFormularioClienteERP();


  definirTextoClienteERP(
    'tituloModalCliente',
    'Novo Cliente'
  );


  abrirModalClienteERP();

}


/* =====================================================
   EDITAR CLIENTE
===================================================== */

async function editarClienteERP(
  idCliente
) {

  limparFormularioClienteERP();


  definirTextoClienteERP(
    'tituloModalCliente',
    'Editar Cliente'
  );


  definirTextoClienteERP(
    'mensagemCliente',
    'Carregando cliente...'
  );


  abrirModalClienteERP();


  try {

    const resposta =
      await VNNUS_API
        .clientePorId(
          idCliente
        );


    const cliente =
      resposta &&
      resposta.cliente
        ? resposta.cliente
        : resposta;


    if (
      !cliente ||
      !cliente.ID_CLIENTE
    ) {

      throw new Error(
        'Cliente não encontrado.'
      );

    }


    preencherFormularioClienteERP(
      cliente
    );


    definirTextoClienteERP(
      'mensagemCliente',
      ''
    );

  }

  catch (erro) {

    console.error(
      'Erro ao carregar cliente:',
      erro
    );


    definirTextoClienteERP(
      'mensagemCliente',
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   PREENCHER FORMULÁRIO
===================================================== */

function preencherFormularioClienteERP(
  cliente
) {

  definirValorClienteERP(
    'clienteId',
    cliente.ID_CLIENTE
  );


  definirValorClienteERP(
    'clienteNome',
    cliente.NOME
  );


  definirValorClienteERP(
    'clienteTelefone',
    formatarTelefoneVisualClienteERP(
      cliente.TELEFONE
    )
  );


  definirValorClienteERP(
    'clienteWhatsapp',
    formatarTelefoneVisualClienteERP(
      cliente.WHATSAPP
    )
  );


  definirValorClienteERP(
    'clienteEmail',
    cliente.EMAIL
  );


  definirValorClienteERP(
    'clienteNascimento',
    normalizarDataInputClienteERP(
      cliente.DATA_NASCIMENTO
    )
  );


  definirValorClienteERP(
    'clienteCpf',
    formatarCpfVisualClienteERP(
      cliente.CPF
    )
  );


  definirValorClienteERP(
    'clienteCep',
    formatarCepVisualClienteERP(
      cliente.CEP
    )
  );


  definirValorClienteERP(
    'clienteEndereco',
    cliente.ENDERECO
  );


  definirValorClienteERP(
    'clienteNumero',
    cliente.NUMERO
  );


  definirValorClienteERP(
    'clienteComplemento',
    cliente.COMPLEMENTO
  );


  definirValorClienteERP(
    'clienteBairro',
    cliente.BAIRRO
  );


  definirValorClienteERP(
    'clienteCidade',
    cliente.CIDADE
  );


  definirValorClienteERP(
    'clienteUf',
    cliente.UF
  );


  definirValorClienteERP(
    'clienteAtivo',
    cliente.ATIVO || 'SIM'
  );


  definirValorClienteERP(
    'clienteObservacao',
    cliente.OBSERVACAO
  );

}


/* =====================================================
   SALVAR CLIENTE
===================================================== */

async function salvarClienteERP() {

  const botao =
    document.getElementById(
      'btnSalvarCliente'
    );


  const mensagem =
    document.getElementById(
      'mensagemCliente'
    );


  const dados = {

    ID_CLIENTE:
      obterValorClienteERP(
        'clienteId'
      ),

    NOME:
      obterValorClienteERP(
        'clienteNome'
      ).trim(),

    TELEFONE:
      obterValorClienteERP(
        'clienteTelefone'
      ).trim(),

    WHATSAPP:
      obterValorClienteERP(
        'clienteWhatsapp'
      ).trim(),

    EMAIL:
      obterValorClienteERP(
        'clienteEmail'
      ).trim(),

    DATA_NASCIMENTO:
      formatarDataPlanilhaClienteERP(
        obterValorClienteERP(
          'clienteNascimento'
        )
      ),

    CPF:
      obterValorClienteERP(
        'clienteCpf'
      ).trim(),

    CEP:
      obterValorClienteERP(
        'clienteCep'
      ).trim(),

    ENDERECO:
      obterValorClienteERP(
        'clienteEndereco'
      ).trim(),

    NUMERO:
      obterValorClienteERP(
        'clienteNumero'
      ).trim(),

    COMPLEMENTO:
      obterValorClienteERP(
        'clienteComplemento'
      ).trim(),

    BAIRRO:
      obterValorClienteERP(
        'clienteBairro'
      ).trim(),

    CIDADE:
      obterValorClienteERP(
        'clienteCidade'
      ).trim(),

    UF:
      obterValorClienteERP(
        'clienteUf'
      )
      .trim()
      .toUpperCase(),

    ATIVO:
      obterValorClienteERP(
        'clienteAtivo'
      ) || 'SIM',

    OBSERVACAO:
      obterValorClienteERP(
        'clienteObservacao'
      ).trim()

  };


  if (!dados.NOME) {

    if (mensagem) {

      mensagem.textContent =
        'Informe o nome do cliente.';

    }

    return;

  }


  if (botao) {

    botao.disabled = true;

  }


  if (mensagem) {

    mensagem.textContent =
      'Salvando cliente...';

  }


  try {

    const resposta =
      await VNNUS_API
        .salvarCliente(
          dados
        );


    if (mensagem) {

      mensagem.textContent =
        resposta.mensagem ||
        'Cliente salvo com sucesso.';

    }


    await carregarClientesERP();


    setTimeout(
      function() {

        fecharModalClienteERP();

      },
      700
    );

  }

  catch (erro) {

    console.error(
      'Erro ao salvar cliente:',
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

      botao.disabled = false;

    }

  }

}


/* =====================================================
   HISTÓRICO DE COMPRAS
===================================================== */

async function abrirHistoricoClienteERP(
  idCliente
) {

  const cliente =
    clientesCarregadosERP.find(
      function(item) {

        return (
          String(
            item.ID_CLIENTE || ''
          ) ===
          String(
            idCliente || ''
          )
        );

      }
    );


  definirTextoClienteERP(
    'tituloHistoricoCliente',
    cliente && cliente.NOME
      ? cliente.NOME
      : 'Histórico do Cliente'
  );


  definirTextoClienteERP(
    'subtituloHistoricoCliente',
    cliente
      ? (
          'Compras vinculadas ao cliente ' +
          cliente.ID_CLIENTE
        )
      : (
          'Compras vinculadas ao cadastro.'
        )
  );


  definirTextoClienteERP(
    'statusHistoricoCliente',
    'Carregando histórico...'
  );


  zerarResumoHistoricoClienteERP();


  const tbody =
    document.getElementById(
      'listaHistoricoCliente'
    );


  if (tbody) {

    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Carregando compras...
        </td>
      </tr>
    `;

  }


  fecharDetalhesCompraClienteERP();


  abrirModalHistoricoClienteERP();


  try {

    const resposta =
      await VNNUS_API
        .historicoCliente(
          idCliente
        );


    if (
      !resposta ||
      resposta.sucesso === false
    ) {

      throw new Error(
        resposta && resposta.erro
          ? resposta.erro
          : 'Não foi possível carregar o histórico.'
      );

    }


    const resumo =
      resposta.resumo ||
      {};


    const vendas =
      Array.isArray(
        resposta.vendas
      )
        ? resposta.vendas
        : [];


    renderizarResumoHistoricoClienteERP(
      resumo,
      vendas
    );


    renderizarHistoricoClienteERP(
      vendas
    );


    definirTextoClienteERP(
      'statusHistoricoCliente',
      vendas.length
        ? (
            vendas.length +
            ' venda(s) vinculada(s) ao cliente.'
          )
        : (
            'Este cliente ainda não possui compras.'
          )
    );

  }

  catch (erro) {

    console.error(
      'Erro ao carregar histórico do cliente:',
      erro
    );


    definirTextoClienteERP(
      'statusHistoricoCliente',
      'Erro: ' +
      erro.message
    );


    if (tbody) {

      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            Não foi possível carregar o histórico.
          </td>
        </tr>
      `;

    }

  }

}/* =====================================================
   ZERAR RESUMO DO HISTÓRICO
===================================================== */

function zerarResumoHistoricoClienteERP() {

  definirTextoClienteERP(
    'histTotalCompras',
    '0'
  );


  definirTextoClienteERP(
    'histTotalItens',
    '0'
  );


  definirTextoClienteERP(
    'histTotalGasto',
    'R$ 0,00'
  );


  definirTextoClienteERP(
    'histTicketMedio',
    'R$ 0,00'
  );


  definirTextoClienteERP(
    'histProdutoFavorito',
    '-'
  );


  definirTextoClienteERP(
    'histProdutoFavoritoQtd',
    ''
  );


  definirTextoClienteERP(
    'histPrimeiraCompra',
    '-'
  );


  definirTextoClienteERP(
    'histUltimaCompra',
    '-'
  );

}


/* =====================================================
   RENDERIZAR RESUMO DO HISTÓRICO
   API 1.7
===================================================== */

function renderizarResumoHistoricoClienteERP(
  resumo,
  vendas
) {

  resumo =
    resumo || {};


  vendas =
    Array.isArray(vendas)
      ? vendas
      : [];


  const totalCompras =
    Number(
      resumo.totalCompras || 0
    );


  const totalItens =
    Number(
      resumo.totalItens || 0
    );


  const totalGasto =
    Number(
      resumo.totalGasto || 0
    );


  const ticketMedio =
    Number(
      resumo.ticketMedio || 0
    );


  const produtoFavorito =
    resumo.produtoFavorito ||
    {};


  const nomeProdutoFavorito =
    produtoFavorito.produto ||
    produtoFavorito.PRODUTO ||
    '-';


  const quantidadeProdutoFavorito =
    Number(
      produtoFavorito.quantidade ||
      produtoFavorito.QUANTIDADE ||
      0
    );


  let primeiraCompra =
    resumo.primeiraCompra ||
    '-';


  let ultimaCompra =
    resumo.ultimaCompra ||
    '-';


  /*
     FALLBACK:
     caso a API não envie uma das datas,
     usamos as vendas retornadas.
  */

  if (
    primeiraCompra === '-' &&
    vendas.length
  ) {

    const vendaMaisAntiga =
      vendas[
        vendas.length - 1
      ];


    primeiraCompra =
      vendaMaisAntiga.DATA ||
      vendaMaisAntiga.DATA_HORA ||
      '-';

  }


  if (
    ultimaCompra === '-' &&
    vendas.length
  ) {

    const vendaMaisRecente =
      vendas[0];


    ultimaCompra =
      vendaMaisRecente.DATA ||
      vendaMaisRecente.DATA_HORA ||
      '-';

  }


  definirTextoClienteERP(
    'histTotalCompras',
    String(
      totalCompras
    )
  );


  definirTextoClienteERP(
    'histTotalItens',
    String(
      totalItens
    )
  );


  definirTextoClienteERP(
    'histTotalGasto',
    formatarMoedaClienteERP(
      totalGasto
    )
  );


  definirTextoClienteERP(
    'histTicketMedio',
    formatarMoedaClienteERP(
      ticketMedio
    )
  );


  definirTextoClienteERP(
    'histProdutoFavorito',
    String(
      nomeProdutoFavorito
    )
  );


  definirTextoClienteERP(
    'histProdutoFavoritoQtd',
    quantidadeProdutoFavorito > 0
      ? (
          quantidadeProdutoFavorito +
          (
            quantidadeProdutoFavorito === 1
              ? ' unidade comprada'
              : ' unidades compradas'
          )
        )
      : ''
  );


  definirTextoClienteERP(
    'histPrimeiraCompra',
    String(
      primeiraCompra || '-'
    )
  );


  definirTextoClienteERP(
    'histUltimaCompra',
    String(
      ultimaCompra || '-'
    )
  );

}


/* =====================================================
   RENDERIZAR HISTÓRICO DE VENDAS
===================================================== */

function renderizarHistoricoClienteERP(
  vendas
) {

  const tbody =
    document.getElementById(
      'listaHistoricoCliente'
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
          Nenhuma compra encontrada.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    vendas.map(
      function(venda) {

        const idVenda =
          venda.ID_VENDA ||
          venda.idVenda ||
          '';


        const data =
          venda.DATA ||
          venda.DATA_HORA ||
          '-';


        const pagamento =
          venda.FORMA_PAGAMENTO ||
          venda.PAGAMENTO ||
          '-';


        const total =
          Number(
            venda.TOTAL ||
            venda.VALOR_TOTAL ||
            0
          );


        const status =
          String(
            venda.STATUS ||
            ''
          )
          .trim()
          .toUpperCase();


        const classeStatus =
          status === 'FINALIZADA'
            ? 'status-ok'
            : (
                status === 'CANCELADA'
                  ? 'status-danger'
                  : ''
              );


        return `
          <tr>

            <td>
              <strong>
                ${escaparHtmlClienteERP(
                  idVenda
                )}
              </strong>
            </td>

            <td>
              ${escaparHtmlClienteERP(
                data
              )}
            </td>

            <td>
              ${escaparHtmlClienteERP(
                pagamento
              )}
            </td>

            <td>
              ${escaparHtmlClienteERP(
                formatarMoedaClienteERP(
                  total
                )
              )}
            </td>

            <td>

              <span
                class="status-badge ${classeStatus}">

                ${escaparHtmlClienteERP(
                  status || '-'
                )}

              </span>

            </td>

            <td>

              <button
                class="btn-secondary"
                onclick="abrirDetalhesCompraClienteERP('${escaparAtributoClienteERP(
                  idVenda
                )}')">

                Ver itens

              </button>

            </td>

          </tr>
        `;

      }
    )
    .join('');

}


/* =====================================================
   ABRIR DETALHES DA COMPRA
===================================================== */

async function abrirDetalhesCompraClienteERP(
  idVenda
) {

  const area =
    document.getElementById(
      'detalhesCompraCliente'
    );


  const tbody =
    document.getElementById(
      'listaItensCompraCliente'
    );


  if (area) {

    area.style.display =
      'block';

  }


  definirTextoClienteERP(
    'tituloDetalhesCompraCliente',
    'Itens • ' +
    idVenda
  );


  definirTextoClienteERP(
    'resumoDetalhesCompraCliente',
    'Carregando itens da venda...'
  );


  if (tbody) {

    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          Carregando itens...
        </td>
      </tr>
    `;

  }


  try {

    const resposta =
      await VNNUS_API
        .detalhesVenda(
          idVenda
        );


    const venda =
      resposta.venda ||
      {};


    const itens =
      Array.isArray(
        resposta.itens
      )
        ? resposta.itens
        : [];


    renderizarItensCompraClienteERP(
      itens
    );


    const partesResumo = [];


    if (
      venda.DATA ||
      venda.DATA_HORA
    ) {

      partesResumo.push(
        venda.DATA ||
        venda.DATA_HORA
      );

    }


    if (
      venda.FORMA_PAGAMENTO ||
      venda.PAGAMENTO
    ) {

      partesResumo.push(
        venda.FORMA_PAGAMENTO ||
        venda.PAGAMENTO
      );

    }


    const total =
      Number(
        venda.TOTAL ||
        venda.VALOR_TOTAL ||
        0
      );


    if (total) {

      partesResumo.push(
        formatarMoedaClienteERP(
          total
        )
      );

    }


    definirTextoClienteERP(
      'resumoDetalhesCompraCliente',
      partesResumo.join(
        ' • '
      ) ||
      (
        itens.length +
        ' item(ns)'
      )
    );


    if (area) {

      area.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }

  }

  catch (erro) {

    console.error(
      'Erro ao carregar itens da venda:',
      erro
    );


    definirTextoClienteERP(
      'resumoDetalhesCompraCliente',
      'Erro: ' +
      erro.message
    );


    if (tbody) {

      tbody.innerHTML = `
        <tr>
          <td colspan="4">
            Não foi possível carregar os itens.
          </td>
        </tr>
      `;

    }

  }

}


/* =====================================================
   RENDERIZAR ITENS DA COMPRA
===================================================== */

function renderizarItensCompraClienteERP(
  itens
) {

  const tbody =
    document.getElementById(
      'listaItensCompraCliente'
    );


  if (!tbody) {
    return;
  }


  if (
    !Array.isArray(itens) ||
    !itens.length
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          Nenhum item encontrado nesta venda.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    itens.map(
      function(item) {

        const produto =
          item.PRODUTO ||
          item.DESCRICAO ||
          '-';


        const quantidade =
          Number(
            item.QUANTIDADE ||
            item.QTD ||
            0
          );


        const unitario =
          Number(
            item.PRECO_UNITARIO ||
            item.VALOR_UNITARIO ||
            item.PRECO ||
            0
          );


        let total =
          Number(
            item.TOTAL ||
            item.SUBTOTAL ||
            item.VALOR_TOTAL ||
            0
          );


        if (
          !total &&
          quantidade &&
          unitario
        ) {

          total =
            quantidade *
            unitario;

        }


        return `
          <tr>

            <td>
              ${escaparHtmlClienteERP(
                produto
              )}
            </td>

            <td>
              ${escaparHtmlClienteERP(
                quantidade
              )}
            </td>

            <td>
              ${escaparHtmlClienteERP(
                formatarMoedaClienteERP(
                  unitario
                )
              )}
            </td>

            <td>
              <strong>
                ${escaparHtmlClienteERP(
                  formatarMoedaClienteERP(
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

}/* =====================================================
   FECHAR DETALHES DA COMPRA
===================================================== */

function fecharDetalhesCompraClienteERP() {

  const area =
    document.getElementById(
      'detalhesCompraCliente'
    );


  if (area) {

    area.style.display =
      'none';

  }


  definirTextoClienteERP(
    'tituloDetalhesCompraCliente',
    'Itens da venda'
  );


  definirTextoClienteERP(
    'resumoDetalhesCompraCliente',
    ''
  );


  const tbody =
    document.getElementById(
      'listaItensCompraCliente'
    );


  if (tbody) {

    tbody.innerHTML = '';

  }

}


/* =====================================================
   ABRIR MODAL HISTÓRICO
===================================================== */

function abrirModalHistoricoClienteERP() {

  const modal =
    document.getElementById(
      'modalHistoricoCliente'
    );


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


/* =====================================================
   FECHAR HISTÓRICO
===================================================== */

function fecharHistoricoClienteERP() {

  const modal =
    document.getElementById(
      'modalHistoricoCliente'
    );


  if (modal) {

    modal.classList.remove(
      'aberto'
    );

  }


  fecharDetalhesCompraClienteERP();

}


/* =====================================================
   BUSCAR CEP
===================================================== */

async function buscarCepClienteERP() {

  const campoCep =
    document.getElementById(
      'clienteCep'
    );


  const botao =
    document.getElementById(
      'btnBuscarCepCliente'
    );


  const mensagem =
    document.getElementById(
      'mensagemCliente'
    );


  if (!campoCep) {
    return;
  }


  const cep =
    somenteNumerosClienteERP(
      campoCep.value
    );


  if (
    cep.length !== 8
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Informe um CEP com 8 dígitos.';

    }

    return;

  }


  if (botao) {

    botao.disabled =
      true;

  }


  if (mensagem) {

    mensagem.textContent =
      'Consultando CEP...';

  }


  try {

    const resposta =
      await VNNUS_API
        .consultarCep(
          cep
        );


    if (
      !resposta ||
      resposta.encontrado ===
      false
    ) {

      throw new Error(
        resposta &&
        resposta.erro
          ? resposta.erro
          : 'CEP não encontrado.'
      );

    }


    const endereco =
      resposta.endereco ||
      resposta;


    definirValorClienteERP(
      'clienteCep',
      endereco.CEP ||
      formatarCepVisualClienteERP(
        cep
      )
    );


    definirValorClienteERP(
      'clienteEndereco',
      endereco.ENDERECO || ''
    );


    definirValorClienteERP(
      'clienteBairro',
      endereco.BAIRRO || ''
    );


    definirValorClienteERP(
      'clienteCidade',
      endereco.CIDADE || ''
    );


    definirValorClienteERP(
      'clienteUf',
      endereco.UF || ''
    );


    const complemento =
      document.getElementById(
        'clienteComplemento'
      );


    if (
      complemento &&
      !complemento.value &&
      endereco.COMPLEMENTO_CEP
    ) {

      complemento.value =
        endereco.COMPLEMENTO_CEP;

    }


    if (mensagem) {

      mensagem.textContent =
        '✅ Endereço localizado automaticamente.';

    }


    const numero =
      document.getElementById(
        'clienteNumero'
      );


    if (numero) {

      numero.focus();

    }

  }

  catch (erro) {

    console.error(
      'Erro CEP:',
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
   ABRIR MODAL CLIENTE
===================================================== */

function abrirModalClienteERP() {

  const modal =
    document.getElementById(
      'modalCliente'
    );


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }

}


/* =====================================================
   FECHAR MODAL CLIENTE
===================================================== */

function fecharModalClienteERP() {

  const modal =
    document.getElementById(
      'modalCliente'
    );


  if (modal) {

    modal.classList.remove(
      'aberto'
    );

  }

}


/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormularioClienteERP() {

  const campos = [

    'clienteId',
    'clienteNome',
    'clienteTelefone',
    'clienteWhatsapp',
    'clienteEmail',
    'clienteNascimento',
    'clienteCpf',
    'clienteCep',
    'clienteEndereco',
    'clienteNumero',
    'clienteComplemento',
    'clienteBairro',
    'clienteCidade',
    'clienteUf',
    'clienteObservacao'

  ];


  campos.forEach(
    function(id) {

      definirValorClienteERP(
        id,
        ''
      );

    }
  );


  definirValorClienteERP(
    'clienteAtivo',
    'SIM'
  );


  definirTextoClienteERP(
    'mensagemCliente',
    ''
  );

}


/* =====================================================
   OBTER VALOR DE CAMPO
===================================================== */

function obterValorClienteERP(
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


/* =====================================================
   DEFINIR VALOR DE CAMPO
===================================================== */

function definirValorClienteERP(
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


/* =====================================================
   DEFINIR TEXTO
===================================================== */

function definirTextoClienteERP(
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
   SOMENTE NÚMEROS
===================================================== */

function somenteNumerosClienteERP(
  valor
) {

  return String(
    valor || ''
  )
  .replace(
    /\D/g,
    ''
  );

}


/* =====================================================
   FORMATAR CEP
===================================================== */

function formatarCepVisualClienteERP(
  valor
) {

  const numeros =
    somenteNumerosClienteERP(
      valor
    )
    .substring(
      0,
      8
    );


  if (
    numeros.length <= 5
  ) {

    return numeros;

  }


  return (
    numeros.substring(
      0,
      5
    ) +
    '-' +
    numeros.substring(
      5
    )
  );

}


/* =====================================================
   FORMATAR CPF
===================================================== */

function formatarCpfVisualClienteERP(
  valor
) {

  const n =
    somenteNumerosClienteERP(
      valor
    )
    .substring(
      0,
      11
    );


  if (
    n.length <= 3
  ) {

    return n;

  }


  if (
    n.length <= 6
  ) {

    return (
      n.substring(
        0,
        3
      ) +
      '.' +
      n.substring(
        3
      )
    );

  }


  if (
    n.length <= 9
  ) {

    return (
      n.substring(
        0,
        3
      ) +
      '.' +
      n.substring(
        3,
        6
      ) +
      '.' +
      n.substring(
        6
      )
    );

  }


  return (
    n.substring(
      0,
      3
    ) +
    '.' +
    n.substring(
      3,
      6
    ) +
    '.' +
    n.substring(
      6,
      9
    ) +
    '-' +
    n.substring(
      9
    )
  );

}/* =====================================================
   FORMATAR TELEFONE / WHATSAPP
===================================================== */

function formatarTelefoneVisualClienteERP(
  valor
) {

  const numeros =
    somenteNumerosClienteERP(
      valor
    )
    .substring(
      0,
      11
    );


  if (!numeros) {

    return '';

  }


  if (
    numeros.length <= 2
  ) {

    return (
      '(' +
      numeros
    );

  }


  if (
    numeros.length <= 6
  ) {

    return (
      '(' +
      numeros.substring(
        0,
        2
      ) +
      ') ' +
      numeros.substring(
        2
      )
    );

  }


  if (
    numeros.length <= 10
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


/* =====================================================
   FORMATAR MOEDA
===================================================== */

function formatarMoedaClienteERP(
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
      style: 'currency',
      currency: 'BRL'
    }
  );

}


/* =====================================================
   NORMALIZAR DATA PARA INPUT
   dd/MM/yyyy -> yyyy-MM-dd
===================================================== */

function normalizarDataInputClienteERP(
  valor
) {

  if (!valor) {

    return '';

  }


  const texto =
    String(
      valor
    )
    .trim();


  /*
     Se já estiver no padrão
     yyyy-MM-dd
  */

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      texto
    )
  ) {

    return texto;

  }


  /*
     dd/MM/yyyy
  */

  const brasileiro =
    texto.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    );


  if (brasileiro) {

    return (
      brasileiro[3] +
      '-' +
      brasileiro[2] +
      '-' +
      brasileiro[1]
    );

  }


  /*
     Tenta interpretar ISO com horário
  */

  const iso =
    texto.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );


  if (iso) {

    return (
      iso[1] +
      '-' +
      iso[2] +
      '-' +
      iso[3]
    );

  }


  return '';

}


/* =====================================================
   FORMATAR DATA PARA PLANILHA
   yyyy-MM-dd -> dd/MM/yyyy
===================================================== */

function formatarDataPlanilhaClienteERP(
  valor
) {

  if (!valor) {

    return '';

  }


  const texto =
    String(
      valor
    )
    .trim();


  const partes =
    texto.split(
      '-'
    );


  if (
    partes.length !== 3
  ) {

    return texto;

  }


  return (
    partes[2] +
    '/' +
    partes[1] +
    '/' +
    partes[0]
  );

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHtmlClienteERP(
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
   ESCAPAR ATRIBUTO / JAVASCRIPT INLINE
===================================================== */

function escaparAtributoClienteERP(
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
    /"/g,
    '&quot;'
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
   EXPOR FUNÇÕES UTILIZADAS PELOS BOTÕES DA TABELA
===================================================== */

window.editarClienteERP =
  editarClienteERP;


window.abrirHistoricoClienteERP =
  abrirHistoricoClienteERP;


window.abrirDetalhesCompraClienteERP =
  abrirDetalhesCompraClienteERP;


/* =====================================================
   FIM
   VNNUS ERP 3.6
   CLIENTES + HISTÓRICO DE COMPRAS
===================================================== */
