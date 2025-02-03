document.getElementById('vehiculoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const datos = {
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
        estadoPago: document.getElementById('estadoPago').value,
    };

    fetch('https://nombre-de-tu-servicio.onrender.com/api/datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    })
    .then(response => response.json())
    .then(data => {
        mostrarReporte(data.datos);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('vehiculoForm').reset();
});

function mostrarReporte(datos) {
    const reporteDiv = document.getElementById('reporte');
    reporteDiv.innerHTML = '';

    datos.forEach(dato => {
        const viajeReporte = document.createElement('div');
        
        viajeReporte.innerHTML = `
            <p><strong>Fecha:</strong> ${dato.fecha}</p>
            <p><strong>Empresa:</strong> ${dato.empresa}</p>
            <p><strong>Chofer:</strong> ${dato.chofer}</p>
            <p><strong>Placa:</strong> ${dato.placa}</p>
            <p><strong>Salida:</strong> ${dato.salida}</p>
            <p><strong>Destino:</strong> ${dato.destino}</p>
            <p><strong>Viáticos (USD):</strong> ${dato.viaticos}</p>
            <p><strong>Gasoil (USD):</strong> ${dato.gasoil}</p>
            <p><strong>Litros Consumidos de Gasoil:</strong> ${dato.litrosGasoil}</p>
            <p><strong>Gastos Adicionales (USD):</strong> ${dato.gastos}</p>
            <p><strong>Pago al Chofer (USD): ${dato.pago}</p>
            <p><strong>Entrada por Realizar el Servicio (USD):</strong> ${dato.entrada}</p>
            <p><strong>Ganancias Netas (USD):</strong> ${dato.entrada - dato.viaticos - dato.gasoil - dato.gastos - dato.pago}</p>
            <p class="${dato.estadoPago === 'Falta por cobrar' ? 'falta-cobrar' : 'pagado'}"><strong>Estado de Pago:</strong> ${dato.estadoPago}</p>
            <button onclick="editarViaje(this)">Editar</button>
            <button onclick="eliminarViaje(this)">Eliminar</button>
            <button onclick="imprimirViaje(this)">Imprimir</button>
            <hr>
        `;

        reporteDiv.appendChild(viajeReporte);
    });
}

function editarViaje(button) {
    // Función de editar viaje
}

function eliminarViaje(button) {
    // Función de eliminar viaje
}

function imprimirViaje(button) {
    // Función de imprimir viaje
}

// Recuperar y mostrar datos al cargar la página
fetch('https://nombre-de-tu-servicio.onrender.com/api/datos')
    .then(response => response.json())
    .then(data => {
        mostrarReporte(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
