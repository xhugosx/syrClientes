let paginaActual = 1;
let totalPaginas = 1;
let limite = 10;

pedidos();

$('#buscador').on('input', function () {
    paginaActual = 1;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        pedidos();
    }, 500);
});

$('#filtroEstado').on('change', function () {

    paginaActual = 1;
    pedidos();

});

$('#cerrarSesion').on('click', function () {
    borrarLocalStorage();
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
});

function pedidos() {

    mostrarCarga();

    let codigo = tresDigitos(localStorage.getItem('cliente_id'));
    let rfc = localStorage.getItem('rfc');

    let buscador = $('#buscador').val();
    let estado = $('#filtroEstado').val();

    let form = new FormData();

    form.append('codigo', codigo);
    form.append('rfc', rfc);
    form.append('estado', estado);
    form.append('pagina', paginaActual);
    form.append('limite', limite);
    if (buscador.trim() != '') form.append('buscador', buscador.trim());

    servidor('https://empaquessr.com/sistema/cliente/pedidos.php', form, function (res) {

        cerrarCarga();

        let datos = JSON.parse(res.responseText);
        //console.log(datos);
        if (!datos.status) {

            $('#contenedorPedidos').html(`
                <div class="pedido-empty">
                    <i class="bi bi-exclamation-circle"></i>
                    <h4>Error</h4>
                    <p>No fue posible consultar los pedidos.</p>
                </div>
            `);

            return;

        }

        totalPaginas = datos.totalPaginas;

        let html = '';

        if (datos.data.length > 0) {

            datos.data.forEach(pedido => {

                let badge = '';
                let estadoTexto = '';

                switch (parseInt(pedido.estado)) {

                    case 0:
                        badge = 'badge-pendiente';
                        estadoTexto = 'Pendiente';
                        break;

                    case 1:
                        badge = 'badge-proceso';
                        estadoTexto = 'En proceso';
                        break;

                    case 2:
                        badge = 'badge-terminado';
                        estadoTexto = 'Terminado';
                        break;

                    case 3:
                        badge = 'badge-terminado';
                        estadoTexto = 'Finalizado';
                        break;

                }

                html += `
                    <div class="pedido-card">

                        <div class="pedido-header">

                            <div>

                                <div class="pedido-codigo">
                                    OC:  ${pedido.oc}
                                </div>

                                <h3 class="pedido-producto">
                                    ${pedido.producto}
                                </h3>

                            </div>

                            <div class="pedido-badge ${badge}">
                                ${estadoTexto}
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

                        <div class="pedido-footer">

                            <i class="bi bi-chat-left-text"></i>

                            <p>
                                ${pedido.observaciones != '' ? pedido.observaciones : 'Sin observaciones'}
                            </p>

                        </div>

                    </div>
                `;

            });

        }
        else {

            html = `
                <div class="pedido-empty">

                    <i class="bi bi-box-seam"></i>

                    <h4>Sin pedidos</h4>

                    <p>
                        No se encontraron pedidos registrados.
                    </p>

                </div>
            `;

        }

        $('#contenedorPedidos').html(html);

        renderPagination();

    });

}

function renderPagination() {

    let html = '';

    html += `
    
        <button 
            class="page-btn"
            onclick="cambiarPagina(${paginaActual - 1})"
            ${paginaActual == 1 ? 'disabled' : ''}
        >
            <i class="bi bi-chevron-left"></i>
        </button>
    
    `;

    let inicio = Math.max(1, paginaActual - 1);
    let fin = Math.min(totalPaginas, paginaActual + 1);

    // =========================
    // PRIMERA PAGINA
    // =========================

    if (inicio > 1) {

        html += `
        
            <button 
                class="page-btn"
                onclick="cambiarPagina(1)"
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

    // =========================
    // PAGINAS CENTRALES
    // =========================

    for (let i = inicio; i <= fin; i++) {

        html += `
        
            <button 
                class="page-btn ${i == paginaActual ? 'active' : ''}"
                onclick="cambiarPagina(${i})"
            >
                ${i}
            </button>
        
        `;

    }

    // =========================
    // ULTIMA PAGINA
    // =========================

    if (fin < totalPaginas) {

        if (fin < totalPaginas - 1) {

            html += `
            
                <span class="pagination-dots">...</span>
            
            `;

        }

        html += `
        
            <button 
                class="page-btn"
                onclick="cambiarPagina(${totalPaginas})"
            >
                ${totalPaginas}
            </button>
        
        `;

    }

    // =========================
    // BOTON SIGUIENTE
    // =========================

    html += `
    
        <button 
            class="page-btn"
            onclick="cambiarPagina(${paginaActual + 1})"
            ${paginaActual == totalPaginas ? 'disabled' : ''}
        >
            <i class="bi bi-chevron-right"></i>
        </button>
    
    `;

    $('#paginacionPedidos').html(html);

}

function cambiarPagina(pagina) {

    if (pagina < 1 || pagina > totalPaginas) return;

    paginaActual = pagina;

    pedidos();

}