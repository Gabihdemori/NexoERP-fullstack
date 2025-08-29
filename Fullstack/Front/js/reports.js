// Configuração dos relatórios disponíveis
const reportConfig = {
    vendas: {
        title: "Relatório de Vendas",
        types: [
            {
                id: "vendas-por-periodo",
                name: "Vendas por Período",
                groupBy: ["dia", "semana", "mês", "vendedor", "cliente", "produto"],
                filters: ["vendedor", "cliente", "produto", "status"],
                fields: ["data", "numero", "cliente", "vendedor", "produtos", "total", "status"]
            },
            {
                id: "produtos-mais-vendidos",
                name: "Produtos Mais Vendidos",
                groupBy: ["produto", "categoria"],
                filters: ["categoria", "periodo"],
                fields: ["produto", "categoria", "quantidade", "total_vendido", "percentual"]
            }
        ],
        mockData: {
            "vendas-por-periodo": [
                // Dados de exemplo...
            ],
            "produtos-mais-vendidos": [
                // Dados de exemplo...
            ]
        }
    },
    estoque: {
        title: "Relatório de Estoque",
        types: [
            // Configurações similares para estoque...
        ]
    },
    // Outras categorias...
};

// Inicialização do sistema de relatórios
document.addEventListener('DOMContentLoaded', function() {
    initDatePickers();
    setupCategoryTabs();
    setupReportTypeSelect();
    setupViewOptions();
    setupFormSubmission();
    setupExportButtons();
});

function initDatePickers() {
    flatpickr(".datepicker", {
        dateFormat: "d/m/Y",
        locale: "pt",
        defaultDate: new Date()
    });
    
    // Definir período padrão (últimos 30 dias)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    document.getElementById('start-date')._flatpickr.setDate(startDate);
    document.getElementById('end-date')._flatpickr.setDate(endDate);
}

function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.report-categories li');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            loadReportTypes(category);
        });
    });
}

function loadReportTypes(category) {
    const select = document.getElementById('report-type');
    select.innerHTML = '<option value="">Selecione um relatório</option>';
    
    if (reportConfig[category]) {
        reportConfig[category].types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            select.appendChild(option);
        });
    }
    
    // Resetar outros controles
    document.getElementById('group-by').innerHTML = '<option value="">Nenhum</option>';
    document.getElementById('filter-by').innerHTML = '<option value="">Nenhum</option>';
    document.getElementById('dynamic-filters').innerHTML = '';
    clearResults();
}

function setupReportTypeSelect() {
    const reportTypeSelect = document.getElementById('report-type');
    reportTypeSelect.addEventListener('change', function() {
        const category = document.querySelector('.report-categories li.active').dataset.category;
        const reportId = this.value;
        
        if (reportId && reportConfig[category]) {
            const report = reportConfig[category].types.find(r => r.id === reportId);
            
            // Preencher opções de Agrupar por
            const groupBySelect = document.getElementById('group-by');
            groupBySelect.innerHTML = '<option value="">Nenhum</option>';
            report.groupBy.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = formatOptionText(option);
                groupBySelect.appendChild(opt);
            });
            groupBySelect.disabled = false;
            
            // Preencher opções de Filtrar por
            const filterBySelect = document.getElementById('filter-by');
            filterBySelect.innerHTML = '<option value="">Nenhum</option>';
            report.filters.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = formatOptionText(option);
                filterBySelect.appendChild(opt);
            });
            filterBySelect.disabled = false;
            
            // Limpar filtros dinâmicos
            document.getElementById('dynamic-filters').innerHTML = '';
        } else {
            document.getElementById('group-by').disabled = true;
            document.getElementById('filter-by').disabled = true;
        }
    });
    
    // Configurar mudança no filtro por
    document.getElementById('filter-by').addEventListener('change', function() {
        const filter = this.value;
        const dynamicFilters = document.getElementById('dynamic-filters');
        dynamicFilters.innerHTML = '';
        
        if (filter) {
            const filterDiv = document.createElement('div');
            filterDiv.className = 'form-group dynamic-filter';
            filterDiv.dataset.filter = filter;
            
            const label = document.createElement('label');
            label.textContent = formatOptionText(filter);
            label.htmlFor = `filter-${filter}`;
            
            const input = document.createElement('input');
            input.type = "text";
            input.id = `filter-${filter}`;
            input.placeholder = `Filtrar por ${formatOptionText(filter)}`;
            
            filterDiv.appendChild(label);
            filterDiv.appendChild(input);
            dynamicFilters.appendChild(filterDiv);
        }
    });
}

function setupViewOptions() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const viewType = this.dataset.view;
            updateView(viewType);
        });
    });
    
    // Configurar seletor de tipo de gráfico
    document.getElementById('chart-type-select').addEventListener('change', function() {
        if (window.currentChart) {
            renderChart(window.currentChart.data, this.value);
        }
    });
}

function updateView(viewType) {
    const chartTypeSelect = document.querySelector('.chart-type');
    const tableContainer = document.querySelector('.table-container');
    const chartContainer = document.querySelector('.chart-container');
    
    switch(viewType) {
        case 'table':
            chartTypeSelect.style.display = 'none';
            tableContainer.style.display = 'block';
            chartContainer.style.display = 'none';
            break;
        case 'chart':
            chartTypeSelect.style.display = 'flex';
            tableContainer.style.display = 'none';
            chartContainer.style.display = 'block';
            break;
        case 'both':
            chartTypeSelect.style.display = 'flex';
            tableContainer.style.display = 'block';
            chartContainer.style.display = 'block';
            break;
    }
}

function setupFormSubmission() {
    document.getElementById('report-filters').addEventListener('submit', function(e) {
        e.preventDefault();
        generateReport();
    });
}

function generateReport() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    const noResults = document.querySelector('.no-results');
    const reportSummary = document.querySelector('.report-summary');
    const tableContainer = document.querySelector('.table-container');
    const chartContainer = document.querySelector('.chart-container');
    
    // Mostrar indicador de carregamento
    loadingIndicator.style.display = 'flex';
    noResults.style.display = 'none';
    reportSummary.style.display = 'none';
    tableContainer.style.display = 'none';
    chartContainer.style.display = 'none';
    
    // Simular requisição assíncrona
    setTimeout(() => {
        // Obter parâmetros do formulário
        const category = document.querySelector('.report-categories li.active').dataset.category;
        const reportType = document.getElementById('report-type').value;
        
        // Carregar dados mockados (em produção, seria uma requisição AJAX)
        const reportData = reportConfig[category].mockData[reportType];
        
        // Processar resultados
        displayResults(reportData);
        
        // Esconder indicador de carregamento
        loadingIndicator.style.display = 'none';
    }, 1000);
}

function displayResults(data) {
    // Exibir dados na tabela
    renderTable(data);
    
    // Exibir gráfico
    renderChart(data);
    
    // Exibir resumo
    renderSummary(data);
    
    // Mostrar resultados
    document.querySelector('.report-summary').style.display = 'block';
    document.querySelector('.no-results').style.display = 'none';
    
    // Atualizar view conforme seleção
    const activeView = document.querySelector('.btn-view.active').dataset.view;
    updateView(activeView);
}

function renderTable(data) {
    const table = document.querySelector('.report-table');
    table.innerHTML = '';
    
    if (!data || data.length === 0) return;
    
    // Criar cabeçalho
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = formatHeaderText(key);
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Criar corpo
    const tbody = document.createElement('tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = formatValue(value);
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
}

function renderChart(data, chartType = 'bar') {
    if (!data || data.length === 0) return;
    
    const ctx = document.getElementById('report-chart').getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (window.currentChart) {
        window.currentChart.destroy();
    }
    
    // Preparar dados para o gráfico (simplificado)
    const labels = data.map(item => item.label || item.name || item.data);
    const values = data.map(item => item.value || item.total || item.quantidade);
    
    window.currentChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Valores',
                data: values,
                backgroundColor: getChartColors(chartType, values.length),
                borderColor: '#2563eb',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: document.getElementById('report-type').selectedOptions[0].text
                },
                legend: {
                    position: chartType === 'pie' || chartType === 'donut' ? 'right' : 'top'
                }
            }
        }
    });
}

function renderSummary(data) {
    if (!data || data.length === 0) return;
    
    const summaryCards = document.querySelector('.summary-cards');
    summaryCards.innerHTML = '';
    
    // Cartão de total geral
    const total = data.reduce((sum, item) => sum + (item.total || item.value || 0), 0);
    const count = data.length;
    
    createSummaryCard('Total', formatCurrency(total), 'total');
    createSummaryCard('Registros', count, 'count');
    
    // Adicionar outras métricas relevantes conforme o tipo de relatório
    // ...
}

function createSummaryCard(title, value, type) {
    const card = document.createElement('div');
    card.className = 'summary-card ' + type;
    
    const h4 = document.createElement('h4');
    h4.textContent = title;
    
    const p = document.createElement('p');
    p.className = 'value';
    p.textContent = value;
    
    card.appendChild(h4);
    card.appendChild(p);
    document.querySelector('.summary-cards').appendChild(card);
}

function setupExportButtons() {
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('save-template').addEventListener('click', saveTemplate);
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text(document.querySelector('.page-header h2').textContent, 14, 20);
    
    // Parâmetros do relatório
    doc.setFontSize(12);
    let y = 30;
    
    const params = [
        `Relatório: ${document.getElementById('report-type').selectedOptions[0].text}`,
        `Período: ${document.getElementById('start-date').value} a ${document.getElementById('end-date').value}`
    ];
    
    params.forEach(param => {
        doc.text(param, 14, y);
        y += 7;
    });
    
    // Adicionar tabela
    const headers = [];
    const rows = [];
    
    document.querySelectorAll('.report-table th').forEach(th => {
        headers.push(th.textContent);
    });
    
    document.querySelectorAll('.report-table tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push(td.textContent);
        });
        if (row.length > 0) rows.push(row);
    });
    
    if (rows.length > 0) {
        doc.autoTable({
            startY: y + 10,
            head: [headers],
            body: rows,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [37, 99, 235] }
        });
    }
    
    // Salvar PDF
    doc.save(`relatorio_${new Date().toISOString().slice(0,10)}.pdf`);
}

function saveTemplate() {
    const template = {
        reportType: document.getElementById('report-type').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        groupBy: document.getElementById('group-by').value,
        filters: []
    };
    
    document.querySelectorAll('.dynamic-filter').forEach(filter => {
        template.filters.push({
            field: filter.dataset.filter,
            value: filter.querySelector('input').value
        });
    });
    
    // Em produção, salvaria no localStorage ou no servidor
    alert('Template salvo com sucesso!');
    console.log('Template salvo:', template);
}

// Funções auxiliares
function formatOptionText(text) {
    return text.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatHeaderText(text) {
    return text.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatValue(value) {
    if (typeof value === 'number') {
        if (value.toString().includes('.')) {
            return formatCurrency(value);
        }
        return value.toLocaleString('pt-BR');
    }
    return value;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}



function clearResults() {
    document.querySelector('.report-summary').style.display = 'none';
    document.querySelector('.table-container').style.display = 'none';
    document.querySelector('.chart-container').style.display = 'none';
    document.querySelector('.no-results').style.display = 'flex';
    
    if (window.currentChart) {
        window.currentChart.destroy();
        window.currentChart = null;
    }
}