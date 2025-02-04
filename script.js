document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('vehiculoForm');
    const reporte = document.getElementById('reporte');
    const convertirPdf = document.getElementById('convertirPdf');

    // Cargar datos guardados
    loadFormData();

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);

        // Guardar datos en localStorage
        saveFormData(formData);

        const viaje = {
            fecha: formData.get('fecha'),
            empresa: formData.get('empresa'),
            chofer: formData.get('chofer'),
            placa: formData.get('placa'),
            salida: formData.get('salida'),
            destino: formData.get('destino'),
            viaticos: parseFloat(formData.get('viaticos')),
            gasoil: parseFloat(formData.get('gasoil')),
            litrosGasoil: parseFloat(formData.get('litrosGasoil')),
            gastos: parseFloat(formData.get('gastos')),
            pago: parseFloat(formData.get('pago')),
            entrada: parseFloat(formData.get('entrada')),
            estadoPago: formData.get('estadoPago'),
            gananciasNetas: parseFloat(formData.get('entrada')) - parseFloat(formData.get('viaticos')) - parseFloat(formData.get('gasoil')) - parseFloat(formData.get('gastos')) - parseFloat(formData.get('pago'))
        };

        const viajeElement = document.createElement('div');
        viajeElement.innerHTML = `
            <p><strong>Fecha:</strong> ${viaje.fecha}</p>
            <p><strong>Empresa:</strong> ${viaje.empresa}</p>
            <p><strong>Chofer:</strong> ${viaje.chofer}</p>
            <p><strong>Placa:</strong> ${viaje.placa}</p>
            <p><strong>Salida:</strong> ${viaje.salida}</p>
            <p><strong>Destino:</strong> ${viaje.destino}</p>
            <p><strong>Viáticos (USD):</strong> $${viaje.viaticos}</p>
            <p><strong>Gasoil (USD):</strong> $${viaje.gasoil}</p>
            <p><strong>Litros Consumidos de Gasoil:</strong> ${viaje.litrosGasoil}</p>
            <p><strong>Gastos Adicionales (USD):</strong> $${viaje.gastos}</p>
            <p><strong>Pago al Chofer (USD):</strong> $${viaje.pago}</p>
            <p><strong>Entrada por Realizar el Servicio (USD):</strong> $${viaje.entrada}</p>
            <p><strong>Ganancias Netas (USD):</strong> $${viaje.gananciasNetas}</p>
            <p class="${viaje.estadoPago === 'Falta por cobrar' ? 'falta-cobrar' : 'pagado'}"><strong>Estado de Pago:</strong> ${viaje.estadoPago}</p>
            <button onclick="editarViaje(this)">Editar</button>
            <button onclick="eliminarViaje(this)">Eliminar</button>
            <button onclick="convertirYCompartirPDF(this)">Convertir y Compartir PDF</button>
            <hr>
        `;
        reporte.appendChild(viajeElement);

        document.getElementById('vehiculoForm').reset();
    });

    convertirPdf.addEventListener('click', function () {
        // Ocultar botones antes de convertir a PDF
        const buttons = document.querySelectorAll('#reporte button');
        buttons.forEach(button => button.style.display = 'none');

        html2pdf().from(reporte).save('reporte.pdf').then(function() {
            // Restaurar la visualización de los botones después de la conversión
            buttons.forEach(button => button.style.display = '');
        });
    });

    function saveFormData(formData) {
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        localStorage.setItem('formData', JSON.stringify(data));
    }

    function loadFormData() {
        const savedData = JSON.parse(localStorage.getItem('formData'));
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = savedData[key];
                }
            });
        }
    }

    window.convertirYCompartirPDF = function (button) {
        const viaje = button.parentElement;
        // Ocultar los botones antes de convertir a PDF
        const buttons = viaje.querySelectorAll('button');
        buttons.forEach(button => button.style.display = 'none');

        html2pdf(viaje, {
            margin: 1,
            filename: 'reporte-viaje.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).then(function(pdf) {
            // Restaurar la visualización de los botones después de la conversión
            buttons.forEach(button => button.style.display = '');

            const reader = new FileReader();
            reader.onload = function(e) {
                const pdfData = e.target.result;
                const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent('Por favor revisa el reporte de viaje adjunto.')}&attachment=${encodeURIComponent(pdfData)}`;
                window.open(whatsappLink, '_blank');
            };
            reader.readAsDataURL(pdf.output('blob'));
            alert('El reporte se ha convertido a PDF y se está compartiendo por WhatsApp.');
        });
    };

    window.editarViaje = function (button) {
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
    };

    window.eliminarViaje = function (button) {
        const viaje = button.parentElement;
        viaje.remove();
    };

    window.imprimirViaje = function (button) {
        const viaje = button.parentElement;
        const printContent = viaje.cloneNode(true);
        printContent.querySelectorAll('button').forEach(button => button.remove());
        const printWindow = window.open('', '', 'height=400,width=600');
        printWindow.document.write('<html><head><title>Imprimir Viaje</title></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };
});
