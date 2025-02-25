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
        fecha: fecha,
        empresa: empresa,
        chofer: chofer,
        placa: placa,
        salida: salida,
        destino: destino,
        viaticos: viaticos,
        gasoil: gasoil,
        litrosGasoil: litrosGasoil,
        gastos: gastos,
        pago: pago,
        entrada: entrada,
        gananciasNetas: gananciasNetas,
        estadoPago: estadoPago
    };

    viajes.push(nuevoViaje);
    guardarDatos();
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

    viajes.splice(index, 1);
    guardarDatos();
    mostrarReporte();

    document.getElementById('mensaje-edicion').style.display = 'block';
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
    
    // Eliminar botones
    printContent.querySelectorAll('button').forEach(button => button.remove());
    
    // Crear un contenedor temporal para la impresión
    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.appendChild(printContent);
    
    // Agregar el contenedor al cuerpo del documento
    document.body.appendChild(printContainer);
    
    // Imprimir directamente en la misma ventana
    window.print();
    
    // Eliminar el contenedor temporal después de imprimir
    document.body.removeChild(printContainer);
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
            <p><strong>Ganancias Netas (USD):</strong> ${viaje.gananciasNetas}</p>
            <p class="${viaje.estadoPago === 'Falta por cobrar' ? 'falta-cobrar' : 'pagado'}"><strong>Estado de Pago:</strong> ${viaje.estadoPago}</p>
            <button onclick="editarViaje(${index})">Editar</button>
            <button onclick="eliminarViaje(${index})">Eliminar</button>
            <button onclick="imprimirViaje(${index})">Imprimir</button>
            <button onclick="enviarWhatsApp(${index})">Enviar</button> <--- Botón de Enviar
            <hr>
        `;
        reporteDiv.appendChild(viajeReporte);
    });
  }

function enviarWhatsApp(index) {
    const viaje = viajes[index];
    const mensaje = `
        *Detalles del Viaje ${index + 1}*
        *Fecha:* ${viaje.fecha}
        *Empresa:* ${viaje.empresa}
        *Chofer:* ${viaje.chofer}
        *Placa:* ${viaje.placa}
        *Salida:* ${viaje.salida}
        *Destino:* ${viaje.destino}
        *Viáticos (USD):* ${viaje.viaticos}
        *Gasoil (USD):* ${viaje.gasoil}
        *Litros de Gasoil:* ${viaje.litrosGasoil}
        *Gastos Adicionales (USD):* ${viaje.gastos}
        *Pago al Chofer (USD):* ${viaje.pago}
        *Entrada (USD):* ${viaje.entrada}
        *Ganancias Netas (USD):* ${viaje.gananciasNetas}
        *Estado de Pago:* ${viaje.estadoPago}
    `;

    // Número de teléfono en formato internacional (sin el signo +)
    const numeroTelefono = '584125453018';

    // Enlace para dispositivos móviles (solo Android y otros móviles)
    const enlaceWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;

    // Abrir el enlace en una nueva pestaña
    window.open(enlaceWhatsApp, '_blank');
}

function guardarDatos() {
    localStorage.setItem('viajes', JSON.stringify(viajes));
}

function cargarDatos() {
    mostrarReporte();
}
