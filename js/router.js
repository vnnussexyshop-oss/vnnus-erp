const VNNUS_ROUTES = {

  dashboard: {
    file: "pages/dashboard.html",
    title: "Dashboard",
    subtitle: "Visão geral da operação"
  },

  produtos: {
    file: "pages/produtos.html",
    title: "Produtos",
    subtitle: "Cadastro e gerenciamento de produtos"
  },

  scanner: {
    file: "pages/scanner.html",
    title: "Scanner",
    subtitle: "Leitura de código de barras"
  },

  estoque: {
    file: "pages/estoque.html",
    title: "Estoque",
    subtitle: "Entradas, saídas e saldo"
  },

  pdv: {
    file: "pages/pdv.html",
    title: "PDV",
    subtitle: "Nova venda"
  },

  vendas: {
    file: "pages/vendas.html",
    title: "Vendas",
    subtitle: "Histórico e comprovantes"
  },

  clientes: {
    file: "pages/clientes.html",
    title: "Clientes",
    subtitle: "Cadastro e histórico"
  },

  financeiro: {
    file: "pages/financeiro.html",
    title: "Financeiro",
    subtitle: "Faturamento, custos e lucro"
  },

  despesas: {
    file: "pages/despesas.html",
    title: "Despesas",
    subtitle: "Contas a pagar e despesas"
  },

  configuracoes: {
    file: "pages/configuracoes.html",
    title: "Configurações",
    subtitle: "Preferências e integrações"
  }

};
async function navigateTo(pageName){
 const r=VNNUS_ROUTES[pageName]||VNNUS_ROUTES.dashboard;
 document.getElementById("pageTitle").textContent=r.title;
 document.getElementById("pageSubtitle").textContent=r.subtitle;
 document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",b.dataset.page===pageName));
 const c=document.getElementById("appContent"); c.innerHTML='<div class="loading-card">Carregando...</div>';
 try{
  const resp=await fetch(r.file,{cache:"no-store"}); if(!resp.ok)throw new Error("Não foi possível carregar "+r.file);
  c.innerHTML=await resp.text();
  [...c.querySelectorAll("script")].forEach(s=>{const n=document.createElement("script");n.textContent=s.textContent;document.body.appendChild(n);n.remove()});
  if(typeof window["init_"+pageName]==="function") await window["init_"+pageName]();
  history.replaceState(null,"","#"+pageName); closeMobileMenu();
 }catch(e){c.innerHTML='<div class="empty-state"><strong>Erro ao carregar a página.</strong><p style="margin-top:8px">'+e.message+'</p></div>'}
}
