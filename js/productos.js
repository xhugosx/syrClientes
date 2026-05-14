// =========================
// VARIABLES GLOBALES
// =========================

let paginaActual = 1;
let totalPaginas = 1;
let limite = 10;

// =========================
// INICIO
// =========================

productos();

$('#buscador').on('input', function () {
    paginaActual = 1;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        productos();
    }, 500);
});

$('#cerrarSesion').on('click', function () {
    borrarLocalStorage();
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
});

$('#descargarProductos').on('click', function () {
    descargarProductos();
});

// =========================
// OBTENER PRODUCTOS
// =========================

function productos(pagina = 1) {

    mostrarCarga();

    let codigo = tresDigitos(localStorage.getItem('cliente_id'));
    let rfc = localStorage.getItem('rfc');

    let form = new FormData();

    form.append('codigo', codigo);
    form.append('rfc', rfc);
    form.append('pagina', pagina);
    form.append('limite', limite);
    if ($('#buscador').val().trim() != '') form.append('buscador', $('#buscador').val().trim());
    //console.log(codigo, rfc, pagina, limite, $('#buscador').val().trim());
    servidor(
        'https://empaquessr.com/sistema/cliente/productos.php',
        form,
        function (res) {

            cerrarCarga();
            let datos = JSON.parse(res.responseText);
            if (!datos.status) {

                alerta(
                    'error',
                    'Error',
                    'No se pudieron obtener los productos.'
                );
                return;
            }

            paginaActual = datos.pagina;
            totalPaginas = datos.totalPaginas;

            let html = '';

            if (datos.data.length > 0) {
                datos.data.forEach(producto => {
                    html += `
                        <tr>
                            <td>${producto.codigo}</td>
                            <td>${producto.producto}</td>
                            <td>$${parseFloat(producto.precio).toFixed(2)}</td>
                            <td class="text-center">
                                <button 
                                    class="btn btn-plano"
                                    onclick="verPlano('${codigo}', '${producto.codigo}')"
                                >
                                    <i class="bi bi-file-earmark-pdf"></i>
                                    Ver plano

                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
            else {

                html = `
                    <tr>
                        <td colspan="4" class="text-center py-5">
                            <div class="empty-products">
                                <i class="bi bi-box-seam"></i>
                                <h5>No hay productos</h5>
                                <p>No se encontraron productos registrados.</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
            $('#tablaProductos').html(html);
            renderPaginacion();
        }
    );

}
function descargarProductos() {

    mostrarCarga();

    let codigo = tresDigitos(localStorage.getItem('cliente_id'));
    let rfc = localStorage.getItem('rfc');
    let buscador = $('#buscador').val();

    let form = new FormData();

    form.append('codigo', codigo);
    form.append('rfc', rfc);
    form.append('pagina', 1);
    form.append('limite', 999999);
    form.append('buscador', buscador);

    servidor(
        'https://empaquessr.com/sistema/cliente/productos.php',
        form,
        function (res) {

            cerrarCarga();

            let datos = JSON.parse(res.responseText);

            if (!datos.status) {

                alerta(
                    'error',
                    'Error',
                    'No se pudieron descargar los productos.'
                );

                return;

            }
            let cliente = localStorage.getItem('cliente_nombre');
            generarExcel(datos.data, cliente);

        }
    );

}
function generarExcel(productos, cliente) {

    let tabla = `
    
        <table border="1">
        
            <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Precio</th>
            </tr>
    
    `;

    productos.forEach(producto => {

        tabla += `
        
            <tr>
                <td>${producto.codigo}</td>
                <td>${producto.producto}</td>
                <td>$${parseFloat(producto.precio).toFixed(2)}</td>
            </tr>
        
        `;

    });

    tabla += '</table>';

    let archivo = new Blob(
        ['\ufeff', tabla],
        {
            type: 'application/vnd.ms-excel'
        }
    );

    let url = URL.createObjectURL(archivo);

    let link = document.createElement('a');

    link.href = url;
    let fecha = new Date().toISOString().split('T')[0];
    if (cliente.length > 20) {
        cliente = cliente.substring(0, 20) + '...';
    }
    link.download = `productos_${cliente}_${fecha}.xls`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}

// =========================
// PAGINACION
// =========================

function renderPaginacion() {

    let html = '';

    html += `
    
        <button 
            class="pagination-btn"
            onclick="cambiarPagina(-1)"
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
                class="pagination-btn"
                onclick="productos(1)"
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
                class="pagination-btn ${i == paginaActual ? 'active' : ''}"
                onclick="productos(${i})"
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
                class="pagination-btn"
                onclick="productos(${totalPaginas})"
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
            class="pagination-btn"
            onclick="cambiarPagina(1)"
        >
            <i class="bi bi-chevron-right"></i>
        </button>
    
    `;

    $('.pagination-container').html(html);

}

// =========================
// CAMBIAR PAGINA
// =========================

function cambiarPagina(direccion) {

    let nuevaPagina = paginaActual + direccion;
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
        return;
    }
    productos(nuevaPagina);

}

// =========================
// VER PDF
// =========================

function verPlano(cliente, producto) {
    producto = producto.substring(producto.indexOf('/') + 1);
    let win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`
        <iframe src="https://empaquessr.com/sistema/cliente/visor.php?cliente=${cliente}&producto=${producto}" 
                style="width:100%;height:100%;border:none;"></iframe>
    `);
}