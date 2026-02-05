let chartData = {
    labels: [],
    datasets: [{
        label: '# of Values',
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
    }]
};

// 1. Tenta carregar dados salvos ANTES de criar o gráfico
loadData();

function createChart(type){
    const canvasContainer = document.getElementById('canvas-container');
    
    // Removemos a linha que definia height fixo (canvasContainer.style.height = ...)
    // Deixamos o CSS (.chart-container) controlar a altura.
    
    canvasContainer.innerHTML = `<canvas id="myChart"></canvas>`;
    
    const ctx = document.getElementById('myChart').getContext('2d');
    
    return new Chart(ctx, {
        type: type,
        data: chartData,
        options: {
            responsive: true, // Garante que o Chart.js redimensiona
            maintainAspectRatio: false, // Permite esticar para encher o div pai
            scales: {
                y: { beginAtZero: true }
            },
            onClick: (event, activeElements) => {
                if (activeElements.length > 0) {
                    const { index } = activeElements[0];
                    removeData(index);
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true
            }
        }
    });
}

// Cria o gráfico inicial
let myChart = createChart('bar'); 

function addData(){
    const labelInput = document.getElementById('labelInput');
    const dataInput = document.getElementById('dataInput');

    if(labelInput.value && dataInput.value){
        chartData.labels.push(labelInput.value);
        chartData.datasets.forEach((dataset) => {
            dataset.data.push(dataInput.value);
        });

        myChart.update();
        saveData(); // SALVA após adicionar
        
        labelInput.value = '';
        dataInput.value = '';
    } else {
        alert("Por favor, preencha ambos os campos.");
    }
}

function updateChartType() {
    const selectedType = document.getElementById('chartType').value;
    myChart.destroy();
    myChart = createChart(selectedType);
}

function removeData(index) {
    chartData.labels.splice(index, 1);
    chartData.datasets.forEach((dataset) => {
        dataset.data.splice(index, 1);
    });
    
    myChart.update();
    saveData(); // SALVA após remover
}

// --- NOVAS FUNÇÕES ---

// Função para Limpar Tudo
function clearAllData() {
    // Pergunta ao utilizador se tem a certeza (segurança)
    if (confirm("Tens a certeza que queres apagar todos os dados?")) {
        chartData.labels = []; // Esvazia etiquetas
        chartData.datasets.forEach((dataset) => {
            dataset.data = []; // Esvazia números
        });
        myChart.update();
        saveData(); // Salva o estado vazio
    }
}

// Função para Salvar no LocalStorage
function saveData() {
    // Criamos um objeto simples apenas com o que queremos guardar
    const dataToSave = {
        labels: chartData.labels,
        values: chartData.datasets[0].data
    };
    // Convertemos para texto (JSON) e guardamos no navegador
    localStorage.setItem('myChartData', JSON.stringify(dataToSave));
}

// Função para Carregar do LocalStorage
function loadData() {
    const savedData = localStorage.getItem('myChartData');
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Restaura as labels e os dados
        chartData.labels = parsedData.labels;
        chartData.datasets[0].data = parsedData.values;
    }
}

// Função para descarregar o gráfico como imagem
function downloadChart() {
    // 1. Selecionamos o elemento canvas onde o gráfico está desenhado
    const canvas = document.getElementById('myChart');
    
    // 2. Convertemos o conteúdo do canvas para um URL de imagem (base64)
    // O '1.0' garante a qualidade máxima
    const imageLink = canvas.toDataURL('image/png', 1.0);
    
    // 3. Criamos um link temporário (tag <a>) na memória do navegador
    const link = document.createElement('a');
    
    // 4. Definimos o nome do ficheiro que será descarregado
    link.download = 'meu-grafico.png';
    
    // 5. Colocamos a imagem no link
    link.href = imageLink;
    
    // 6. Simulamos um clique no link para iniciar o download
    link.click();
    
    // 7. (Opcional) Removemos o link da memória, pois já não é necessário
    link.remove();
}