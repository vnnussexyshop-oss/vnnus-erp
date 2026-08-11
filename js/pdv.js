let carrinhoPDV21 = [];

window.init_pdv = async function() {
  const campo = document.getElementById('pdvGTIN');
  const buscar = document.getElementById('pdvBuscar');
  const scanner = document.getElementById('pdvScanner');

  const params = new URLSearchParams(window.location.search);
  const gtin = params.get('gtin');

  if (campo && gtin) {
    campo.value = gtin;
    await buscarProdutoPDV21(gtin);

    history.replaceState(
      null,
      '',
      window.location.origin +
      window.location.pathname +
      '#pdv'
    );
  }

  if (buscar && campo) {
    buscar.onclick = () => buscarProdutoPDV21(campo.value);

    campo.onkeydown = evento => {
      if (evento.key === 'Enter') {
        evento.preventDefault();
        buscarProdutoPDV21(campo.value);
      }
    };
  }

  if (scanner) {
    scanner.onclick = function() {
      const scannerUrl =
        window.VNNUS_CONFIG &&
        window.VNNUS_CONFIG.SCANNER_URL;

      if (!scannerUrl) {
        alert('Configure SCANNER_URL em js/config.js.');
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
    };
  }

  renderCarrinhoPDV21();
};

async function buscarProdutoPDV21(gtin) {
  const codigo = String(gtin || '').trim();
  const status = document.getElementById('pdvStatus');

  if (!codigo) {
    if (status) status.textContent = 'Digite ou bipe um GTIN.';
    return;
  }

  if (status) status.textContent = 'Buscando produto...';

  try {
    const produto = await VNNUS_API.produtoPorGTIN(codigo);

    if (!produto) {
      if (status) status.textContent = 'Produto não encontrado.';
      return;
    }

    if (Number(produto.estoque || 0) <= 0) {
      if (status) status.textContent = produto.produto + ' está sem estoque.';
      return;
    }

    adicionarProdutoPDV21(produto);

    if (status) status.textContent = '✅ ' + produto.produto + ' adicionado.';

    const campo = document.getElementById('pdvGTIN');
    if (campo) {
      campo.value = '';
      campo.focus();
    }
  }
  catch (erro) {
    console.error('PDV:', erro);
    if (status) status.textContent = 'Erro: ' + erro.message;
  }
}

function adicionarProdutoPDV21(produto) {
  const existente = carrinhoPDV21.find(item => item.id === produto.id);

  if (existente) {
    if (existente.quantidade + 1 > Number(produto.estoque || 0)) {
      alert('Estoque disponível: ' + produto.estoque);
      return;
    }
    existente.quantidade++;
  }
  else {
    carrinhoPDV21.push({
      ...produto,
      quantidade: 1
    });
  }

  renderCarrinhoPDV21();
}

function renderCarrinhoPDV21() {
  const area = document.getElementById('pdvCarrinho');
  const totalArea = document.getElementById('pdvTotal');

  if (!area) return;

  if (!carrinhoPDV21.length) {
    area.innerHTML = '<div class="empty-state">Nenhum produto adicionado.</div>';
    if (totalArea) totalArea.textContent = 'R$ 0,00';
    return;
  }

  const moeda = valor =>
    Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  area.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd.</th>
            <th>Valor</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${carrinhoPDV21.map(item => `
            <tr>
              <td>${item.produto}</td>
              <td>${item.quantidade}</td>
              <td>${moeda(item.preco)}</td>
              <td>${moeda(item.preco * item.quantidade)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const total = carrinhoPDV21.reduce(
    (soma, item) => soma + Number(item.preco || 0) * Number(item.quantidade || 0),
    0
  );

  if (totalArea) totalArea.textContent = moeda(total);
}
