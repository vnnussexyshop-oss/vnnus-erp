let carrinhoPDV31 = [];
let ultimoComprovantePDV32 = null;


window.init_pdv = async function() {
  const campo = document.getElementById('pdvGTIN');
  const buscar = document.getElementById('pdvBuscar');
  const scanner = document.getElementById('pdvScanner');
  const limpar = document.getElementById('pdvLimparVenda');
  const desconto = document.getElementById('pdvDesconto');
  const finalizar = document.getElementById('pdvFinalizar');
  const fecharModal = document.getElementById('pdvFecharModal');
  const cancelar = document.getElementById('pdvCancelarFinalizacao');
  const confirmar = document.getElementById('pdvConfirmarVenda');
  const fecharComprovante = document.getElementById('pdvFecharComprovante');
  const compartilharComprovante = document.getElementById('pdvCompartilharComprovante');
  const novaVenda = document.getElementById('pdvNovaVenda');

  const params = new URLSearchParams(window.location.search);
  const gtinRecebido = params.get('gtin');

  if (campo && gtinRecebido) {
    campo.value = gtinRecebido;

    await buscarProdutoPDV31(gtinRecebido);

    history.replaceState(
      null,
      '',
      window.location.origin +
      window.location.pathname +
      '#pdv'
    );
  }

  if (buscar && campo) {
    buscar.onclick = function() {
      buscarProdutoPDV31(campo.value);
    };

    campo.onkeydown = function(evento) {
      if (evento.key === 'Enter') {
        evento.preventDefault();
        buscarProdutoPDV31(campo.value);
      }
    };
  }

  if (scanner) {
    scanner.onclick = abrirScannerPDV31;
  }

  if (limpar) {
    limpar.onclick = function() {
      if (!carrinhoPDV31.length) return;

      if (confirm('Deseja limpar toda a venda?')) {
        carrinhoPDV31 = [];

        if (desconto) {
          desconto.value = '0';
        }

        renderCarrinhoPDV31();
        definirStatusPDV31('Venda limpa.');
      }
    };
  }

  if (desconto) {
    desconto.oninput = renderCarrinhoPDV31;
  }

  if (finalizar) {
    finalizar.onclick = abrirFinalizacaoPDV31;
  }

  if (fecharModal) {
    fecharModal.onclick = fecharFinalizacaoPDV31;
  }

  if (cancelar) {
    cancelar.onclick = fecharFinalizacaoPDV31;
  }

  if (confirmar) {
    confirmar.onclick = confirmarVendaPDV31;
  }

  if (fecharComprovante) {
    fecharComprovante.onclick = fecharComprovantePDV32;
  }

  if (compartilharComprovante) {
    compartilharComprovante.onclick = compartilharComprovantePDV32;
  }

  if (novaVenda) {
    novaVenda.onclick = novaVendaPDV32;
  }

  renderCarrinhoPDV31();
};


async function buscarProdutoPDV31(gtin) {
  const codigo = String(gtin || '').trim();

  if (!codigo) {
    definirStatusPDV31('Digite ou bipe um GTIN.');
    return;
  }

  definirStatusPDV31('Buscando produto...');

  try {
    const produto =
      await VNNUS_API.produtoPorGTIN(codigo);

    if (!produto) {
      definirStatusPDV31('Produto não encontrado.');
      return;
    }

    if (Number(produto.estoque || 0) <= 0) {
      definirStatusPDV31(
        produto.produto + ' está sem estoque.'
      );
      return;
    }

    adicionarProdutoPDV31(produto);

    definirStatusPDV31(
      '✅ ' + produto.produto + ' adicionado.'
    );

    const campo =
      document.getElementById('pdvGTIN');

    if (campo) {
      campo.value = '';
      campo.focus();
    }
  }
  catch (erro) {
    console.error('PDV:', erro);

    definirStatusPDV31(
      'Erro: ' + erro.message
    );
  }
}


function adicionarProdutoPDV31(produto) {
  const existente =
    carrinhoPDV31.find(function(item) {
      return item.id === produto.id;
    });

  if (existente) {
    if (
      existente.quantidade + 1 >
      Number(produto.estoque || 0)
    ) {
      alert(
        'Estoque disponível: ' +
        produto.estoque
      );
      return;
    }

    existente.quantidade++;
  }
  else {
    carrinhoPDV31.push({
      ...produto,
      quantidade: 1
    });
  }

  renderCarrinhoPDV31();
}


function alterarQuantidadePDV31(
  idProduto,
  variacao
) {
  const item =
    carrinhoPDV31.find(function(produto) {
      return produto.id === idProduto;
    });

  if (!item) return;

  const novaQuantidade =
    Number(item.quantidade || 0) +
    Number(variacao || 0);

  if (novaQuantidade <= 0) {
    removerProdutoPDV31(idProduto);
    return;
  }

  if (
    novaQuantidade >
    Number(item.estoque || 0)
  ) {
    alert(
      'Estoque disponível: ' +
      item.estoque
    );
    return;
  }

  item.quantidade = novaQuantidade;

  renderCarrinhoPDV31();
}


function removerProdutoPDV31(idProduto) {
  carrinhoPDV31 =
    carrinhoPDV31.filter(function(item) {
      return item.id !== idProduto;
    });

  renderCarrinhoPDV31();
}


function calcularTotaisPDV31() {
  const subtotal =
    carrinhoPDV31.reduce(
      function(soma, item) {
        return (
          soma +
          Number(item.preco || 0) *
          Number(item.quantidade || 0)
        );
      },
      0
    );

  const campoDesconto =
    document.getElementById('pdvDesconto');

  let desconto =
    Number(
      campoDesconto
        ? campoDesconto.value
        : 0
    ) || 0;

  if (desconto < 0) {
    desconto = 0;
  }

  if (desconto > subtotal) {
    desconto = subtotal;
  }

  return {
    subtotal: subtotal,
    desconto: desconto,
    total: subtotal - desconto
  };
}


function renderCarrinhoPDV31() {
  const area =
    document.getElementById('pdvCarrinho');

  const subtotalArea =
    document.getElementById('pdvSubtotal');

  const totalArea =
    document.getElementById('pdvTotal');

  const botaoFinalizar =
    document.getElementById('pdvFinalizar');

  if (!area) return;

  const moeda = function(valor) {
    return Number(valor || 0)
      .toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );
  };

  if (!carrinhoPDV31.length) {
    area.innerHTML =
      '<div class="empty-state">Nenhum produto adicionado.</div>';

    if (subtotalArea) {
      subtotalArea.textContent = 'R$ 0,00';
    }

    if (totalArea) {
      totalArea.textContent = 'R$ 0,00';
    }

    if (botaoFinalizar) {
      botaoFinalizar.disabled = true;
    }

    return;
  }

  area.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd.</th>
            <th>Valor</th>
            <th>Total</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          ${
            carrinhoPDV31.map(
              function(item) {
                return `
                  <tr>
                    <td>${item.produto}</td>
                    <td>${item.quantidade}</td>
                    <td>${moeda(item.preco)}</td>
                    <td>
                      ${moeda(
                        Number(item.preco) *
                        Number(item.quantidade)
                      )}
                    </td>
                    <td>
                      <button
                        class="btn-secondary"
                        onclick="alterarQuantidadePDV31('${item.id}', -1)">
                        −
                      </button>

                      <button
                        class="btn-secondary"
                        onclick="alterarQuantidadePDV31('${item.id}', 1)">
                        +
                      </button>

                      <button
                        class="btn-secondary"
                        onclick="removerProdutoPDV31('${item.id}')">
                        🗑️
                      </button>
                    </td>
                  </tr>
                `;
              }
            ).join('')
          }
        </tbody>
      </table>
    </div>
  `;

  const totais =
    calcularTotaisPDV31();

  if (subtotalArea) {
    subtotalArea.textContent =
      moeda(totais.subtotal);
  }

  if (totalArea) {
    totalArea.textContent =
      moeda(totais.total);
  }

  if (botaoFinalizar) {
    botaoFinalizar.disabled = false;
  }
}


function abrirScannerPDV31() {
  const scannerUrl =
    window.VNNUS_CONFIG &&
    window.VNNUS_CONFIG.SCANNER_URL;

  if (!scannerUrl) {
    alert(
      'Configure SCANNER_URL em js/config.js.'
    );
    return;
  }

  const retorno =
    window.location.origin +
    window.location.pathname +
    '?gtin={CODE}#pdv';

  window.location.href =
    scannerUrl +
    '?return=' +
    encodeURIComponent(retorno);
}


function abrirFinalizacaoPDV31() {
  if (!carrinhoPDV31.length) return;

  const modal =
    document.getElementById(
      'modalFinalizarVenda'
    );

  const totalModal =
    document.getElementById(
      'pdvModalTotal'
    );

  const totais =
    calcularTotaisPDV31();

  if (totalModal) {
    totalModal.textContent =
      Number(totais.total)
      .toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );
  }

  const mensagem =
    document.getElementById(
      'pdvMensagemFinal'
    );

  if (mensagem) {
    mensagem.textContent = '';
  }

  if (modal) {
    modal.classList.add('aberto');
  }
}


function fecharFinalizacaoPDV31() {
  const modal =
    document.getElementById(
      'modalFinalizarVenda'
    );

  if (modal) {
    modal.classList.remove('aberto');
  }
}


async function confirmarVendaPDV31() {
  const pagamento =
    document.getElementById(
      'pdvPagamento'
    );

  const cliente =
    document.getElementById(
      'pdvCliente'
    );

  const observacao =
    document.getElementById(
      'pdvObservacao'
    );

  const mensagem =
    document.getElementById(
      'pdvMensagemFinal'
    );

  const botao =
    document.getElementById(
      'pdvConfirmarVenda'
    );

  if (
    !pagamento ||
    !pagamento.value
  ) {
    if (mensagem) {
      mensagem.textContent =
        'Selecione a forma de pagamento.';
    }
    return;
  }

  if (!carrinhoPDV31.length) {
    if (mensagem) {
      mensagem.textContent =
        'O carrinho está vazio.';
    }
    return;
  }

  const totais =
    calcularTotaisPDV31();

  const dadosVenda = {
    CLIENTE:
      (
        cliente &&
        cliente.value.trim()
      ) ||
      'Consumidor Final',

    FORMA_PAGAMENTO:
      pagamento.value,

    DESCONTO_GERAL:
      totais.desconto,

    OBSERVACAO:
      observacao
        ? observacao.value.trim()
        : '',

    ITENS:
      carrinhoPDV31.map(
        function(item) {
          return {
            ID_PRODUTO: item.id,
            QUANTIDADE:
              Number(
                item.quantidade || 0
              ),
            DESCONTO: 0
          };
        }
      )
  };

  try {
    if (mensagem) {
      mensagem.textContent =
        'Finalizando venda...';
    }

    if (botao) {
      botao.disabled = true;
    }

    const resposta =
      await VNNUS_API.finalizarVenda(
        dadosVenda
      );

    if (
      !resposta ||
      resposta.sucesso !== true
    ) {
      throw new Error(
        resposta &&
        resposta.erro
          ? resposta.erro
          : 'A venda não pôde ser finalizada.'
      );
    }

    if (mensagem) {
      mensagem.textContent =
        '✅ ' +
        (
          resposta.mensagem ||
          'Venda finalizada com sucesso!'
        ) +
        ' Nº ' +
        (
          resposta.idVenda ||
          ''
        );
    }

    const comprovante = criarDadosComprovantePDV32(
      resposta,
      dadosVenda,
      totais,
      carrinhoPDV31
    );

    ultimoComprovantePDV32 = comprovante;

    carrinhoPDV31 = [];

    const campoDesconto =
      document.getElementById(
        'pdvDesconto'
      );

    if (campoDesconto) {
      campoDesconto.value = '0';
    }

    renderCarrinhoPDV31();

    fecharFinalizacaoPDV31();
    abrirComprovantePDV32(comprovante);

    definirStatusPDV31(
      '✅ Venda ' +
      (
        resposta.idVenda ||
        ''
      ) +
      ' finalizada com sucesso.'
    );
  }

  catch (erro) {
    console.error(
      'Finalização:',
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


function criarDadosComprovantePDV32(
  resposta,
  dadosVenda,
  totais,
  itensCarrinho
) {
  const agora = new Date();

  return {
    idVenda:
      resposta.idVenda ||
      resposta.ID_VENDA ||
      '',

    data:
      resposta.data ||
      resposta.DATA ||
      agora.toLocaleDateString('pt-BR'),

    hora:
      resposta.hora ||
      resposta.HORA ||
      agora.toLocaleTimeString(
        'pt-BR',
        {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }
      ),

    cliente:
      dadosVenda.CLIENTE ||
      'Consumidor Final',

    formaPagamento:
      dadosVenda.FORMA_PAGAMENTO ||
      '',

    observacao:
      dadosVenda.OBSERVACAO ||
      '',

    subtotal:
      Number(totais.subtotal || 0),

    desconto:
      Number(totais.desconto || 0),

    total:
      Number(totais.total || 0),

    itens:
      itensCarrinho.map(
        function(item) {
          return {
            produto:
              item.produto ||
              item.PRODUTO ||
              '',
            gtin:
              item.gtin ||
              item.GTIN ||
              '',
            quantidade:
              Number(item.quantidade || 0),
            valor:
              Number(item.preco || 0),
            total:
              Number(item.preco || 0) *
              Number(item.quantidade || 0)
          };
        }
      )
  };
}


function abrirComprovantePDV32(dados) {
  const modal =
    document.getElementById(
      'modalComprovanteVenda'
    );

  const area =
    document.getElementById(
      'pdvComprovante'
    );

  const mensagem =
    document.getElementById(
      'pdvMensagemComprovante'
    );

  if (!modal || !area || !dados) {
    return;
  }

  if (mensagem) {
    mensagem.textContent = '';
  }

  area.innerHTML =
    montarHtmlComprovantePDV32(dados);

  modal.classList.add('aberto');
}


function fecharComprovantePDV32() {
  const modal =
    document.getElementById(
      'modalComprovanteVenda'
    );

  if (modal) {
    modal.classList.remove('aberto');
  }
}


function novaVendaPDV32() {
  fecharComprovantePDV32();

  const campo =
    document.getElementById('pdvGTIN');

  const cliente =
    document.getElementById('pdvCliente');

  const pagamento =
    document.getElementById('pdvPagamento');

  const observacao =
    document.getElementById('pdvObservacao');

  if (cliente) {
    cliente.value = '';
  }

  if (pagamento) {
    pagamento.value = '';
  }

  if (observacao) {
    observacao.value = '';
  }

  if (campo) {
    campo.value = '';
    campo.focus();
  }

  definirStatusPDV31(
    'Nova venda iniciada. Aguardando produto.'
  );
}


async function compartilharComprovantePDV32() {
  const mensagem =
    document.getElementById(
      'pdvMensagemComprovante'
    );

  if (!ultimoComprovantePDV32) {
    if (mensagem) {
      mensagem.textContent =
        'Nenhum comprovante disponível.';
    }
    return;
  }

  const texto =
    montarTextoComprovantePDV32(
      ultimoComprovantePDV32
    );

  try {
    if (
      navigator.share
    ) {
      await navigator.share({
        title:
          'Comprovante ' +
          (
            ultimoComprovantePDV32.idVenda ||
            'VNNUS'
          ),
        text: texto
      });

      if (mensagem) {
        mensagem.textContent =
          '✅ Comprovante compartilhado.';
      }

      return;
    }

    if (
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      await navigator.clipboard.writeText(texto);

      if (mensagem) {
        mensagem.textContent =
          '✅ Comprovante copiado. Agora você pode colar no WhatsApp.';
      }

      return;
    }

    throw new Error(
      'Compartilhamento não disponível neste aparelho.'
    );
  }
  catch (erro) {
    if (
      erro &&
      erro.name === 'AbortError'
    ) {
      return;
    }

    console.error(
      'Comprovante:',
      erro
    );

    if (mensagem) {
      mensagem.textContent =
        'Não foi possível compartilhar: ' +
        erro.message;
    }
  }
}


function montarHtmlComprovantePDV32(dados) {
  const moeda = function(valor) {
    return Number(valor || 0)
      .toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );
  };

  const escapar = function(valor) {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const itens =
    (dados.itens || [])
    .map(
      function(item) {
        return `
          <div
            style="
              padding:10px 0;
              border-bottom:1px solid var(--border);
            ">
            <strong>${escapar(item.produto)}</strong>
            <div style="color:var(--muted);font-size:13px;">
              ${item.quantidade} x ${moeda(item.valor)}
              &nbsp; • &nbsp;
              ${moeda(item.total)}
            </div>
          </div>
        `;
      }
    )
    .join('');

  return `
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:24px;font-weight:800;">
        VNNUS
      </div>
      <div style="color:var(--muted);font-size:12px;">
        COMPROVANTE DE VENDA
      </div>
    </div>

    <div><strong>Venda:</strong> ${escapar(dados.idVenda)}</div>
    <div><strong>Data:</strong> ${escapar(dados.data)} ${escapar(dados.hora)}</div>
    <div><strong>Cliente:</strong> ${escapar(dados.cliente)}</div>
    <div><strong>Pagamento:</strong> ${escapar(dados.formaPagamento)}</div>

    <div
      style="
        margin-top:15px;
        border-top:1px solid var(--border);
        border-bottom:1px solid var(--border);
      ">
      ${itens}
    </div>

    <div style="margin-top:15px;">
      <div><strong>Subtotal:</strong> ${moeda(dados.subtotal)}</div>
      <div><strong>Desconto:</strong> ${moeda(dados.desconto)}</div>
      <div style="font-size:20px;margin-top:7px;">
        <strong>Total: ${moeda(dados.total)}</strong>
      </div>
    </div>

    ${
      dados.observacao
        ? `
          <div style="margin-top:15px;">
            <strong>Observação:</strong>
            ${escapar(dados.observacao)}
          </div>
        `
        : ''
    }

    <div
      style="
        text-align:center;
        color:var(--muted);
        font-size:12px;
        margin-top:20px;
      ">
      Obrigado pela preferência.
    </div>
  `;
}


function montarTextoComprovantePDV32(dados) {
  const moeda = function(valor) {
    return Number(valor || 0)
      .toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );
  };

  const linhas = [
    'VNNUS',
    'COMPROVANTE DE VENDA',
    '',
    'Venda: ' + (dados.idVenda || ''),
    'Data: ' +
      (dados.data || '') +
      ' ' +
      (dados.hora || ''),
    'Cliente: ' +
      (dados.cliente || 'Consumidor Final'),
    'Pagamento: ' +
      (dados.formaPagamento || ''),
    '',
    'ITENS'
  ];

  (dados.itens || []).forEach(
    function(item) {
      linhas.push(
        item.quantidade +
        'x ' +
        item.produto +
        ' - ' +
        moeda(item.total)
      );
    }
  );

  linhas.push(
    '',
    'Subtotal: ' + moeda(dados.subtotal),
    'Desconto: ' + moeda(dados.desconto),
    'TOTAL: ' + moeda(dados.total)
  );

  if (dados.observacao) {
    linhas.push(
      'Observação: ' +
      dados.observacao
    );
  }

  linhas.push(
    '',
    'Obrigado pela preferência.'
  );

  return linhas.join('\n');
}


function definirStatusPDV31(texto) {
  const status =
    document.getElementById('pdvStatus');

  if (status) {
    status.textContent = texto;
  }
}
