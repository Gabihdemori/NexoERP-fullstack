async function carregarEstoque() {
    let data = [];

    try {
        const response = await fetch("http://localhost:3000/api/produtos");
        data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        return;
    }

    const tabela = document.querySelector('.table-container tbody');
    tabela.innerHTML = "";

    data.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.descricao}</td>
            <td>${produto.estoque}</td>
            <td>${produto.preco.toFixed(2)}</td>
            <td>${(produto.preco * produto.estoque).toFixed(2)}</td>
            <td><span class="status-badge ${produto.status ? 'active' : 'inactive'}">${produto.status ? 'Ativo' : 'Inativo'}</span></td>
            <td class="actions">
                <a href="editar_produto.html?id=${produto.id}" class="edit">Editar</a>
                <a href="excluir_produto.html?id=${produto.id}" class="delete">Excluir</a>
            </td>
        `;
        tabela.appendChild(row);
    });

    const totalItens = data.reduce((sum, produto) => sum + produto.estoque, 0);
    const valorTotal = data.reduce((sum, produto) => sum + produto.estoque * produto.preco, 0);
    const itensBaixoEstoque = data.filter(produto => produto.estoque < 5).length;

    const summaryCards = document.querySelectorAll('.inventory-summary .summary-card .value');
    summaryCards[0].textContent = totalItens;                       
    summaryCards[1].textContent = `R$ ${valorTotal.toFixed(2)}`;     
    summaryCards[2].textContent = itensBaixoEstoque;                 
}

document.addEventListener('DOMContentLoaded', carregarEstoque);
