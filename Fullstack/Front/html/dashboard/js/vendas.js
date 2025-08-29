async function carregarVendas() {
    const res = await fetch("http://localhost:3000/api/vendas");
    const vendas = await res.json();

    const tbody = document.querySelector(".data-table tbody");
    tbody.innerHTML = "";

    vendas.forEach(venda => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${venda.id}</td>
            <td>${new Date(venda.data).toLocaleDateString("pt-BR")}</td>
            <td>${venda.cliente.nome}</td>
            <td> <span class="status-badge ${venda.status === 'Pendente' ? 'inactive' : venda.status === 'Paga' ? 'active' : 'cancelled'}">
    ${venda.status}</span></td>
            <td>${venda.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-edit" onclick="editarVenda(${venda.id})">Editar</button>
                <button class="btn btn-delete" onclick="deletarVenda(${venda.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarVendas();
});