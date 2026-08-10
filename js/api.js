const VNNUS_API={
  async dashboard(){return{vendasHoje:79.80,pedidosHoje:2,produtos:3,estoqueCritico:2,lucroHoje:79.80,ticketMedio:39.90,itensVendidos:2,semEstoque:2}},
  async produtos(){return[
    {id:"VNN000001",gtin:"7891234567890",produto:"Bullet Vibratório Teste",categoria:"Vibradores",preco:29.90,estoque:0,status:"SEM ESTOQUE"},
    {id:"VNN000002",gtin:"7891234567891",produto:"Bullet Teste 2",categoria:"Vibradores",preco:29.90,estoque:0,status:"SEM ESTOQUE"},
    {id:"VNN000003",gtin:"7891234567892",produto:"Produto Teste 3",categoria:"Vibradores",preco:39.90,estoque:8,status:"OK"}
  ]}
};
