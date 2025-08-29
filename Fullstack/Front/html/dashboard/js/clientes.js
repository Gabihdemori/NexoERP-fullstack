async function carregarClientes() {
const res = await fetch("http://localhost:3000/api/clientes");
const data = await res.json();
const tbody = document.querySelector("#clientes-table tbody");
tbody.innerHTML = "";
data.forEach(cliente => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${cliente.nome}</td>
    <td>${cliente.cnpj || cliente.cpf || ""}</td>
    <td>${cliente.email}</td>
    <td>${cliente.telefone}</td>
  `;
  tbody.appendChild(tr);
});
}

if (window.location.pathname.includes("clientes.html")) {
  carregarClientes();
}