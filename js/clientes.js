/* =====================================================
   VNNUS ERP 3.5.1
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

}


/* =====================================================
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


    /*
      Compatível com os dois formatos:
      1) resposta.cliente
      2) cliente direto
    */

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


  if (!cliente) {

    alert(
      'Cliente não encontrado.'
    );

    return;

  }


  const modal =
    document.getElementById(
      'modalHistoricoCliente'
    );


  const tbody =
    document.getElementById(
      'listaHistoricoCliente'
    );


  definirTextoClienteERP(
    'tituloHistoricoCliente',
    'Compras • ' +
    (
      cliente.NOME ||
      cliente.ID_CLIENTE
    )
  );


  definirTextoClienteERP(
    'subtituloHistoricoCliente',
    cliente.ID_CLIENTE +
    ' • Histórico vinculado pelo ID do cliente'
  );


  definirTextoClienteERP(
    'statusHistoricoCliente',
    'Carregando histórico...'
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


  zerarResumoHistoricoClienteERP();

  fecharDetalhesCompraClienteERP();


  if (modal) {

    modal.classList.add(
      'aberto'
    );

  }


  try {

    const resposta =
      await VNNUS_API
        .historicoCliente(
          cliente.ID_CLIENTE
        );


    const vendas =
      Array.isArray(
        resposta.vendas
      )
        ? resposta.vendas
        : [];


    renderizarResumoHistoricoClienteERP(
      resposta.resumo || {},
      vendas
    );


    renderizarHistoricoClienteERP(
      vendas
    );


    definirTextoClienteERP(
      'statusHistoricoCliente',
      vendas.length
        ? vendas.length +
          ' venda(s) vinculada(s) ao cliente.'
        : 'Este cliente ainda não possui compras vinculadas.'
    );

  }

  catch (erro) {

    console.error(
      'Histórico do cliente:',
      erro
    );


    definirTextoClienteERP(
      'statusHistoricoCliente',
      'Erro ao carregar histórico: ' +
      erro.message
    );


    if (tbody) {

      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            Erro ao carregar histórico.
          </td>
        </tr>
      `;

    }

  }

}


/* =====================================================
   RESUMO DO HISTÓRICO
===================================================== */

function zerarResumoHistoricoClienteERP() {

  definirTextoClienteERP(
    'histTotalCompras',
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
    'histUltimaCompra',
    '-'
  );

}


function renderizarResumoHistoricoClienteERP(
  resumo,
  vendas
) {

  const totalCompras =
    Number(
      resumo.totalCompras || 0
    );


  const totalGasto =
    Number(
      resumo.totalGasto || 0
    );


  const ticketMedio =
    Number(
      resumo.ticketMedio || 0
    );


  const ultimaCompra =
    resumo.ultimaCompra ||
    (
      vendas.length
        ? (
            vendas[0].DATA ||
            vendas[0].DATA_HORA ||
            '-'
          )
        : '-'
    );


  definirTextoClienteERP(
    'histTotalCompras',
    String(
      totalCompras
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
    'histUltimaCompra',
    String(
      ultimaCompra || '-'
    )
  );

}


/* =====================================================
   LISTA DE VENDAS
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


  if (!vendas.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Nenhuma compra vinculada a este cliente.
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
          venda.ID ||
          '';


        const data =
          venda.DATA ||
          venda.DATA_HORA ||
          venda.DATA_VENDA ||
          '-';


        const pagamento =
          venda.FORMA_PAGAMENTO ||
          venda.PAGAMENTO ||
          '-';


        const total =
          Number(
            venda.TOTAL || 0
          );


        const status =
          String(
            venda.STATUS || ''
          )
          .trim()
          .toUpperCase();


        const cancelada =
          status ===
          'CANCELADA';


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
                class="status-badge ${
                  cancelada
                    ? 'status-danger'
                    : 'status-ok'
                }">

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
   DETALHES DA COMPRA
===================================================== */

async function abrirDetalhesCompraClienteERP(
  idVenda
) {

  if (!idVenda) {
    return;
  }


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
    'Carregando detalhes...'
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

    const detalhes =
      await VNNUS_API
        .detalhesVenda(
          idVenda
        );


    const venda =
      detalhes.venda || {};


    const itens =
      Array.isArray(
        detalhes.itens
      )
        ? detalhes.itens
        : [];


    definirTextoClienteERP(
      'resumoDetalhesCompraCliente',
      [
        venda.DATA ||
        venda.DATA_HORA ||
        '',

        venda.FORMA_PAGAMENTO ||
        venda.PAGAMENTO ||
        '',

        formatarMoedaClienteERP(
          Number(
            venda.TOTAL || 0
          )
        )
      ]
      .filter(Boolean)
      .join(' • ')
    );


    if (!tbody) {
      return;
    }


    if (!itens.length) {

      tbody.innerHTML = `
        <tr>
          <td colspan="4">
            Nenhum item encontrado.
          </td>
        </tr>
      `;

      return;

    }


    tbody.innerHTML =
      itens.map(
        function(item) {

          const quantidade =
            Number(
              item.QUANTIDADE ||
              item.QTD ||
              0
            );


          const unitario =
            Number(
              item.VALOR_UNITARIO ||
              item.PRECO_UNITARIO ||
              item.PRECO ||
              0
            );


          const totalItem =
            Number(
              item.TOTAL ||
              item.TOTAL_ITEM ||
              (
                quantidade *
                unitario
              )
            );


          return `
            <tr>

              <td>
                ${escaparHtmlClienteERP(
                  item.PRODUTO ||
                  item.DESCRICAO ||
                  item.NOME ||
                  '-'
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
                ${escaparHtmlClienteERP(
                  formatarMoedaClienteERP(
                    totalItem
                  )
                )}
              </td>

            </tr>
          `;

        }
      )
      .join('');

  }

  catch (erro) {

    console.error(
      'Detalhes da compra:',
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


function fecharDetalhesCompraClienteERP() {

  const area =
    document.getElementById(
      'detalhesCompraCliente'
    );


  if (area) {

    area.style.display =
      'none';

  }

}


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
   MODAL CLIENTE
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
   UTILITÁRIOS
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
      n.substring(0, 3) +
      '.' +
      n.substring(3)
    );

  }


  if (
    n.length <= 9
  ) {

    return (
      n.substring(0, 3) +
      '.' +
      n.substring(3, 6) +
      '.' +
      n.substring(6)
    );

  }


  return (
    n.substring(0, 3) +
    '.' +
    n.substring(3, 6) +
    '.' +
    n.substring(6, 9) +
    '-' +
    n.substring(9)
  );

}


/* =====================================================
   FORMATAR TELEFONE
===================================================== */

function formatarTelefoneVisualClienteERP(
  valor
) {

  const n =
    somenteNumerosClienteERP(
      valor
    );


  if (
    n.length === 11
  ) {

    return (
      '(' +
      n.substring(0, 2) +
      ') ' +
      n.substring(2, 7) +
      '-' +
      n.substring(7)
    );

  }


  if (
    n.length === 10
  ) {

    return (
      '(' +
      n.substring(0, 2) +
      ') ' +
      n.substring(2, 6) +
      '-' +
      n.substring(6)
    );

  }


  return valor || '';

}


/* =====================================================
   MOEDA
===================================================== */

function formatarMoedaClienteERP(
  valor
) {

  return Number(
    valor || 0
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


/* =====================================================
   DATA PARA INPUT
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


  if (
    /^\d{4}-\d{2}-\d{2}$/
    .test(
      texto
    )
  ) {

    return texto;

  }


  const br =
    texto.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    );


  if (br) {

    return (
      br[3] +
      '-' +
      br[2] +
      '-' +
      br[1]
    );

  }


  return '';

}


/* =====================================================
   DATA PARA PLANILHA
===================================================== */

function formatarDataPlanilhaClienteERP(
  valor
) {

  const texto =
    String(
      valor || ''
    )
    .trim();


  if (!texto) {

    return '';

  }


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
   SEGURANÇA HTML
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
    /\r/g,
    ''
  )
  .replace(
    /\n/g,
    ' '
  );

}
