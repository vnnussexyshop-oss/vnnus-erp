window.init_scanner = function() {
  const botao = document.getElementById('openScanner');
  if (!botao) return;

  botao.onclick = function() {
    const scannerUrl = window.VNNUS_CONFIG && window.VNNUS_CONFIG.SCANNER_URL;

    if (!scannerUrl) {
      alert('A URL do Scanner ainda não foi configurada em js/config.js.');
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
};
