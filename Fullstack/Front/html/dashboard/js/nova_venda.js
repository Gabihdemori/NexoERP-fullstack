document.addEventListener('DOMContentLoaded', async function() {
    const clienteSelect = document.getElementById('cliente');
    const addItemBtn = document.getElementById('add-item');
    const itemsContainer = document.querySelector('.sale-items');
    const descontoInput = document.getElementById('desconto');
    const totalInput = document.getElementById('total');

    let products = [];

    // Carregar clientes
    try {
        const resClientes = await fetch('http://localhost:3000/api/clientes');
        const clientes = await resClientes.json();
        clientes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nome;
            clienteSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao carregar clientes:', err);
    }

    // Carregar produtos
    try {
        const resProdutos = await fetch('http://localhost:3000/api/produtos');
        products = await resProdutos.json();
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }

    // Criar item
    function createItemRow(item = {}) {
        const newItem = document.createElement('div');
        newItem.className = 'item-row';

        newItem.innerHTML = `
            <select class="item-product" required>
                <option value="">Selecione um produto</option>
                ${products.map(p => `
                    <option value="${p.id}" ${p.id === item.produtoId ? 'selected' : ''}>
                        ${p.nome} - R$ ${p.preco.toFixed(2).replace('.', ',')}
                    </option>`).join('')}
            </select>
            <input type="number" class="item-quantity" min="1" value="${item.quantidade || 1}" required>
            <span class="item-total">R$ 0,00</span>
            <button type="button" class="btn btn-secondary remove-item">Remover</button>
        `;
        itemsContainer.appendChild(newItem);
        setupItemEvents(newItem);
        calculateSaleTotal();
    }

    addItemBtn.addEventListener('click', () => createItemRow());

    function setupItemEvents(item) {
        const productSelect = item.querySelector('.item-product');
        const quantityInput = item.querySelector('.item-quantity');
        const totalSpan = item.querySelector('.item-total');
        const removeBtn = item.querySelector('.remove-item');

        const calculateItemTotal = () => {
            const product = products.find(p => p.id == productSelect.value);
            const price = product ? product.preco : 0;
            const quantity = parseInt(quantityInput.value) || 0;
            totalSpan.textContent = `R$ ${(price * quantity).toFixed(2).replace('.', ',')}`;
            calculateSaleTotal();
        };

        productSelect.addEventListener('change', calculateItemTotal);
        quantityInput.addEventListener('input', calculateItemTotal);

        removeBtn.addEventListener('click', () => {
            item.remove();
            calculateSaleTotal();
        });
    }

    function calculateSaleTotal() {
        let subtotal = 0;
        document.querySelectorAll('.item-row').forEach(item => {
            const product = products.find(p => p.id == item.querySelector('.item-product').value);
            const price = product ? product.preco : 0;
            const quantity = parseInt(item.querySelector('.item-quantity').value) || 0;
            subtotal += price * quantity;
        });
        const discount = parseFloat(descontoInput.value) || 0;
        totalInput.value = `R$ ${(subtotal - discount).toFixed(2).replace('.', ',')}`;
    }

    descontoInput.addEventListener('input', calculateSaleTotal);

    // Data atual
    document.getElementById('data').valueAsDate = new Date();

    // Submit
    document.getElementById('sale-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const clienteId = parseInt(clienteSelect.value);
        const usuarioId = 1; // pegar do token se precisar
        const data = document.getElementById('data').value;
        const desconto = parseFloat(descontoInput.value) || 0;
        const observacoes = document.getElementById('observacoes').value;

        const itens = Array.from(document.querySelectorAll('.item-row')).map(item => {
            const prodId = parseInt(item.querySelector('.item-product').value);
            const quantidade = parseInt(item.querySelector('.item-quantity').value);
            const produto = products.find(p => p.id === prodId);
            return {
                produtoId: prodId,
                quantidade,
                precoUnit: produto ? produto.preco : 0
            };
        });

        const total = itens.reduce((acc, i) => acc + i.precoUnit * i.quantidade, 0) - desconto;
        const body = { clienteId, usuarioId, data, total, status: 'Pendente', itens, observacoes };

        try {
            const res = await fetch('http://localhost:3000/api/vendas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await res.json();
            if (res.ok) {
                alert('Venda criada com sucesso!');
                window.location.href = 'vendas.html';
            } else {
                alert('Erro: ' + (result.error || 'Não foi possível criar a venda.'));
            }
        } catch (err) {
            console.error(err);
            alert('Erro de conexão com o servidor.');
        }
    });

    // Criar o primeiro item **após carregar produtos**
    if (products.length > 0) createItemRow();
});
