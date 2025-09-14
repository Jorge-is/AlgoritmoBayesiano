document.getElementById('btnDiagnostico').addEventListener('click', diagnostico);
document.getElementById('btnEstadistica').addEventListener('click', mostrarEstadisticas);
document.getElementById('limpiar').addEventListener('click', limpiarFormulario);

let grafico = null; //Variable global para almacenar el gráfico

function diagnostico() {
    // Obtener los síntomas seleccionados
    const sintomas = {
        fever: document.getElementById('fever').checked,
        cough: document.getElementById('cough').checked,
        headache: document.getElementById('headache').checked,
        fatigue: document.getElementById('fatigue').checked,
        thirst: document.getElementById('thirst').checked,
        wheezing: document.getElementById('wheezing').checked,
        shortness: document.getElementById('shortness').checked,
        sneezing: document.getElementById('sneezing').checked,
        itchyEyes: document.getElementById('itchyEyes').checked,
        burningUrine: document.getElementById('burningUrine').checked,
        frequentUrine: document.getElementById('frequentUrine').checked
    };

    // Probabilidades a priori para cada enfermedad
    const priori = {
        cold: 0.2,        // Resfriado
        flu: 0.1,         // Gripe
        diabetes: 0.05,   // Diabetes
        asthma: 0.15,     // Asma
        allergy: 0.2,     // Alergia
        uti: 0.08         // Infección urinaria
    };

    // Probabilidades condicionales de cada síntoma dado una enfermedad
    const probCondicional = {
        cold: { fever: 0.3, cough: 0.8, headache: 0.5, fatigue: 0.3, thirst: 0.1, wheezing: 0.1, shortness: 0.1, sneezing: 0.5, itchyEyes: 0.2, burningUrine: 0.1, frequentUrine: 0.1 },
        flu: { fever: 0.9, cough: 0.7, headache: 0.6, fatigue: 0.8, thirst: 0.05, wheezing: 0.2, shortness: 0.2, sneezing: 0.3, itchyEyes: 0.1, burningUrine: 0.05, frequentUrine: 0.05 },
        diabetes: { fever: 0.1, cough: 0.05, headache: 0.4, fatigue: 0.6, thirst: 0.9, wheezing: 0.05, shortness: 0.1, sneezing: 0.05, itchyEyes: 0.05, burningUrine: 0.3, frequentUrine: 0.4 },
        asthma: { fever: 0.1, cough: 0.6, headache: 0.2, fatigue: 0.7, thirst: 0.1, wheezing: 0.9, shortness: 0.8, sneezing: 0.4, itchyEyes: 0.1, burningUrine: 0.05, frequentUrine: 0.1 },
        allergy: { fever: 0.05, cough: 0.3, headache: 0.3, fatigue: 0.2, thirst: 0.05, wheezing: 0.2, shortness: 0.1, sneezing: 0.8, itchyEyes: 0.9, burningUrine: 0.05, frequentUrine: 0.05 },
        uti: { fever: 0.5, cough: 0.1, headache: 0.2, fatigue: 0.4, thirst: 0.3, wheezing: 0.1, shortness: 0.1, sneezing: 0.1, itchyEyes: 0.1, burningUrine: 0.9, frequentUrine: 0.8 }
    };

    // Probabilidad total de los síntomas (Evidencias o pruebas)
    let evidencias = {
        fever: 0.25,
        cough: 0.35,
        headache: 0.4,
        fatigue: 0.4,
        thirst: 0.2,
        wheezing: 0.1,
        shortness: 0.2,
        sneezing: 0.3,
        itchyEyes: 0.15,
        burningUrine: 0.05,
        frequentUrine: 0.1
    };

    // Aplicar el Teorema de Bayes
    function bayes(priori, probCondicional, evidencias, sintomas) {
        let posterior = priori;
        for (let symptom in sintomas) {
            if (sintomas[symptom]) {
                posterior *= probCondicional[symptom] / evidencias[symptom];
            }
        }
        return posterior;
    }

    // Calcular las probabilidades posteriores
    const coldProb = bayes(priori.cold, probCondicional.cold, evidencias, sintomas);
    const fluProb = bayes(priori.flu, probCondicional.flu, evidencias, sintomas);
    const diabetesProb = bayes(priori.diabetes, probCondicional.diabetes, evidencias, sintomas);
    const asthmaProb = bayes(priori.asthma, probCondicional.asthma, evidencias, sintomas);
    const allergyProb = bayes(priori.allergy, probCondicional.allergy, evidencias, sintomas);
    const utiProb = bayes(priori.uti, probCondicional.uti, evidencias, sintomas);

    // Normalizar las probabilidades para que sumen 100%
    const totalProb = coldProb + fluProb + diabetesProb + asthmaProb + allergyProb + utiProb;
    if (totalProb > 0) {
        const normColdProb = (coldProb / totalProb) * 100;
        const normFluProb = (fluProb / totalProb) * 100;
        const normDiabetesProb = (diabetesProb / totalProb) * 100;
        const normAsthmaProb = (asthmaProb / totalProb) * 100;
        const normAllergyProb = (allergyProb / totalProb) * 100;
        const normUtiProb = (utiProb / totalProb) * 100;

        // Mostrar los resultados normalizados
        document.getElementById('cold-prob').textContent = normColdProb.toFixed(2);
        document.getElementById('flu-prob').textContent = normFluProb.toFixed(2);
        document.getElementById('diabetes-prob').textContent = normDiabetesProb.toFixed(2);
        document.getElementById('asthma-prob').textContent = normAsthmaProb.toFixed(2);
        document.getElementById('allergy-prob').textContent = normAllergyProb.toFixed(2);
        document.getElementById('uti-prob').textContent = normUtiProb.toFixed(2);
    }

    window.probabilities = {
        cold: coldProb * 100,
        flu: fluProb * 100,
        diabetes: diabetesProb * 100,
        asthma: asthmaProb * 100,
        allergy: allergyProb * 100,
        uti: utiProb * 100
    };
}

function mostrarEstadisticas() {
    // Mostrar el modal
    const modal = document.getElementById('modalEstadistica');
    // modal.style.display = "block";
    modal.classList.add('active');

    // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
    if (grafico) {
        grafico.destroy();
    }

    // Crear el gráfico de barras
    const ctx = document.getElementById('statsChart').getContext('2d');
    grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Resfriado', 'Gripe', 'Diabetes', 'Asma', 'Alergia', 'Infección Urinaria'],
            datasets: [{
                label: 'Probabilidad (%)',
                data: [
                    window.probabilities.cold,
                    window.probabilities.flu,
                    window.probabilities.diabetes,
                    window.probabilities.asthma,
                    window.probabilities.allergy,
                    window.probabilities.uti
                ],
                backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6c757d'],
                borderColor: ['#0056b3', '#1d7d34', '#b21f32', '#e0a800', '#138496', '#5a6268'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Cerrar el modal cuando se haga clic en el botón de cerrar
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('modalEstadistica').classList.remove('active');
});

// Limpiar el formulario, los resultados y el gráfico
function limpiarFormulario() {
    // Limpiar el formulario
    document.getElementById('symptomForm').reset(); // Limpiar los checkboxes

    //Limpiar los resultados
    document.getElementById('cold-prob').textContent = '--';
    document.getElementById('flu-prob').textContent = '--';
    document.getElementById('diabetes-prob').textContent = '--';
    document.getElementById('asthma-prob').textContent = '--';
    document.getElementById('allergy-prob').textContent = '--';
    document.getElementById('uti-prob').textContent = '--';

    // Destruir el gráfico si existe
    if (grafico) {
        grafico.destroy();
        grafico = null; // Restablecer la variable del gráfico
    }
}

document.getElementById('pdf-diagnostico').addEventListener('click', function () {
    // Inicializamos jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Capturamos el contenido del resultado del diagnóstico
    const resultElement = document.getElementById('result');

    // Convertimos el resultado del diagnóstico a imagen usando html2canvas con mayor calidad
    html2canvas(resultElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Calculamos el ancho y alto proporcionalmente para el PDF (máximo 180mm de ancho)
        const imgWidth = 90; // Ancho máximo permitido en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener proporción de la imagen

        // Añadimos la imagen del diagnóstico al PDF
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

        // Capturamos el gráfico estadístico como imagen con mayor calidad
        const chartElement = document.getElementById('statsChart');

        // Convertimos el gráfico a imagen
        html2canvas(chartElement, { scale: 2 }).then(chartCanvas => {
            const chartImgData = chartCanvas.toDataURL('image/png');

            // Calculamos el ancho y alto proporcionalmente para el gráfico en el PDF
            const chartWidth = 180; // Ancho máximo permitido en mm
            const chartHeight = (chartCanvas.height * chartWidth) / chartCanvas.width;

            // Añadimos el gráfico al PDF debajo del resultado del diagnóstico
            pdf.addImage(chartImgData, 'PNG', 10, imgHeight + 20, chartWidth, chartHeight);

            // Guardamos el PDF con ambos elementos
            pdf.save('diagnostico.pdf');
        });
    });
});

