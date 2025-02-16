document.addEventListener('DOMContentLoaded', cargarDatos);

let viajes = JSON.parse(localStorage.getItem('viajes')) || [];
let editing = false;
let viajeEditando = null;

document.getElementById('vehiculoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    if (editing) {
        guardarCambios();
    } else {
        agregarViaje();
    }
});

function obtenerValoresFormulario() {
    return {
        fecha: document.getElementById('fecha').value,
        empresa: document.getElementById('empresa').value,
        chofer: document.getElementById('chofer').value,
        placa: document.getElementById('placa').value,
        salida: document.getElementById('salida').value,
        destino: document.getElementById('destino').value,
        viaticos: parseFloat(document.getElementById('viaticos').value),
        gasoil: parseFloat(document.getElementById('gasoil').value),
        litrosGasoil: parseFloat(document.getElementById('litrosGasoil').value),
        gastos: parseFloat(document.getElementById('gastos').value),
        pago: parseFloat(document.getElementById('pago').value),
        entrada: parseFloat(document.getElementById('entrada').value),
        estadoPago: document.getElementById('estadoPago').value
    };
}

function asignarValoresFormulario(viaje) {
    document.getElementById('fecha').value = viaje.fecha;
    document.getElementById('empresa').value = viaje.empresa;
    document.getElementById('chofer').value = viaje.chofer;
    document.getElementById('placa').value = viaje.placa;
    document.getElementById('salida').value = viaje.salida;
    document.getElementById('destino').value = viaje.destino;
    document.getElementById('viaticos').value = viaje.viaticos;
    document.getElementById('gasoil').value = viaje.gasoil;
    document.getElementById('litrosGasoil').value = viaje.litrosGasoil;
    document.getElementById('gastos').value = viaje.gastos;
    document.getElementById('pago').value = viaje.pago;
    document.getElementById('entrada').value = viaje.entrada;
    document.getElementById('estadoPago').value = viaje.estadoPago;
}

function agregarViaje() {
    const nuevoViaje = obtenerValoresFormulario();

    if (!nuevoViaje.fecha || !nuevoViaje.empresa || !nuevoViaje.chofer || !nuevoViaje.placa || !nuevoViaje.salida || !nuevoViaje.destino || isNaN(nuevoViaje.viaticos) || isNaN(nuevoViaje.gasoil) || isNaN(nuevoViaje.litrosGasoil) || isNaN(nuevoViaje.gastos) || isNaN(nuevoViaje.pago) || isNaN(nuevoViaje.entrada)) {
        alert("Por favor, complete todos los campos requeridos correctamente.");
        return;
    }

    nuevoViaje.gananciasNetas = nuevoViaje.entrada - nuevoViaje.viaticos - nuevoViaje.gasoil - nuevoViaje.gastos - nuevoViaje.pago;

    viajes.push(nuevoViaje);
    guardarDatos();
    mostrarReporte();
    document.getElementById('vehiculoForm').reset();
}

function editarViaje(index) {
    editing = true;
    viajeEditando = viajes[index];

    asignarValoresFormulario(viajeEditando);

    viajes.splice(index, 1);
    guardarDatos();
    mostrarReporte();

    document.getElementById('mensaje-edicion').style.display = 'block';
    document.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
}

function guardarCambios() {
    const valoresFormulario = obtenerValoresFormulario();

    if (!valoresFormulario.fecha || !valoresFormulario.empresa || !valoresFormulario.chofer || !valoresFormulario.placa || !valoresFormulario.salida || !valoresFormulario.destino || isNaN(valoresFormulario.viaticos) || isNaN(valoresFormulario.gasoil) || isNaN(valoresFormulario.litrosGasoil) || isNaN(valoresFormulario.gastos) || isNaN(valoresFormulario.pago) || isNaN(valoresFormulario.entrada)) {
        alert("Por favor, complete todos los campos requeridos correctamente.");
        return;
    }

    viajeEditando = valoresFormulario;
    viajeEditando.gananciasNetas = viajeEditando.entrada - viajeEditando.viaticos - viajeEditando.gasoil - viajeEditando.gastos - viajeEditando.pago;

    viajes.push(viajeEditando);
    guardarDatos();
    mostrarReporte();

    document.getElementById('vehiculoForm').reset();
    editing = false;
    viajeEditando = null;

    document.getElementById('mensaje-edicion').style.display = 'none';
    document.querySelector('button[type="submit"]').textContent = 'Agregar Viaje';
}

function eliminarViaje(index) {
    viajes.splice(index, 1);
    guardarDatos();
    mostrarReporte();
}

function imprimirViaje(index) {
    const viaje = document.querySelectorAll('#reporte div')[index];
    const printContent = viaje.cloneNode(true);
    printContent.querySelectorAll('button').forEach(button => button.remove());

    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write('<html><head><title>Imprimir Viaje</title><style>@media print { body { -webkit-print-color-adjust: exact; } }</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Función para generar el PDF
function generarPDF(index) {
    const viaje = viajes[index];

    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Agregar contenido al PDF
    doc.setFontSize(18);
    doc.text('TRANSPORTE BRAZ', 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${viaje.fecha}`, 10, 20);
    doc.text(`Empresa: ${viaje.empresa}`, 10, 30);
    doc.text(`Chofer: ${viaje.chofer}`, 10, 40);
    doc.text(`Placa: ${viaje.placa}`, 10, 50);
    doc.text(`Salida: ${viaje.salida}`, 10, 60);
    doc.text(`Destino: ${viaje.destino}`, 10, 70);
    doc.text(`Viáticos: ${viaje.viaticos} USD`, 10, 80);
    doc.text(`Gasoil: ${viaje.gasoil} USD`, 10, 90);
    doc.text(`Litros de Gasoil: ${viaje.litrosGasoil}`, 10, 100);
    doc.text(`Gastos Adicionales: ${viaje.gastos} USD`, 10, 110);
    doc.text(`Pago al Chofer: ${viaje.pago} USD`, 10, 120);
    doc.text(`Entrada: ${viaje.entrada} USD`, 10, 130);
    doc.text(`Ganancias Netas: ${viaje.gananciasNetas} USD`, 10, 140);
    doc.text(`Estado de Pago: ${viaje.estadoPago}`, 10, 150);

    // Guardar el PDF
    doc.save(`Viaje_${index + 1}.pdf`);
}

function mostrarReporte() {
    const reporteDiv = document.getElementById('reporte');
    reporteDiv.innerHTML = '';

    viajes.forEach((viaje, index) => {
        const viajeReporte = document.createElement('div');
        viajeReporte.innerHTML = `
            <h3>Viaje #${index + 1}</h3>
            <p><strong>Fecha:</strong> ${viaje.fecha}</p>
            <p><strong>Empresa:</strong> ${viaje.empresa}</p>
            <p><strong>Chofer:</strong> ${viaje.chofer}</p>
            <p><strong>Placa:</strong> ${viaje.placa}</p>
            <p><strong>Salida:</strong> ${viaje.salida}</p>
            <p><strong>Destino:</strong> ${viaje.destino}</p>
            <p><strong>Viáticos (USD):</strong> ${viaje.viaticos}</p>
            <p><strong>Gasoil (USD):</strong> ${viaje.gasoil}</p>
            <p><strong>Litros Consumidos de Gasoil:</strong> ${viaje.litrosGasoil}</p>
            <p><strong>Gastos Adicionales (USD):</strong> ${viaje.gastos}</p>
            <p><strong>Pago al Chofer (USD):</strong> ${viaje.pago}</p>
            <p><strong>Entrada por Realizar el Servicio (USD):</strong> ${viaje.entrada}</p>
            <p><strong>Ganancias Netas (USD): ${viaje.gananciasNetas}</p>
            <p class="${viaje.estadoPago === 'Falta por cobrar' ? 'falta-cobrar' : 'pagado'}"><strong>Estado de Pago:</strong> ${viaje.estadoPago}</p>
            <button onclick="editarViaje(${index})">Editar</button>
            <button onclick="eliminarViaje(${index})">Eliminar</button>
            <button onclick="imprimirViaje(${index})">Imprimir</button>
            <button onclick="generarPDF(${index})">Compartir</button>
            <hr>
        `;
        reporteDiv.appendChild(viajeReporte);
    });
}

function guardarDatos() {
    localStorage.setItem('viajes', JSON.stringify(viajes));
}

function cargarDatos() {
    mostrarReporte();
}
