document.addEventListener('DOMContentLoaded', cargarDatos); // Cargar datos al cargar la página

let viajes = JSON.parse(localStorage.getItem('viajes')) || []; // Obtener viajes de localStorage o inicializar array vacío
let editing = false; // Variable para rastrear si se está editando un viaje
let viajeEditando = null; // Variable para almacenar el viaje que se está editando

document.getElementById('vehiculoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    if (editing) {
        guardarCambios();
    } else {
        agregarViaje();
    }
});

function agregarViaje() {
    const fecha = document.getElementById('fecha').value;
    const empresa = document.getElementById('empresa').value;
    const chofer = document.getElementById('chofer').value;
    const placa = document.getElementById('placa').value;
    const salida = document.getElementById('salida').value;
    const destino = document.getElementById('destino').value;
    const viaticos = parseFloat(document.getElementById('viaticos').value);
    const gasoil = parseFloat(document.getElementById('gasoil').value);
    const litrosGasoil = parseFloat(document.getElementById('litrosGasoil').value);
    const gastos = parseFloat(document.getElementById('gastos').value);
    const pago = parseFloat(document.getElementById('pago').value);
    const entrada = parseFloat(document.getElementById('entrada').value);
    const estadoPago = document.getElementById('estadoPago').value;

    const gananciasNetas = entrada - viaticos - gasoil - gastos - pago;

    const nuevoViaje = {
        fecha,
        empresa,
        chofer,
        placa,
        salida,
        destino,
        viaticos,
        gasoil,
        litrosGasoil,
        gastos,
        pago,
        entrada,
        gananciasNetas,
        estadoPago
    };

    viajes.push(nuevoViaje);
    guardarDatos(); // Guardar en localStorage
    mostrarReporte();
    document.getElementById('vehiculoForm').reset();
}

function editarViaje(index) {
    editing = true;
    viajeEditando = viajes[index];

    document.getElementById('fecha').value = viajeEditando.fecha;
    document.getElementById('empresa').value = viajeEditando.empresa;
    document.getElementById('chofer').value = viajeEditando.chofer;
    document.getElementById('placa').value = viajeEditando.placa;
    document.getElementById('salida').value = viajeEditando.salida;
    document.getElementById('destino').value = viajeEditando.destino;
    document.getElementById('viaticos').value = viajeEditando.viaticos;
    document.getElementById('gasoil').value = viajeEditando.gasoil;
    document.getElementById('litrosGasoil').value = viajeEditando.litrosGasoil;
    document.getElementById('gastos').value = viajeEditando.gastos;
    document.getElementById('pago').value = viajeEditando.pago;
    document.getElementById('entrada').value = viajeEditando.entrada;
    document.getElementById('estadoPago').value = viajeEditando.estadoPago;

    // Eliminar el viaje de la lista
    viajes.splice(index, 1);
    guardarDatos();
    mostrarReporte();

    // Mostrar mensaje de edición
    document.getElementById('mensaje-edicion').style.display = 'block';

    // Cambiar texto del botón a "Guardar Cambios"
    document.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
}

function guardarCambios() {
    viajeEditando.fecha = document.getElementById('fecha').value;
    viajeEditando.empresa = document.getElementById('empresa').value;
    viajeEditando.chofer = document.getElementById('chofer').value;
    viajeEditando.placa = document.getElementById('placa').value;
    viajeEditando.salida = document.getElementById('salida').value;
    viajeEditando.destino = document.getElementById('destino').value;
    viajeEditando.viaticos = parseFloat(document.getElementById('viaticos').value);
    viajeEditando.gasoil = parseFloat(document.getElementById('gasoil').value);
    viajeEditando.litrosGasoil = parseFloat(document.getElementById('litrosGasoil').value);
    viajeEditando.gastos = parseFloat(document.getElementById('gastos').value);
    viajeEditando.pago = parseFloat(document.getElementById('pago').value);
    viajeEditando.entrada = parseFloat(document.getElementById('entrada').value);
    viajeEditando.estadoPago = document.getElementById('estadoPago').value;

    viajes.push(viajeEditando);
    guardarDatos();
    mostrarReporte();

    document.getElementById('vehiculoForm').reset();
    editing = false;
    viajeEditando = null;

    // Ocultar mensaje de edición
    document.getElementById('mensaje-edicion').style.display = 'none';

    // Cambiar texto del botón a "Agregar Viaje"
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
    printWindow.document.write('<html><head><title>Imprimir Viaje</title></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function mostrarReporte() {
    const reporteDiv = document.getElementById('reporte');
    reporteDiv.innerHTML = ''; // Limpiar reporte

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
            <p><strong>Ganancias Netas (USD):</strong> ${viaje.gananciasNetas}</p>
            <p class="${viaje.estadoPago === 'Falta por cobrar' ? 'falta-cobrar' : 'pagado'}"><strong>Estado de Pago:</strong> ${viaje.estadoPago}</p>
            <button onclick="editarViaje(${index})">Editar</button>
            <button onclick="eliminarViaje(${index})">Eliminar</button>
            <button onclick="imprimirViaje(${index})">Imprimir</button>
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
