window.init_dashboard = async function() {
  const status = document.getElementById('dashStatus');

  try {
    if (status) status.textContent = 'Atualizando...';

    const dados = await VNNUS_API.dashboard();

    const moeda = valor =>
      Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

    document.getElementById('dashVendasHoje').textContent = moeda(dados.vendasHoje);
    document.getElementById('dashPedidosHoje').textContent = dados.pedidosHoje;
    document.getElementById('dashProdutos').textContent = dados.produtos;
    document.getElementById('dashEstoqueCritico').textContent = dados.estoqueCritico;
    document.getElementById('dashLucroHoje').textContent = moeda(dados.lucroHoje);
    document.getElementById('dashTicketMedio').textContent = moeda(dados.ticketMedio);
    document.getElementById('dashItensVendidos').textContent = dados.itensVendidos;
    document.getElementById('dashSemEstoque').textContent = dados.semEstoque;

    const mais = dados.produtoMaisVendido || {};
    const nome = document.getElementById('dashMaisVendidoNome');
    const qtd = document.getElementById('dashMaisVendidoQtd');

    if (nome) nome.textContent = mais.produto || 'Nenhum produto vendido hoje';
    if (qtd) qtd.textContent = Number(mais.quantidade || 0) ? mais.quantidade + ' unidade(s)' : '';

    if (status) status.textContent = 'Dados reais atualizados';
  }
  catch (erro) {
    console.error('Dashboard:', erro);
    if (status) status.textContent = 'Erro: ' + erro.message;
  }
};
