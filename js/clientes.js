/* =====================================================
   VNNUS ERP 3.3
   CLIENTES - GITHUB PAGES + API VNNUS
===================================================== */

let clientesCarregadosERP = [];


window.init_clientes =
  async function() {

    const btnNovo =
      document.getElementById(
        'btnNovoCliente'
      );

    const btnAtualizar =
      document.getElementById(
        'btnAtualizarClientes'
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

    const btnCep =
      document.getElementById(
        'btnBuscarCepCliente'
      );

    const pesquisa =
      document.getElementById(
        'pesquisaClientes'
      );

    const campoCep =
      document.getElementById(
        'clienteCep'
      );


    if (btnNovo) {
      btnNovo.onclick =
        abrirNovoClienteERP;
    }


    if (btnAtualizar) {
      btnAtualizar.onclick =
        carregarClientesERP;
    }


    if (btnFechar) {
      btnFechar.onclick =
        fecharClienteERP;
    }


    if (btnCancelar) {
      btnCancelar.onclick =
        fecharClienteERP;
    }


    if (btnSalvar) {
      btnSalvar.onclick =
        salvarClienteERP;
    }


    if (btnCep) {
      btnCep.onclick =
        consultarCepClienteERP;
    }


    if (pesquisa) {
      pesquisa.oninput =
        filtrarClientesERP;
    }


    if (campoCep) {

      campoCep.oninput =
        function() {

          campoCep.value =
            formatarCepVisualERP(
              campoCep.value
            );

        };


      campoCep.onblur =
        function() {

          const cep =
            somenteNumerosERP(
              campoCep.value
            );


          if (
            cep.length === 8
          ) {

            consultarCepClienteERP();

          }

        };

    }


    const campoCpf =
      document.getElementById(
        'clienteCpf'
      );


    if (campoCpf) {

      campoCpf.oninput =
        function() {

          campoCpf.value =
            formatarCpfVisualERP(
              campoCpf.value
            );

        };

    }


    await carregarClientesERP();

  };


/* =====================================================
   CARREGAR
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
      'Atualizando clientes...';
  }


  try {

    const clientes =
      await VNNUS_API.clientes();


    clientesCarregadosERP =
      Array.isArray(clientes)
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
      'Clientes:',
      erro
    );


    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          Erro: ${escaparHtmlClienteERP(erro.message)}
        </td>
      </tr>
    `;


    if (status) {

      status.textContent =
        'Erro ao carregar clientes.';

    }

  }

}


/* =====================================================
   RENDER
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

        const ativo =
          String(
            cliente.ATIVO || 'SIM'
          )
          .trim()
          .toUpperCase() !==
          'NAO';


        const cidadeUf =
          [
            cliente.CIDADE || '',
            cliente.UF || ''
          ]
          .filter(Boolean)
          .join('/');


        return `
          <tr>

            <td>
              <strong>
                ${escaparHtmlClienteERP(cliente.ID_CLIENTE)}
              </strong>
            </td>

            <td>
              ${escaparHtmlClienteERP(cliente.NOME)}
            </td>

            <td>
              ${escaparHtmlClienteERP(formatarTelefoneVisualERP(cliente.WHATSAPP))}
            </td>

            <td>
              ${escaparHtmlClienteERP(formatarTelefoneVisualERP(cliente.TELEFONE))}
            </td>

            <td>
              ${escaparHtmlClienteERP(cidadeUf || '-')}
            </td>

            <td>
              <span
                class="status-badge ${ativo ? 'status-ok' : 'status-danger'}">
                ${ativo ? 'ATIVO' : 'INATIVO'}
              </span>
            </td>

            <td>

              <button
                class="btn-secondary"
                onclick="editarClienteERP('${escaparAtributoClienteERP(cliente.ID_CLIENTE)}')">
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
   RESUMO
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
          .toUpperCase() !==
          'NAO'
        );

      }
    ).length;


  const comWhatsapp =
    clientesCarregadosERP.filter(
      function(cliente) {

        return (
          somenteNumerosERP(
            cliente.WHATSAPP
          ).length >= 10
        );

      }
    ).length;


  const totalEl =
    document.getElementById(
      'totalClientes'
    );


  const ativosEl =
    document.getElementById(
      'totalClientesAtivos'
    );


  const whatsappEl =
    document.getElementById(
      'totalClientesWhatsapp'
    );


  if (totalEl) {
    totalEl.textContent =
      total;
  }


  if (ativosEl) {
    ativosEl.textContent =
      ativos;
  }


  if (whatsappEl) {
    whatsappEl.textContent =
      comWhatsapp;
  }

}


/* =====================================================
   FILTRO
===================================================== */

function filtrarClientesERP() {

  const campo =
    document.getElementById(
      'pesquisaClientes'
    );


  if (!campo) {
    return;
  }


  const termo =
    campo.value
      .trim()
      .toLowerCase();


  const filtrados =
    clientesCarregadosERP.filter(
      function(cliente) {

        const base =
          [
            cliente.NOME,
            cliente.TELEFONE,
            cliente.WHATSAPP,
            cliente.CPF,
            cliente.EMAIL
          ]
          .join(' ')
          .toLowerCase();


        return base.includes(
          termo
        );

      }
    );


  renderizarClientesERP(
    filtrados
  );

}


/* =====================================================
   NOVO / EDITAR
===================================================== */

function abrirNovoClienteERP() {

  limparFormularioClienteERP();


  const titulo =
    document.getElementById(
      'tituloModalCliente'
    );


  if (titulo) {
    titulo.textContent =
      'Novo Cliente';
  }


  abrirModalClienteERP();

}


function editarClienteERP(
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


  limparFormularioClienteERP();


  preencherCampoClienteERP(
    'clienteId',
    cliente.ID_CLIENTE
  );

  preencherCampoClienteERP(
    'clienteNome',
    cliente.NOME
  );

  preencherCampoClienteERP(
    'clienteTelefone',
    formatarTelefoneVisualERP(
      cliente.TELEFONE
    )
  );

  preencherCampoClienteERP(
    'clienteWhatsapp',
    formatarTelefoneVisualERP(
      cliente.WHATSAPP
    )
  );

  preencherCampoClienteERP(
    'clienteEmail',
    cliente.EMAIL
  );

  preencherCampoClienteERP(
    'clienteNascimento',
    converterDataParaInputERP(
      cliente.DATA_NASCIMENTO
    )
  );

  preencherCampoClienteERP(
    'clienteCpf',
    formatarCpfVisualERP(
      cliente.CPF
    )
  );

  preencherCampoClienteERP(
    'clienteCep',
    formatarCepVisualERP(
      cliente.CEP
    )
  );

  preencherCampoClienteERP(
    'clienteEndereco',
    cliente.ENDERECO
  );

  preencherCampoClienteERP(
    'clienteNumero',
    cliente.NUMERO
  );

  preencherCampoClienteERP(
    'clienteComplemento',
    cliente.COMPLEMENTO
  );

  preencherCampoClienteERP(
    'clienteBairro',
    cliente.BAIRRO
  );

  preencherCampoClienteERP(
    'clienteCidade',
    cliente.CIDADE
  );

  preencherCampoClienteERP(
    'clienteUf',
    cliente.UF
  );

  preencherCampoClienteERP(
    'clienteObservacao',
    cliente.OBSERVACAO
  );

  preencherCampoClienteERP(
    'clienteAtivo',
    String(
      cliente.ATIVO || 'SIM'
    )
    .trim()
    .toUpperCase() === 'NAO'
      ? 'NAO'
      : 'SIM'
  );


  const titulo =
    document.getElementById(
      'tituloModalCliente'
    );


  if (titulo) {

    titulo.textContent =
      'Editar Cliente • ' +
      cliente.ID_CLIENTE;

  }


  abrirModalClienteERP();

}


/* =====================================================
   CEP
===================================================== */

async function consultarCepClienteERP() {

  const campoCep =
    document.getElementById(
      'clienteCep'
    );

  const mensagem =
    document.getElementById(
      'mensagemCliente'
    );

  const botao =
    document.getElementById(
      'btnBuscarCepCliente'
    );


  const cep =
    somenteNumerosERP(
      campoCep
        ? campoCep.value
        : ''
    );


  if (
    cep.length !== 8
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Informe um CEP válido com 8 dígitos.';

    }

    return;

  }


  if (mensagem) {

    mensagem.textContent =
      'Consultando CEP...';

  }


  if (botao) {
    botao.disabled = true;
  }


  try {

    const resposta =
      await VNNUS_API
        .consultarCep(
          cep
        );


    if (
      !resposta ||
      !resposta.encontrado
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
      {};


    preencherCampoClienteERP(
      'clienteCep',
      endereco.CEP ||
      formatarCepVisualERP(cep)
    );

    preencherCampoClienteERP(
      'clienteEndereco',
      endereco.ENDERECO
    );

    preencherCampoClienteERP(
      'clienteBairro',
      endereco.BAIRRO
    );

    preencherCampoClienteERP(
      'clienteCidade',
      endereco.CIDADE
    );

    preencherCampoClienteERP(
      'clienteUf',
      endereco.UF
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
      'CEP:',
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
   SALVAR
===================================================== */

async function salvarClienteERP() {

  const mensagem =
    document.getElementById(
      'mensagemCliente'
    );

  const botao =
    document.getElementById(
      'btnSalvarCliente'
    );


  const dados = {

    ID_CLIENTE:
      valorCampoClienteERP(
        'clienteId'
      ),

    NOME:
      valorCampoClienteERP(
        'clienteNome'
      ),

    TELEFONE:
      valorCampoClienteERP(
        'clienteTelefone'
      ),

    WHATSAPP:
      valorCampoClienteERP(
        'clienteWhatsapp'
      ),

    EMAIL:
      valorCampoClienteERP(
        'clienteEmail'
      ),

    DATA_NASCIMENTO:
      formatarDataParaPlanilhaERP(
        valorCampoClienteERP(
          'clienteNascimento'
        )
      ),

    CPF:
      valorCampoClienteERP(
        'clienteCpf'
      ),

    CEP:
      valorCampoClienteERP(
        'clienteCep'
      ),

    ENDERECO:
      valorCampoClienteERP(
        'clienteEndereco'
      ),

    NUMERO:
      valorCampoClienteERP(
        'clienteNumero'
      ),

    COMPLEMENTO:
      valorCampoClienteERP(
        'clienteComplemento'
      ),

    BAIRRO:
      valorCampoClienteERP(
        'clienteBairro'
      ),

    CIDADE:
      valorCampoClienteERP(
        'clienteCidade'
      ),

    UF:
      valorCampoClienteERP(
        'clienteUf'
      ),

    OBSERVACAO:
      valorCampoClienteERP(
        'clienteObservacao'
      ),

    ATIVO:
      valorCampoClienteERP(
        'clienteAtivo'
      ) || 'SIM'

  };


  if (!dados.NOME) {

    if (mensagem) {

      mensagem.textContent =
        'Informe o nome do cliente.';

    }

    return;

  }


  if (mensagem) {

    mensagem.textContent =
      'Salvando cliente...';

  }


  if (botao) {
    botao.disabled = true;
  }


  try {

    const resposta =
      await VNNUS_API
        .salvarCliente(
          dados
        );


    if (mensagem) {

      mensagem.textContent =
        '✅ ' +
        (
          resposta.mensagem ||
          'Cliente salvo com sucesso!'
        );

    }


    await carregarClientesERP();


    setTimeout(
      function() {

        fecharClienteERP();

      },
      900
    );

  }

  catch (erro) {

    console.error(
      'Cliente:',
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
   MODAL
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


function fecharClienteERP() {

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
   FORMULÁRIO
===================================================== */

function limparFormularioClienteERP() {

  [
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
  ]
  .forEach(
    function(id) {

      preencherCampoClienteERP(
        id,
        ''
      );

    }
  );


  preencherCampoClienteERP(
    'clienteAtivo',
    'SIM'
  );


  const mensagem =
    document.getElementById(
      'mensagemCliente'
    );


  if (mensagem) {
    mensagem.textContent = '';
  }

}


function preencherCampoClienteERP(
  id,
  valor
) {

  const campo =
    document.getElementById(
      id
    );


  if (campo) {
    campo.value =
      valor ?? '';
  }

}


function valorCampoClienteERP(
  id
) {

  const campo =
    document.getElementById(
      id
    );


  return campo
    ? String(
        campo.value || ''
      ).trim()
    : '';

}


/* =====================================================
   FORMATAÇÕES
===================================================== */

function somenteNumerosERP(
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


function formatarCepVisualERP(
  valor
) {

  const numeros =
    somenteNumerosERP(
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


function formatarCpfVisualERP(
  valor
) {

  const n =
    somenteNumerosERP(
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


function formatarTelefoneVisualERP(
  valor
) {

  const n =
    somenteNumerosERP(
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


function converterDataParaInputERP(
  valor
) {

  const texto =
    String(
      valor || ''
    ).trim();


  if (!texto) {
    return '';
  }


  if (
    /^\d{4}-\d{2}-\d{2}$/
      .test(texto)
  ) {

    return texto;

  }


  const partes =
    texto.split('/');


  if (
    partes.length === 3
  ) {

    return (
      partes[2] +
      '-' +
      String(partes[1]).padStart(2, '0') +
      '-' +
      String(partes[0]).padStart(2, '0')
    );

  }


  return '';

}


function formatarDataParaPlanilhaERP(
  valor
) {

  const texto =
    String(
      valor || ''
    ).trim();


  if (!texto) {
    return '';
  }


  const partes =
    texto.split('-');


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
   ESCAPE
===================================================== */

function escaparHtmlClienteERP(
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


function escaparAtributoClienteERP(
  valor
) {

  return String(
    valor ?? ''
  )
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");

}
