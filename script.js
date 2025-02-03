document.getElementById('vehiculoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
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
    
    const viaje = {
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
        estadoPago,
        gananciasNetas
    };
    
    // Cargar datos existentes
    let viajes = JSON.parse(localStorage.getItem('viajes')) || [];
    
    // Añadir nuevo viaje
    viajes.push(viaje);
    
    // Guardar datos en localStorage
    localStorage.setItem('viajes', JSON.stringify(viajes));
    
    // Mostrar el viaje en el reporte
    mostrarViaje(viaje);
    
    document.getElementById('vehiculoForm').reset();
});

function mostrarViaje(viaje) {
    const reporteDiv = document.getElementById('reporte');
    const viajeReporte = document.createElement('div');
    
    viajeReporte.innerHTML = `
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
        <button onclick="editarViaje(this)" ${viaje.estadoPago === 'Pagado' ? 'disabled' : ''}>Editar</button>
        <button onclick="eliminarViaje(this)">Eliminar</button>
        <button onclick="imprimirViaje(this)">Imprimir</button>
        <hr>
    `;
    
    reporteDiv.appendChild(viajeReporte);
}

function editarViaje(button) {
    const viaje = button.parentElement;
    document.getElementById('fecha').value = viaje.querySelector('p:nth-child(1)').innerText.split(': ')[1];
    document.getElementById('empresa').value = viaje.querySelector('p:nth-child(2)').innerText.split(': ')[1];
    document.getElementById('chofer').value = viaje.querySelector('p:nth-child(3)').innerText.split(': ')[1];
    document.getElementById('placa').value = viaje.querySelector('p:nth-child(4)').innerText.split(': ')[1];
    document.getElementById('salida').value = viaje.querySelector('p:nth-child(5)').innerText.split(': ')[1];
    document.getElementById('destino').value = viaje.querySelector('p:nth-child(6)').innerText.split(': ')[1];
    document.getElementById('viaticos').value = viaje.querySelector('p:nth-child(7)').innerText.split(': ')[1];
    document.getElementById('gasoil').value = viaje.querySelector('p:nth-child(8)').innerText.split(': ')[1];
    document.getElementById('litrosGasoil').value = viaje.querySelector('p:nth-child(9)').innerText.split(': ')[1];
    document.getElementById('gastos').value = viaje.querySelector('p:nth-child(10)').innerText.split(': ')[1];
    document.getElementById('pago').value = viaje.querySelector('p:nth-child(11)').innerText.split(': ')[1];
    document.getElementById('entrada').value = viaje.querySelector('p:nth-child(12)').innerText.split(': ')[1];
    document.getElementById('estadoPago').value = viaje.querySelector('p:nth-child(14)').innerText.split(': ')[1];
    
    viaje.remove();
    
    // Guardar cambios en localStorage
    let viajes = JSON.parse(localStorage.getItem('viajes')) || [];
    viajes = viajes.filter(v => v.fecha !== viaje.querySelector('p:nth-child(1)').innerText.split(': ')[1]);
    localStorage.setItem('viajes', JSON.stringify(viajes));
}

function eliminarViaje(button) {
    const viaje = button.parentElement;
    viaje.remove();
    
    // Eliminar del localStorage
    let viajes = JSON.parse(localStorage.getItem('viajes')) || [];
    viajes = viajes.filter(v => v.fecha !== viaje.querySelector('p:nth-child(1)').innerText.split(': ')[1]);
    localStorage.setItem('viajes', JSON.stringify(viajes));
}

function imprimirViaje(button) {
    const viaje = button.parentElement;
    const printContent = viaje.cloneNode(true);
    printContent.querySelectorAll('button').forEach(button => button.remove());
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write('<html><head><title>Imprimir Viaje</title></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Cargar y mostrar viajes al cargar la página
window.addEventListener('load', function() {
    const viajes = JSON.parse(localStorage.getItem('viajes')) || [];
    viajes.forEach(viaje => mostrarViaje(viaje));
});
