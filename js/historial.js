//funcion para generar limite de registros
var pagina = 1;
var link = "https://empaquessr.com/sistema/empaquessr_2/php/";
function primero() {
    //aqui ira la validacion de si ya inicio sesion
    if (localStorage.getItem('nombre') != null) {

        $('#cliente').text(localStorage.getItem('nombre'));
        setBuscarHistorial();
    }
    else window.location.href = "index.html";
}
function cerrarSesion() {
    var opcion = confirm("Estas seguro de cerrar sesión?");
    if (opcion == true) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}
function setBuscarHistorialGrupo() {
    $('#currentPage').text(1);
    pagina = 1;
    setBuscarHistorial();
}

function cambiarPagina(paginaCambio) {
    pagina += paginaCambio;
    setBuscarHistorial();
}
//funciones para consultar tabla
function setBuscarHistorial() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);
    let busqueda = $('#search').val();
    let cantidad = $('#grupos').val();
    //console.log(link + "lista_pedidos/cliente/selectAll.php?filtro=1&estado=4,5,&cliente=" + id + "&search=" + busqueda + "&cantidad=" + cantidad + "&pagina=" + pagina);
    servidor(link + "lista_pedidos/cliente/selectAll.php?filtro=1&estado=4,5,&cliente=" + id + "&search=" + busqueda + "&cantidad=" + cantidad + "&pagina=" + pagina, getBuscarHistorial);
}
function getBuscarHistorial(xhttp) {
    var respuesta = xhttp.responseText;

    if (respuesta == "" || respuesta == 0) {
        $('#tabla').html("Sin resultados...");
        return;
    }

    var arrayJson = respuesta.split("|");

    let filas = arrayJson
        .slice(0, -2)
        .map((item, i) => {
            let tempJson = JSON.parse(item);
            let estado, color, icono;

            switch (tempJson.estado) {
                case '4':
                    estado = " Entregado";
                    color = "#3066acd0";
                    icono = '<i class="fa fa-check-circle"></i>';
                    break;
                case '5':
                    estado = " Parcial";
                    color = "#ad69bcbe";
                    icono = '<i class="fa fa-circle-half-stroke"></i>';
                    break;
                default:
                    estado = " Desconocido";
                    color = "#ffffff";
                    icono = '<i class="fa fa-question-circle"></i>';
            }
            //console.log(tempJson);
            let facturas = tempJson.facturas.split(',');
            let fechas = tempJson.fecha_factura.split(',');
            let entregas = tempJson.entregado.split(',');
            let suma = 0;
            let entrega = 0;

            // Construir lista compacta de facturas
            let facturasHtml = facturas.map((f, j) => {
                entrega = parseInt(entregas[j]);
                suma += entrega;
                return `
                <div style="font-size:12px; margin-bottom:2px;  display:flex; justify-content:space-between;">
                    <span><strong>${f} </strong></span> |
                    <span style="text-align:right;">${entrega.toLocaleString()} pzs </span> |
                    <span>${fechas[j]}</span>
                </div>
                `;

            }).join('');

            facturasHtml += `<div style="font-weight:bold; font-size:12px; display:flex; justify-content:space-between;">Total: ${suma.toLocaleString()} pzs</div>`;

            return `
                <tr style="background:${color}; color:white; vertical-align: top;">
                    <td>${tempJson.id}</td>
                    <td>${tempJson.codigo}</td>
                    <td style="width: 300px; white-space: normal; word-wrap: break-word;">${tempJson.producto}</td>
                    <td>${parseInt(tempJson.cantidad).toLocaleString()} pzs</td>
                    <td>${tempJson.oc}</td>
                    <td>${tempJson.fecha_oc}</td>
                    <td>${tempJson.fecha_entrega}</td>
                    <td><strong>${icono}${estado}</strong></td>
                    <td>${facturasHtml}</td>
                </tr>
            `;
        })
        .join('');

    let html = `
        <table class="table table-sm text-center">
            <thead style="background:rgba(47, 71, 92, 0.85);">
                <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th style="width: 300px;">Producto</th>
                    <th>Cantidad</th>
                    <th>O.C.</th>
                    <th>Fecha Pedido</th>
                    <th>Entrega Estimada</th>
                    <th>Estado</th>
                    <th>Facturas</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;

    $('#tabla').html(html);
    let datos = JSON.parse(arrayJson[arrayJson.length - 2]);
    $('#currentPage').text(datos.pagina_actual);
    $('#totalPages').text(' / ' + datos.paginas);

    $('#prevPage').prop('disabled', false); //boton en true
    $('#nextPage').prop('disabled', false); //boton en true

    if (datos.pagina_actual == 1) $('#prevPage').prop('disabled', true);
    if (datos.pagina_actual == datos.paginas) $('#nextPage').prop('disabled', true);
}


function servidor(link, miFuncion) {
    if (window.navigator.onLine) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                miFuncion(this);

            }

        };

        xhttp.open("GET", link, true);
        xhttp.send();
    }
    else {
        alert('Revisa tu conexión <i style="color:gray" class="fa-solid fa-wifi fa-lg"></i>');
    }
}
function mensaje(elemento) {
    $('#' + elemento).popover('show');

    setTimeout(() => {
        $('#' + elemento).popover('hide');
    }, 2000);
}
function llenarCeros(id) {
    id = String(id);
    //alert(id.length);
    if (id.length == 1) return '00' + id;
    else if (id.length == 2) return "0" + id;
    else return id;

}
function llenarCerosFecha(id) {
    id = String(id);
    if (id.length == 1) return "0" + id;
    else return id;

}
/*function addDaysToDate(date, days) {
    date = new Date(date);
    var fecha = new Date(date.getFullYear() + "-" + (date.getMonth() + 2) + "-" + (date.getDate() + 1));
    fecha.setDate(fecha.getDate() + days);
    return fecha.getFullYear() + "-" + llenarCerosFecha(fecha.getMonth()) + "-" + llenarCerosFecha(fecha.getDate());
}*/
function addDaysToDate(fecha, dias) {
    fecha = new Date(fecha)
    fecha.setDate(fecha.getDate() + dias + 1);
    // Creamos array con los meses del año
    const meses = ['ene', 'febr', 'mar', 'abr', 'may', 'jun', 'jul', 'agos', 'sep', 'oct', 'nov', 'dic'];
    // Creamos array con los días de la semana
    const dias_semana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vier', 'Sáb'];
    // Construimos el formato de salida
    fecha = dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
    return fecha;
}