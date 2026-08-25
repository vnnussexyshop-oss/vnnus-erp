/* =====================================================
   VNNUS ERP
   CONFIGURAÇÕES 1.0
===================================================== */


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.init_configuracoes =
  async function() {

    configurarEventosConfiguracoes();

    configurarIntegracoesVisuais();

    await carregarConfiguracoesERP();

    await testarApiConfiguracoes();

  };


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventosConfiguracoes() {

  const btnSalvarTopo =
    document.getElementById(
      'btnSalvarConfiguracoes'
    );


  const btnSalvarRodape =
    document.getElementById(
      'btnSalvarConfiguracoesRodape'
    );


  const btnBuscarCep =
    document.getElementById(
      'btnBuscarCepConfiguracoes'
    );


  const campoCep =
    document.getElementById(
      'configCep'
    );


  const btnTestarApi =
    document.getElementById(
      'btnTestarApiConfiguracoes'
    );


  const btnScanner =
    document.getElementById(
      'btnAbrirScannerConfiguracoes'
    );


  if (btnSalvarTopo) {

    btnSalvarTopo.onclick =
      salvarConfiguracoesERP;

  }


  if (btnSalvarRodape) {

    btnSalvarRodape.onclick =
      salvarConfiguracoesERP;

  }


  if (btnBuscarCep) {

    btnBuscarCep.onclick =
      buscarCepConfiguracoesERP;

  }


  if (campoCep) {

    campoCep.oninput =
      function() {

        campoCep.value =
          formatarCepConfiguracoes(
            campoCep.value
          );

      };


    campoCep.onblur =
      function() {

        const cep =
          somenteNumerosConfiguracoes(
            campoCep.value
          );


        if (
          cep.length === 8
        ) {

          buscarCepConfiguracoesERP();

        }

      };

  }


  if (btnTestarApi) {

    btnTestarApi.onclick =
      testarApiConfiguracoes;

  }


  if (btnScanner) {

    btnScanner.onclick =
      abrirScannerConfiguracoes;

  }

}


/* =====================================================
   CARREGAR CONFIGURAÇÕES
===================================================== */

async function carregarConfiguracoesERP() {

  definirTextoConfiguracoes(
    'statusConfiguracoes',
    'Carregando configurações...'
  );


  try {

    const resposta =
      await VNNUS_API
        .configuracoes();


    const dados =
      resposta.configuracoes ||
      resposta ||
      {};


    preencherConfiguracoesERP(
      dados
    );


    preencherClientesPadraoConfiguracoes(
      resposta.clientes ||
      []
    );


    definirTextoConfiguracoes(
      'configUltimaAtualizacao',
      dados.ULTIMA_ATUALIZACAO ||
      '-'
    );


    definirTextoConfiguracoes(
      'statusConfiguracoes',
      'Configurações carregadas.'
    );

  }

  catch (erro) {

    console.error(
      'Erro ao carregar configurações:',
      erro
    );


    definirTextoConfiguracoes(
      'statusConfiguracoes',
      'Erro: ' +
      erro.message
    );

  }

}


/* =====================================================
   PREENCHER FORMULÁRIO
===================================================== */

function preencherConfiguracoesERP(
  dados
) {

  definirValorConfiguracoes(
    'configNomeLoja',
    dados.NOME_LOJA ||
    'VNNUS'
  );


  definirValorConfiguracoes(
    'configWhatsapp',
    dados.WHATSAPP ||
    ''
  );


  definirValorConfiguracoes(
    'configTelefone',
    dados.TELEFONE ||
    ''
  );


  definirValorConfiguracoes(
    'configInstagram',
    dados.INSTAGRAM ||
    ''
  );


  definirValorConfiguracoes(
    'configEmail',
    dados.EMAIL ||
    ''
  );


  definirValorConfiguracoes(
    'configCep',
    formatarCepConfiguracoes(
      dados.CEP ||
      ''
    )
  );


  definirValorConfiguracoes(
    'configEndereco',
    dados.ENDERECO ||
    ''
  );


  definirValorConfiguracoes(
    'configNumero',
    dados.NUMERO ||
    ''
  );


  definirValorConfiguracoes(
    'configComplemento',
    dados.COMPLEMENTO ||
    ''
  );


  definirValorConfiguracoes(
    'configBairro',
    dados.BAIRRO ||
    ''
  );


  definirValorConfiguracoes(
    'configCidade',
    dados.CIDADE ||
    ''
  );


  definirValorConfiguracoes(
    'configUf',
    dados.UF ||
    ''
  );


  definirValorConfiguracoes(
    'configNomeComprovante',
    dados.NOME_COMPROVANTE ||
    'VNNUS'
  );


  definirValorConfiguracoes(
    'configMensagemComprovante',
    dados.MENSAGEM_COMPROVANTE ||
    'Obrigada pela preferência! ❤️'
  );


  definirValorConfiguracoes(
    'configRodapeComprovante',
    dados.RODAPE_COMPROVANTE ||
    ''
  );


  definirValorConfiguracoes(
    'configClientePadrao',
    dados.CLIENTE_PADRAO ||
    ''
  );


  definirValorConfiguracoes(
    'configPagamentoPadrao',
    dados.PAGAMENTO_PADRAO ||
    ''
  );


  definirValorConfiguracoes(
    'configDescontoMaximo',
    dados.DESCONTO_MAXIMO ||
    0
  );


  definirValorConfiguracoes(
    'configPermitirSemEstoque',
    dados.PERMITIR_SEM_ESTOQUE ||
    'NAO'
  );


  definirValorConfiguracoes(
    'configEstoqueMinimo',
    dados.ESTOQUE_MINIMO_PADRAO ||
    2
  );


  definirValorConfiguracoes(
    'configAlertaEstoque',
    dados.ALERTA_ESTOQUE ||
    'SIM'
  );

}


/* =====================================================
   PREENCHER CLIENTES PADRÃO
===================================================== */

function preencherClientesPadraoConfiguracoes(
  clientes
) {

  const select =
    document.getElementById(
      'configClientePadrao'
    );


  if (!select) {
    return;
  }


  const valorAtual =
    select.value;


  select.innerHTML = `
    <option value="">
      Consumidor Final
    </option>
  `;


  if (
    Array.isArray(clientes)
  ) {

    clientes.forEach(
      function(cliente) {

        const option =
          document.createElement(
            'option'
          );


        option.value =
          cliente.ID_CLIENTE ||
          '';


        option.textContent =
          (
            cliente.NOME ||
            cliente.ID_CLIENTE ||
            'Cliente'
          );


        select.appendChild(
          option
        );

      }
    );

  }


  if (
    valorAtual
  ) {

    select.value =
      valorAtual;

  }

}


/* =====================================================
   SALVAR CONFIGURAÇÕES
===================================================== */

async function salvarConfiguracoesERP() {

  const botaoTopo =
    document.getElementById(
      'btnSalvarConfiguracoes'
    );


  const botaoRodape =
    document.getElementById(
      'btnSalvarConfiguracoesRodape'
    );


  const mensagem =
    document.getElementById(
      'mensagemConfiguracoes'
    );


  const dados = {

    NOME_LOJA:
      obterValorConfiguracoes(
        'configNomeLoja'
      ).trim(),

    WHATSAPP:
      obterValorConfiguracoes(
        'configWhatsapp'
      ).trim(),

    TELEFONE:
      obterValorConfiguracoes(
        'configTelefone'
      ).trim(),

    INSTAGRAM:
      obterValorConfiguracoes(
        'configInstagram'
      ).trim(),

    EMAIL:
      obterValorConfiguracoes(
        'configEmail'
      ).trim(),

    CEP:
      obterValorConfiguracoes(
        'configCep'
      ).trim(),

    ENDERECO:
      obterValorConfiguracoes(
        'configEndereco'
      ).trim(),

    NUMERO:
      obterValorConfiguracoes(
        'configNumero'
      ).trim(),

    COMPLEMENTO:
      obterValorConfiguracoes(
        'configComplemento'
      ).trim(),

    BAIRRO:
      obterValorConfiguracoes(
        'configBairro'
      ).trim(),

    CIDADE:
      obterValorConfiguracoes(
        'configCidade'
      ).trim(),

    UF:
      obterValorConfiguracoes(
        'configUf'
      )
      .trim()
      .toUpperCase(),

    NOME_COMPROVANTE:
      obterValorConfiguracoes(
        'configNomeComprovante'
      ).trim(),

    MENSAGEM_COMPROVANTE:
      obterValorConfiguracoes(
        'configMensagemComprovante'
      ).trim(),

    RODAPE_COMPROVANTE:
      obterValorConfiguracoes(
        'configRodapeComprovante'
      ).trim(),

    CLIENTE_PADRAO:
      obterValorConfiguracoes(
        'configClientePadrao'
      ),

    PAGAMENTO_PADRAO:
      obterValorConfiguracoes(
        'configPagamentoPadrao'
      ),

    DESCONTO_MAXIMO:
      Number(
        obterValorConfiguracoes(
          'configDescontoMaximo'
        ) ||
        0
      ),

    PERMITIR_SEM_ESTOQUE:
      obterValorConfiguracoes(
        'configPermitirSemEstoque'
      ) ||
      'NAO',

    ESTOQUE_MINIMO_PADRAO:
      Number(
        obterValorConfiguracoes(
          'configEstoqueMinimo'
        ) ||
        0
      ),

    ALERTA_ESTOQUE:
      obterValorConfiguracoes(
        'configAlertaEstoque'
      ) ||
      'SIM'

  };


  if (
    !dados.NOME_LOJA
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Informe o nome da loja.';

    }

    return;

  }


  if (
    !Number.isFinite(
      dados.DESCONTO_MAXIMO
    ) ||
    dados.DESCONTO_MAXIMO < 0 ||
    dados.DESCONTO_MAXIMO > 100
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Desconto máximo deve ficar entre 0 e 100%.';

    }

    return;

  }


  if (
    !Number.isFinite(
      dados.ESTOQUE_MINIMO_PADRAO
    ) ||
    dados.ESTOQUE_MINIMO_PADRAO < 0
  ) {

    if (mensagem) {

      mensagem.textContent =
        'Estoque mínimo padrão inválido.';

    }

    return;

  }


  bloquearBotoesConfiguracoes(
    true
  );


  if (mensagem) {

    mensagem.textContent =
      'Salvando configurações...';

  }


  try {

    const resposta =
      await VNNUS_API
        .salvarConfiguracoes(
          dados
        );


    if (mensagem) {

      mensagem.textContent =
        resposta.mensagem ||
        'Configurações salvas com sucesso.';

    }


    if (
      resposta.ultimaAtualizacao
    ) {

      definirTextoConfiguracoes(
        'configUltimaAtualizacao',
        resposta.ultimaAtualizacao
      );

    }


    definirTextoConfiguracoes(
      'statusConfiguracoes',
      'Configurações atualizadas.'
    );

  }

  catch (erro) {

    console.error(
      'Erro ao salvar configurações:',
      erro
    );


    if (mensagem) {

      mensagem.textContent =
        'Erro: ' +
        erro.message;

    }

  }

  finally {

    bloquearBotoesConfiguracoes(
      false
    );

  }

}


/* =====================================================
   BLOQUEAR BOTÕES
===================================================== */

function bloquearBotoesConfiguracoes(
  bloquear
) {

  const ids = [

    'btnSalvarConfiguracoes',

    'btnSalvarConfiguracoesRodape'

  ];


  ids.forEach(
    function(id) {

      const botao =
        document.getElementById(
          id
        );


      if (botao) {

        botao.disabled =
          bloquear;

      }

    }
  );

}


/* =====================================================
   BUSCAR CEP
===================================================== */

async function buscarCepConfiguracoesERP() {

  const cep =
    somenteNumerosConfiguracoes(
      obterValorConfiguracoes(
        'configCep'
      )
    );


  const mensagem =
    document.getElementById(
      'mensagemConfiguracoes'
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


    definirValorConfiguracoes(
      'configCep',
      endereco.CEP ||
      formatarCepConfiguracoes(
        cep
      )
    );


    definirValorConfiguracoes(
      'configEndereco',
      endereco.ENDERECO ||
      ''
    );


    definirValorConfiguracoes(
      'configBairro',
      endereco.BAIRRO ||
      ''
    );


    definirValorConfiguracoes(
      'configCidade',
      endereco.CIDADE ||
      ''
    );


    definirValorConfiguracoes(
      'configUf',
      endereco.UF ||
      ''
    );


    const complemento =
      document.getElementById(
        'configComplemento'
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
        'configNumero'
      );


    if (numero) {

      numero.focus();

    }

  }

  catch (erro) {

    if (mensagem) {

      mensagem.textContent =
        'Erro: ' +
        erro.message;

    }

  }

}


/* =====================================================
   TESTAR API
===================================================== */

async function testarApiConfiguracoes() {

  definirTextoConfiguracoes(
    'configStatusApi',
    '🟡 Verificando API...'
  );


  definirTextoConfiguracoes(
    'configApiStatusSistema',
    'Verificando...'
  );


  try {

    const resposta =
      await VNNUS_API
        .ping();


    definirTextoConfiguracoes(
      'configStatusApi',
      '🟢 API conectada'
    );


    definirTextoConfiguracoes(
      'configApiStatusSistema',
      'Online'
    );


    definirTextoConfiguracoes(
      'configVersaoApi',
      resposta.versao ||
      '-'
    );

  }

  catch (erro) {

    definirTextoConfiguracoes(
      'configStatusApi',
      '🔴 API indisponível'
    );


    definirTextoConfiguracoes(
      'configApiStatusSistema',
      'Offline'
    );


    definirTextoConfiguracoes(
      'configVersaoApi',
      '-'
    );

  }

}


/* =====================================================
   SCANNER
===================================================== */

function configurarIntegracoesVisuais() {

  const scannerUrl =
    window.VNNUS_CONFIG &&
    window.VNNUS_CONFIG.SCANNER_URL;


  definirTextoConfiguracoes(
    'configStatusScanner',
    scannerUrl
      ? '🟢 Scanner configurado'
      : '🔴 Scanner não configurado'
  );

}


function abrirScannerConfiguracoes() {

  const url =
    window.VNNUS_CONFIG &&
    window.VNNUS_CONFIG.SCANNER_URL;


  if (!url) {

    alert(
      'URL do Scanner não configurada.'
    );

    return;

  }


  window.open(
    url,
    '_blank',
    'noopener'
  );

}


/* =====================================================
   VALORES
===================================================== */

function obterValorConfiguracoes(
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


function definirValorConfiguracoes(
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


function definirTextoConfiguracoes(
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
   CEP
===================================================== */

function somenteNumerosConfiguracoes(
  valor
) {

  return String(
    valor ||
    ''
  )
  .replace(
    /\D/g,
    ''
  );

}


function formatarCepConfiguracoes(
  valor
) {

  const numeros =
    somenteNumerosConfiguracoes(
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
   FIM
   VNNUS CONFIGURAÇÕES 1.0
===================================================== */
