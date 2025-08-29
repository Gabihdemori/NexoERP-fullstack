
import { checkAuth, setupAccessControl, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupAccessControl();
    
    document.addEventListener('DOMContentLoaded', function() {
    // Destacar item do menu ativo
    highlightActiveMenu();
    
    // Configurar formulários
    setupForms();
    
    // Configurar ações da tabela
    setupTableActions();
});

function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.menu li a');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPage === href) {
            item.parentElement.classList.add('active');
        } else {
            item.parentElement.classList.remove('active');
        }
    });
}

function setupForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#dc2626';
                    isValid = false;
                } else {
                    input.style.borderColor = '#d1d5db';
                }
            });
            
            if (isValid) {
                // Simular envio do formulário
                alert('Formulário enviado com sucesso!');
                
                // Redirecionar para a página de listagem
                if (form.id === 'user-form') {
                    window.location.href = 'usuarios.html';
                }
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    });
}

function setupTableActions() {
    // Ação de editar
    const editButtons = document.querySelectorAll('.actions .edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Ação de edição acionada para este item.');
        });
    });
    
    // Ação de excluir
    const deleteButtons = document.querySelectorAll('.actions .delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja excluir este item?')) {
                // Simular exclusão
                const row = button.closest('tr');
                row.style.opacity = '0.5';
                alert('Item excluído com sucesso!');
            }
        });
    });
}

// Função para alternar entre modais (se implementado)
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = show ? 'block' : 'none';
    }
}

// Configurar filtros de data para relatórios
function setupDateFilters() {
    // Definir data padrão para o mês atual
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (input.id.includes('start')) {
            input.value = formatDate(firstDay);
        } else if (input.id.includes('end')) {
            input.value = formatDate(today);
        }
    });
}

// Adicionar ao DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    setupDateFilters();
    
    // Configurar formulários de relatório
    const reportForms = document.querySelectorAll('.report-form');
    reportForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Relatório gerado com sucesso!');
            document.querySelector('.preview-placeholder').innerHTML = `
                <p>Dados do relatório seriam exibidos aqui.</p>
                <p>Tipo: ${form.closest('.report-card').querySelector('h3').textContent}</p>
                <button class="btn btn-primary" style="margin-top: 15px;">Exportar para PDF</button>
            `;
        });
    });
});



});

// Adicione ao final do script.js
// Exporte as funções necessárias para auth.js
export { highlightActiveMenu, setupForms, setupTableActions };