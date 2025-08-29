const API_URL = "http://localhost:3000/api/vendas";

async function carregarVendas() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const total = Array.isArray(data) && data.length > 0 ? data[0].total : 0;
  document.getElementById("daily-sales-value").innerText =
    total !== undefined && total !== null
      ? total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "0,00";
}

async function carregarEstoque() {
  const res = await fetch("http://localhost:3000/api/produtos");
  const data = await res.json();
  const totalEstoque = Array.isArray(data)
    ? data.reduce((soma, produto) => soma + (produto.estoque || 0), 0)
    : 0;
  document.getElementById("stock-products-value").innerText =
    totalEstoque.toLocaleString('pt-BR');
}
  
carregarVendas();
carregarEstoque();