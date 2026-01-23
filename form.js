// V.1.0 version of form.js

function showResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = result;
    resultDiv.style.display = 'block';
}

function hideResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none';
}

// Listener for NBLM_REPORT_FINAL message
window.addEventListener('message', function(event) {
    if (event.data.type === 'NBLM_REPORT_FINAL') {
        showResult(event.data.result);
    }
});

// Updated click handlers for analizar and limpiar buttons
document.getElementById('analizar').addEventListener('click', function() {
    // Analyzing logic here...
});

document.getElementById('limpiar').addEventListener('click', function() {
    hideResult();
    // Clean up logic here...
});

// guardar-imprimir button functionality
document.getElementById('guardar-imprimir').addEventListener('click', function() {
    // Save and print logic here...
});
