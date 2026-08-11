const VNNUS_API = {
  jsonp(parametros = {}) {
    return new Promise((resolve, reject) => {
      const apiUrl = window.VNNUS_CONFIG && window.VNNUS_CONFIG.API_URL;
      if (!apiUrl) {
        reject(new Error('URL da API não configurada em js/config.js.'));
        return;
      }

      const callback = 'vnnusCallback_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
      const script = document.createElement('script');
      const params = new URLSearchParams({ api: '1', ...parametros, callback });
      let finalizado = false;

      const limpar = () => {
        if (script.parentNode) script.parentNode.removeChild(script);
        try { delete window[callback]; } catch (_) { window[callback] = undefined; }
      };

      const timeout = setTimeout(() => {
        if (finalizado) return;
        finalizado = true;
        limpar();
        reject(new Error('A API demorou muito para responder.'));
      }, 15000);

      window[callback] = resposta => {
        if (finalizado) return;
        finalizado = true;
        clearTimeout(timeout);
        limpar();

        if (!resposta) {
          reject(new Error('Resposta vazia da API.'));
          return;
        }

        if (resposta.sucesso === false) {
          reject(new Error(resposta.erro || 'Erro retornado pela API VNNUS.'));
          return;
        }

        resolve(resposta);
      };

      script.onerror = () => {
        if (finalizado) return;
        finalizado = true;
        clearTimeout(timeout);
        limpar();
        reject(new Error('Não foi possível conectar à API VNNUS.'));
      };

      script.src = apiUrl + '?' + params.toString();
      document.body.appendChild(script);
    });
  },

  async ping() {
    return await this.jsonp({ acao: 'ping' });
  },

  async produtos() {
    const resposta = await this.jsonp({ acao: 'produtos' });
    return (resposta.produtos || []).map(produto => ({
      id: produto.ID_PRODUTO || '',
      gtin: String(produto.GTIN || ''),
      produto: produto.PRODUTO || '',
      categoria: produto.CATEGORIA || '',
      marca: produto.MARCA || '',
      fornecedor: produto.FORNECEDOR || '',
      custo: Number(produto.CUSTO || 0),
      preco: Number(produto.PRECO_VENDA || 0),
      estoqueMinimo: Number(produto.ESTOQUE_MINIMO || 0),
      ativo: produto.ATIVO || '',
      foto: produto.FOTO || '',
      estoque: 0,
      status: ''
    }));
  },

  async estoque() {
    const resposta = await this.jsonp({ acao: 'estoque' });
    return resposta.estoque || [];
  },

  async produtosComEstoque() {
    const [produtos, estoque] = await Promise.all([this.produtos(), this.estoque()]);
    const mapa = new Map();
    estoque.forEach(item => mapa.set(String(item.ID_PRODUTO || ''), item));

    return produtos.map(produto => {
      const item = mapa.get(String(produto.id));
      return {
        ...produto,
        estoque: item ? Number(item.QTD_ATUAL || 0) : 0,
        estoqueMinimo: item ? Number(item.ESTOQUE_MINIMO || produto.estoqueMinimo || 0) : produto.estoqueMinimo,
        status: item ? (item.STATUS || '') : 'SEM ESTOQUE'
      };
    });
  },

  async produtoPorGTIN(gtin) {
    const codigo = String(gtin || '').trim();
    if (!codigo) return null;

    const resposta = await this.jsonp({
      acao: 'produto_gtin',
      gtin: codigo
    });

    if (!resposta.encontrado) return null;

    const produto = resposta.produto;
    return {
      id: produto.ID_PRODUTO || '',
      gtin: String(produto.GTIN || ''),
      produto: produto.PRODUTO || '',
      categoria: produto.CATEGORIA || '',
      marca: produto.MARCA || '',
      fornecedor: produto.FORNECEDOR || '',
      custo: Number(produto.CUSTO || 0),
      preco: Number(produto.PRECO_VENDA || 0),
      ativo: produto.ATIVO || '',
      estoque: Number(produto.ESTOQUE || 0),
      status: produto.STATUS || ''
    };
  },

  async dashboard() {
    const resposta = await this.jsonp({ acao: 'dashboard' });
    const dados = resposta.dashboard || {};

    return {
      vendasHoje: Number(dados.faturamentoHoje || 0),
      pedidosHoje: Number(dados.pedidosHoje || 0),
      produtos: Number(dados.totalProdutos || 0),
      estoqueBaixo: Number(dados.estoqueBaixo || 0),
      semEstoque: Number(dados.semEstoque || 0),
      estoqueCritico: Number(dados.estoqueBaixo || 0) + Number(dados.semEstoque || 0),
      lucroHoje: Number(dados.lucroHoje || 0),
      ticketMedio: Number(dados.ticketMedioHoje || 0),
      itensVendidos: Number(dados.produtosVendidosHoje || 0),
      produtoMaisVendido: dados.produtoMaisVendido || { produto: '-', quantidade: 0 },
      ultimasVendas: dados.ultimasVendas || []
    };
  }
};
