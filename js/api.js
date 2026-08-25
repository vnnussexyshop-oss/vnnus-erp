const VNNUS_API = {

  /* =====================================================
     JSONP
  ===================================================== */

  jsonp(parametros = {}) {

    return new Promise(
      function(resolve, reject) {

        const apiUrl =
          window.VNNUS_CONFIG &&
          window.VNNUS_CONFIG.API_URL;


        if (!apiUrl) {

          reject(
            new Error(
              'URL da API não configurada.'
            )
          );

          return;

        }


        const callback =
          'vnnusCallback_' +
          Date.now() +
          '_' +
          Math.floor(
            Math.random() *
            1000000
          );


        const script =
          document.createElement(
            'script'
          );


        const params =
          new URLSearchParams();


        params.set(
          'api',
          '1'
        );


        Object.keys(
          parametros
        )
        .forEach(
          function(chave) {

            const valor =
              parametros[
                chave
              ];


            if (
              valor !== undefined &&
              valor !== null &&
              valor !== ''
            ) {

              params.set(
                chave,
                String(
                  valor
                )
              );

            }

          }
        );


        params.set(
          'callback',
          callback
        );


        let finalizado =
          false;


        function limpar() {

          if (
            script &&
            script.parentNode
          ) {

            script.parentNode
              .removeChild(
                script
              );

          }


          try {

            delete window[
              callback
            ];

          }

          catch (erro) {

            window[
              callback
            ] = undefined;

          }

        }


        const timeout =
          setTimeout(
            function() {

              if (
                finalizado
              ) {
                return;
              }


              finalizado =
                true;


              limpar();


              reject(
                new Error(
                  'A API demorou muito para responder.'
                )
              );

            },
            30000
          );


        window[
          callback
        ] =
          function(resposta) {

            if (
              finalizado
            ) {
              return;
            }


            finalizado =
              true;


            clearTimeout(
              timeout
            );


            limpar();


            if (!resposta) {

              reject(
                new Error(
                  'Resposta vazia da API.'
                )
              );

              return;

            }


            if (
              resposta.sucesso ===
              false
            ) {

              reject(
                new Error(
                  resposta.erro ||
                  'Erro retornado pela API.'
                )
              );

              return;

            }


            resolve(
              resposta
            );

          };


        script.onerror =
          function() {

            if (
              finalizado
            ) {
              return;
            }


            finalizado =
              true;


            clearTimeout(
              timeout
            );


            limpar();


            reject(
              new Error(
                'Não foi possível conectar à API VNNUS.'
              )
            );

          };


        script.src =
          apiUrl +
          '?' +
          params.toString() +
          '&_=' +
          Date.now();


        document.body
          .appendChild(
            script
          );

      }
    );

  },


  /* =====================================================
     PING
  ===================================================== */

  async ping() {

    return await this.jsonp({

      acao:
        'ping'

    });

  },


  /* =====================================================
     PRODUTOS
  ===================================================== */

  async produtos() {

    const resposta =
      await this.jsonp({

        acao:
          'produtos'

      });


    return (
      resposta.produtos ||
      []
    )
    .map(
      function(produto) {

        return {

          id:
            produto.ID_PRODUTO ||
            '',

          gtin:
            String(
              produto.GTIN ||
              ''
            )
            .trim(),

          produto:
            produto.PRODUTO ||
            '',

          categoria:
            produto.CATEGORIA ||
            '',

          marca:
            produto.MARCA ||
            '',

          fornecedor:
            produto.FORNECEDOR ||
            '',

          custo:
            Number(
              produto.CUSTO ||
              0
            ),

          preco:
            Number(
              produto.PRECO_VENDA ||
              0
            ),

          estoqueMinimo:
            Number(
              produto.ESTOQUE_MINIMO ||
              0
            ),

          ativo:
            produto.ATIVO ||
            '',

          foto:
            produto.FOTO ||
            '',

          estoque:
            0,

          status:
            ''

        };

      }
    );

  },


  /* =====================================================
     ESTOQUE
  ===================================================== */

  async estoque() {

    const resposta =
      await this.jsonp({

        acao:
          'estoque'

      });


    return (
      resposta.estoque ||
      []
    );

  },


  /* =====================================================
     PRODUTOS + ESTOQUE
  ===================================================== */

  async produtosComEstoque() {

    const resultados =
      await Promise.all([

        this.produtos(),

        this.estoque()

      ]);


    const produtos =
      resultados[0];


    const estoque =
      resultados[1];


    const mapaEstoque =
      new Map();


    estoque.forEach(
      function(item) {

        mapaEstoque.set(

          String(
            item.ID_PRODUTO ||
            ''
          ),

          item

        );

      }
    );


    return produtos.map(
      function(produto) {

        const itemEstoque =
          mapaEstoque.get(
            String(
              produto.id
            )
          );


        return {

          ...produto,


          estoque:
            itemEstoque
              ? Number(
                  itemEstoque.QTD_ATUAL ||
                  0
                )
              : 0,


          estoqueMinimo:
            itemEstoque
              ? Number(
                  itemEstoque.ESTOQUE_MINIMO ||
                  produto.estoqueMinimo ||
                  0
                )
              : produto.estoqueMinimo,


          status:
            itemEstoque
              ? (
                  itemEstoque.STATUS ||
                  ''
                )
              : 'SEM ESTOQUE'

        };

      }
    );

  },


  /* =====================================================
     PRODUTO POR GTIN
  ===================================================== */

  async produtoPorGTIN(
    gtin
  ) {

    const codigo =
      String(
        gtin ||
        ''
      )
      .trim();


    if (!codigo) {

      return null;

    }


    const produtos =
      await this
        .produtosComEstoque();


    return (
      produtos.find(
        function(produto) {

          return (
            String(
              produto.gtin ||
              ''
            )
            .trim() ===
            codigo
          );

        }
      ) ||
      null
    );

  },


  /* =====================================================
     DASHBOARD
  ===================================================== */

  async dashboard() {

    const resposta =
      await this.jsonp({

        acao:
          'dashboard'

      });


    const dados =
      resposta.dashboard ||
      {};


    return {

      vendasHoje:
        Number(
          dados.faturamentoHoje ||
          0
        ),


      pedidosHoje:
        Number(
          dados.pedidosHoje ||
          0
        ),


      produtos:
        Number(
          dados.totalProdutos ||
          0
        ),


      estoqueBaixo:
        Number(
          dados.estoqueBaixo ||
          0
        ),


      semEstoque:
        Number(
          dados.semEstoque ||
          0
        ),


      estoqueCritico:
        Number(
          dados.estoqueBaixo ||
          0
        ) +
        Number(
          dados.semEstoque ||
          0
        ),


      lucroHoje:
        Number(
          dados.lucroHoje ||
          0
        ),


      ticketMedio:
        Number(
          dados.ticketMedioHoje ||
          0
        ),


      itensVendidos:
        Number(
          dados.produtosVendidosHoje ||
          0
        ),


      produtoMaisVendido:
        dados.produtoMaisVendido ||
        {

          produto:
            '-',

          quantidade:
            0

        },


      ultimasVendas:
        dados.ultimasVendas ||
        []

    };

  },


  /* =====================================================
     FINALIZAR VENDA
  ===================================================== */

  async finalizarVenda(
    dadosVenda
  ) {

    return await this.jsonp({

      acao:
        'finalizar_venda',


      dados:
        JSON.stringify(
          dadosVenda
        )

    });

  },


  /* =====================================================
     HISTÓRICO DE VENDAS
  ===================================================== */

  async historicoVendas() {

    const resposta =
      await this.jsonp({

        acao:
          'historico_vendas'

      });


    return (
      resposta.vendas ||
      []
    );

  },


  /* =====================================================
     DETALHES DA VENDA
  ===================================================== */

  async detalhesVenda(
    idVenda
  ) {

    const resposta =
      await this.jsonp({

        acao:
          'detalhes_venda',


        idVenda:
          idVenda

      });


    return {

      venda:
        resposta.venda ||
        null,


      itens:
        resposta.itens ||
        []

    };

  },


  /* =====================================================
     CANCELAR VENDA
  ===================================================== */

  async cancelarVenda(
    idVenda,
    motivo
  ) {

    return await this.jsonp({

      acao:
        'cancelar_venda',


      idVenda:
        idVenda,


      motivo:
        motivo

    });

  },


  /* =====================================================
     MOVIMENTAR ESTOQUE
  ===================================================== */

  async registrarMovimentacaoEstoque(
    dadosMovimentacao
  ) {

    return await this.jsonp({

      acao:
        'registrar_movimentacao_estoque',


      dados:
        JSON.stringify(
          dadosMovimentacao
        )

    });

  },


  /* =====================================================
     MOVIMENTAÇÕES DE ESTOQUE
  ===================================================== */

  async movimentacoesEstoque(
    limite = 50
  ) {

    const resposta =
      await this.jsonp({

        acao:
          'movimentacoes_estoque',


        limite:
          limite

      });


    return (
      resposta.movimentacoes ||
      []
    );

  },


  /* =====================================================
     CLIENTES
  ===================================================== */

  async clientes() {

    const resposta =
      await this.jsonp({

        acao:
          'clientes'

      });


    return (
      resposta.clientes ||
      []
    );

  },


  /* =====================================================
     CLIENTE POR ID
  ===================================================== */

  async clientePorId(
    idCliente
  ) {

    const resposta =
      await this.jsonp({

        acao:
          'cliente_id',


        idCliente:
          idCliente

      });


    /*
      Mantemos o formato completo
      porque clientes.js já aceita:
      resposta.cliente OU cliente direto.
    */

    return resposta;

  },


  /* =====================================================
     SALVAR CLIENTE
  ===================================================== */

  async salvarCliente(
    dadosCliente
  ) {

    return await this.jsonp({

      acao:
        'salvar_cliente',


      dados:
        JSON.stringify(
          dadosCliente
        )

    });

  },


  /* =====================================================
     HISTÓRICO DO CLIENTE
  ===================================================== */

  async historicoCliente(
    idCliente
  ) {

    const resposta =
      await this.jsonp({

        acao:
          'historico_cliente',


        idCliente:
          idCliente

      });


    /*
      Compatibilidade entre API 1.7
      e API 1.8.

      Clientes 3.6 espera:

      produtoFavorito: {
        produto,
        quantidade
      }

      Caso a API envie produtoFavorito
      e produtoFavoritoQtd separados,
      normalizamos aqui.
    */

    if (
      resposta &&
      resposta.resumo
    ) {

      const resumo =
        resposta.resumo;


      if (
        typeof resumo.produtoFavorito ===
        'string'
      ) {

        resumo.produtoFavorito = {

          produto:
            resumo.produtoFavorito ||
            '-',


          quantidade:
            Number(
              resumo.produtoFavoritoQtd ||
              0
            )

        };

      }


      else if (
        !resumo.produtoFavorito
      ) {

        resumo.produtoFavorito = {

          produto:
            '-',


          quantidade:
            Number(
              resumo.produtoFavoritoQtd ||
              0
            )

        };

      }

    }


    return resposta;

  },


  /* =====================================================
     CONSULTAR CEP
  ===================================================== */

  async consultarCep(
    cep
  ) {

    return await this.jsonp({

      acao:
        'consultar_cep',


      cep:
        cep

    });

  },


  /* =====================================================
     FINANCEIRO 2.0
  ===================================================== */

  async financeiro(
    filtros = {}
  ) {

    const parametros = {

      acao:
        'financeiro',


      tipo:
        filtros.tipo ||
        'MES'

    };


    if (
      filtros.dataInicio
    ) {

      parametros.dataInicio =
        filtros.dataInicio;

    }


    if (
      filtros.dataFim
    ) {

      parametros.dataFim =
        filtros.dataFim;

    }


    const resposta =
      await this.jsonp(
        parametros
      );


    return resposta;

  }

};


/* =====================================================
   FIM
   VNNUS API FRONT-END
   FINANCEIRO 2.0 + CLIENTES 3.6
===================================================== */
