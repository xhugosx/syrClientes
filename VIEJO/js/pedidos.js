var link = "https://empaquessr.com/sistema/empaquessr_2/php/";
var pagina = 1;
function primero() {
    //aqui ira la validacion de si ya inicio sesion
    if (localStorage.getItem('nombre') != null) {

        $('#cliente').text(localStorage.getItem('nombre'));
        setBuscarPedidos()
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

function setBuscarPedidosGrupo() {
    $('#currentPage').text(1);
    pagina = 1;
    setBuscarPedidos();
}

function cambiarPagina(paginaCambio) {
    pagina += paginaCambio;
    setBuscarPedidos();
}

function setBuscarPedidos() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);
    let busqueda = $('#search').val();
    let cantidad = $('#grupos').val();
    //console.log(link + 'lista_pedidos/cliente/selectAll.php?cliente=' + id + "&search=" + busqueda + "&filtro=1&estado=0,1,2,3,5,6,");
    servidor(link + 'lista_pedidos/cliente/selectAll.php?cliente=' + id + "&search=" + busqueda + "&filtro=1&estado=0,1,2,3,6,&cantidad=" + cantidad + "&pagina=" + pagina, getBuscarPedidos);
}
function getBuscarPedidos(xhttp) {

    var respuesta = xhttp.responseText;

    if (respuesta === "") {
        $('#tabla').html("Sin Pedidos Pendientes...");
        return;
    }

    var arrayJson = respuesta.split("|");

    // Filas de la tabla
    let filas = arrayJson
        .slice(0, -2) // quitamos el último vacío
        .map((item, i) => {
            let tempJson = JSON.parse(item);
            let estado, color, icono;

            switch (tempJson.estado) {
                case '0':
                    estado = " Pendiente";
                    color = "#9b9b9be4";
                    icono = '<i class="fa fa-hourglass-start"></i>'; // reloj de arena
                    break;
                case '1':
                    estado = " Proceso";
                    color = "#f7bc56d8";
                    icono = '<i class="fa fa-spinner fa-spin"></i>'; // icono girando
                    break;
                case '2':
                    estado = " Terminado";
                    color = "#a5d3aedf";
                    icono = '<i class="fa fa-check-circle"></i>'; // check
                    break;
                case '3':
                    estado = " Terminado";
                    color = "#a5d3aedf";
                    icono = '<i class="fa fa-check-circle"></i>'; // check
                    break;
                case '6':
                    estado = " Cancelada";
                    color = "#0000009f";
                    icono = '<i class="fa fa-times-circle"></i>'; // cruz
                    break;
                default:
                    estado = " Desconocido";
                    color = "#ffffff";
                    icono = '<i class="fa fa-question-circle"></i>';
            }


            //let d = new Date(tempJson.fecha_oc);
            //d = addDaysToDate(d, 20);
            //console.log(estado, color, tempJson.estado)
            return `
          <tr class="resaltar" style="background:${color}; color :white;">
            <td>${tempJson.id}</td>
            <td>${tempJson.codigo}</td>
            <td>${tempJson.producto}</td>
            <td>${parseInt(tempJson.cantidad).toLocaleString()} pzs</td>
            <td>${tempJson.oc}</td>
            <td>${tempJson.fecha_oc}</td>
            <td>${tempJson.fecha_entrega}</td>
            <td><strong>${icono}${estado}</strong></td>
          </tr>
        `;
        })
        .join("");

    // Generar tabla completa
    let html = `
  <table class="table table-sm text-center">
    <thead style="background:rgba(47, 71, 92, 0.85); ">
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Código</th>
        <th scope="col">Producto</th>
        <th scope="col">Cantidad</th>
        <th scope="col">O.C.</th>
        <th scope="col">Fecha Pedido</th>
        <th scope="col">Entrega Estimada</th>
        <th scope="col">Estado</th>
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
function mensaje(elemento) {
    $('#' + elemento).popover('show');

    setTimeout(() => {
        $('#' + elemento).popover('hide');
    }, 2000);
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
/* function sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    
    return fecha.getFullYear() + "-" + llenarCerosFecha(fecha.getMonth()) + "-" + llenarCerosFecha(fecha.getDate());
} */