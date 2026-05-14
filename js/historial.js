let paginaActual = 1;
let totalPaginas = 1;
let limite = 10;


historial();

$('#buscador').on('keyup', function () {
    paginaActual = 1;
    historial();
});

$('#filtroEstado').on('change', function () {
    paginaActual = 1;
    historial();
});

$('#fechaInicio').on('change', function () {
    paginaActual = 1;
    historial();
});

$('#fechaFin').on('change', function () {
    paginaActual = 1;
    historial();
});
$('#cerrarSesion').on('click', function () {
    borrarLocalStorage();
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
});


function historial(pagina = 1) {

    //console.log('Cargando historial, página ' + pagina);

    paginaActual = pagina;

    mostrarCarga();

    let codigo = tresDigitos(localStorage.getItem('cliente_id'));
    let rfc = localStorage.getItem('rfc');

    let buscador = $('#buscador').val();
    let estado = $('#filtroEstado').val();

    let fechaInicio = $('#fechaInicio').val();
    let fechaFin = $('#fechaFin').val();

    let form = new FormData();

    form.append('codigo', codigo);
    form.append('rfc', rfc);

    form.append('buscador', buscador);
    form.append('estado', estado);

    form.append('fechaInicio', fechaInicio);
    form.append('fechaFin', fechaFin);

    form.append('pagina', paginaActual);
    form.append('limite', limite);

    servidor(
        'https://empaquessr.com/sistema/cliente/historial.php',
        form,
        function (res) {

            cerrarCarga();

            let datos = JSON.parse(res.responseText);

            //console.log(datos);

            if (!datos.status) {

                $('#contenedorPedidos').html(`
                
                    <div class="pedido-empty">
                        <i class="bi bi-clock-history"></i>
                        <h4>No hay historial</h4>
                        <p>No se encontraron pedidos finalizados.</p>
                    </div>
                
                `);

                $('#paginacionPedidos').html('');

                return;

            }

            totalPaginas = datos.totalPaginas;

            let html = '';

            datos.data.forEach(pedido => {

                let badge = '';
                let textoEstado = '';

                if (pedido.estado == 4) {

                    badge = 'badge-entregado';
                    textoEstado = 'Entregado';

                }
                else if (pedido.estado == 5) {

                    badge = 'badge-parcial';
                    textoEstado = 'Entrega parcial';

                }
                else {

                    badge = 'badge-cancelado';
                    textoEstado = 'Cancelado';

                }

                let facturas = '';

                if (pedido.facturas && pedido.facturas != 'null') {

                    let listaFacturas = pedido.facturas.split(',');
                    let listaFechas = pedido.fechas_factura ? pedido.fechas_factura.split(',') : [];
                    let listaCantidades = pedido.cantidades_factura ? pedido.cantidades_factura.split(',') : [];

                    facturas += `
                    
                        <div class="factura-table">

                            <div class="factura-head">
                                <div>Factura</div>
                                <div>Fecha</div>
                                <div>Entrega</div>
                            </div>
                    
                    `;
                    //console.log(listaFacturas);
                    let totalCantidad = 0;
                    listaFacturas.forEach((factura, index) => {

                        let fecha = listaFechas[index] || '-';
                        let cantidad = listaCantidades[index] || '0';
                        //console.log(factura, fecha, cantidad, "vuelta: " + index);
                        facturas += `
                        
                            <div class="factura-row">
                                <div class="factura-col factura-folio">
                                    <i class="bi bi-receipt-cutoff"></i>
                                    ${factura}
                                </div>
                                 <div class="factura-col">
                                    ${fecha}
                                </div>
                                <div class="factura-col">
                                    ${parseInt(cantidad).toLocaleString()} pzs
                                </div>
                               
                            </div>
                        `;
                        totalCantidad += parseInt(cantidad);

                    });
                    facturas += `
                    
                        <div class="factura-row">
                            <div class="factura-col factura-folio">
                            </div>
                            <div class="factura-col" style="font-weight: bold;">
                                Total:
                            </div>
                            <div class="factura-col">
                                ${totalCantidad.toLocaleString()} pzs
                            </div>

                        </div>
                    
                    `;

                    facturas += `
                        </div>
                    `;

                }
                else {

                    facturas = `
                    
                        <div class="factura-empty">
                            Sin facturas registradas
                        </div>
                    
                    `;

                }


                html += `
                
                    <div class="pedido-card">

                        <div class="pedido-header">

                            <div>

                                <div class="pedido-codigo">
                                    OC: ${pedido.oc}
                                </div>

                                <h3 class="pedido-producto">
                                    ${pedido.producto}
                                </h3>

                            </div>

                            <div class="pedido-badge ${badge}">
                                ${textoEstado}
                            </div>

                        </div>

                        <div class="pedido-body">

                            <div class="pedido-info">
                                <span>Código</span>
                                <strong>${pedido.codigo}</strong>
                            </div>

                            <div class="pedido-info">
                                <span>Cantidad</span>
                                <strong>${parseInt(pedido.cantidad).toLocaleString()} piezas</strong>
                            </div>

                            <div class="pedido-info">
                                <span>Fecha O.C.</span>
                                <strong>${pedido.fecha_oc}</strong>
                            </div>

                            <div class="pedido-info">
                                <span>Entrega</span>
                                <strong>${pedido.fecha_entrega}</strong>
                            </div>

                        </div>

                        <div class="factura-list">
                            ${facturas}
                        </div>

                        <div class="pedido-footer">

                            <i class="bi bi-chat-left-text"></i>

                            <p>
                                ${pedido.observaciones != '' ? pedido.observaciones : 'Sin observaciones registradas.'}
                            </p>

                        </div>

                    </div>
                
                `;

            });

            $('#contenedorHistorial').html(html);

            renderPaginacionHistorial();

        }
    );

}

function cambiarPaginaHistorial(direccion) {

    let nuevaPagina = paginaActual + direccion;

    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;

    historial(nuevaPagina);

}

function renderPaginacionHistorial() {

    let html = '';

    html += `
    
        <button 
            class="page-btn"
            onclick="cambiarPaginaHistorial(-1)"
            ${paginaActual == 1 ? 'disabled' : ''}
        >
            <i class="bi bi-chevron-left"></i>
        </button>
    
    `;

    let inicio = Math.max(1, paginaActual - 1);
    let fin = Math.min(totalPaginas, paginaActual + 1);

    if (inicio > 1) {

        html += `
        
            <button 
                class="page-btn"
                onclick="historial(1)"
            >
                1
            </button>
        
        `;

        if (inicio > 2) {

            html += `
            
                <span class="pagination-dots">...</span>
            
            `;

        }

    }

    for (let i = inicio; i <= fin; i++) {

        html += `
        
            <button 
                class="page-btn ${i == paginaActual ? 'active' : ''}"
                onclick="historial(${i})"
            >
                ${i}
            </button>
        
        `;

    }

    if (fin < totalPaginas) {

        if (fin < totalPaginas - 1) {

            html += `
            
                <span class="pagination-dots">...</span>
            
            `;

        }

        html += `
        
            <button 
                class="page-btn"
                onclick="historial(${totalPaginas})"
            >
                ${totalPaginas}
            </button>
        
        `;

    }

    html += `
    
        <button 
            class="page-btn"
            onclick="cambiarPaginaHistorial(1)"
            ${paginaActual == totalPaginas ? 'disabled' : ''}
        >
            <i class="bi bi-chevron-right"></i>
        </button>
    
    `;

    $('#paginacionHistorial').html(html);

}