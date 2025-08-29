async function carregarProdutos() {
    const response = await fetch("http://localhost:3000/api/produtos");
    const produtos = await response.json();

    const tabela = document.querySelector('#lista-produtos tbody');
    tabela.innerHTML = "";

    produtos.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.descricao}</td>
            <td>${produto.preco}</td>
            <td>${produto.estoque}</td>
            <td><span class="status-badge ${produto.status ? 'active' : 'inactive'}">${produto.status ? 'Ativo' : 'Inativo'}</span></td>
            <td class="actions">
                <a href="editar_produto.html?id=${produto.id}" class="edit">Editar</a>
                <a href="excluir_produto.html?id=${produto.id}" class="delete">Excluir</a>
            </td>
        `;
        tabela.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});