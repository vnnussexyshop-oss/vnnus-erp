window.init_produtos = async function() {
  const tbody = document.getElementById('produtoTabela');
  const busca = document.getElementById('produtoBusca');
  const status = document.getElementById('produtoStatus');

  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7">Carregando produtos reais...</td></tr>';

  try {
    const produtos = await VNNUS_API.produtosComEstoque();

    if (status) status.textContent = produtos.length + ' produto(s) carregado(s)';

    const moeda = valor =>
      Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

    function badge(statusProduto) {
      const s = String(statusProduto || '').trim().toUpperCase();

      if (s === 'OK') {
        return '<span class="status-badge status-ok">OK</span>';
      }

      if (s === 'ESTOQUE BAIXO') {
        return '<span class="status-badge" style="background:rgba(255,184,77,.12);color:#ffc266">ESTOQUE BAIXO</span>';
      }

      return '<span class="status-badge status-danger">SEM ESTOQUE</span>';
    }

    function render(lista) {
      if (!lista.length) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum produto encontrado.</td></tr>';
        return;
      }

      tbody.innerHTML = lista.map(item => `
        <tr>
          <td><strong>${item.id}</strong></td>
          <td>${item.gtin}</td>
          <td>${item.produto}</td>
          <td>${item.categoria}</td>
          <td>${moeda(item.preco)}</td>
          <td>${item.estoque}</td>
          <td>${badge(item.status)}</td>
        </tr>
      `).join('');
    }

    render(produtos);

    if (busca) {
      busca.oninput = function() {
        const termo = busca.value.trim().toLowerCase();

        render(
          produtos.filter(item =>
            String(item.produto).toLowerCase().includes(termo) ||
            String(item.gtin).toLowerCase().includes(termo)
          )
        );
      };
    }
  }
  catch (erro) {
    console.error('Produtos:', erro);
    tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar produtos: ' + erro.message + '</td></tr>';
    if (status) status.textContent = 'Erro de comunicação com a API';
  }
};
