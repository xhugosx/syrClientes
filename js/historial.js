//funcion para generar limite de registros
var pagina = 1;
var min = 1, max = 20;

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
//funcion para hacer una busqueda
function setBuscarPedidosSearch(busqueda) {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);
    //$('#tabla').empty(); 
    //$('#tabla').append("Buscando...");
    if (busqueda == "") setBuscarHistorial();
    else
        servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectAllHistorialPedidos.php?filtro=1&estado=4,5,&cliente=" + id + "&search=" + busqueda, getBuscarHistorial);
}
//funciones para consultar tabla
function setBuscarHistorial() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);

    servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectAllHistorialPedidos.php?filtro=1&estado=4,5,&cliente=" + id, getBuscarHistorial);
}
function getBuscarHistorial(xhttp) {

    var respuesta = xhttp.responseText;
    if (respuesta == "" || respuesta == 0) {
        $('#tabla').html("Sin resultados...");
        let html = "";
        $('#paginacionContenido').html(html);
        $('#paginacionContenido2').html(html);
        $('#registros').html(html);
        $('#registros2').html(html);
        return 0;
    }
    //console.log(respuesta);
    var arrayJson = respuesta.split("|");
    var contador = arrayJson[arrayJson.length - 1];
    contador = parseInt(contador);
    //console.log("cantidad de datos: " + contador);
    var html = "";
    min = pagina == 1 ? 1 : (pagina * 20) - 19;
    max = pagina * 20;

    for (var i = min - 1; i < arrayJson.length - 1 && i < max; i++) {
        let tempJson = JSON.parse(arrayJson[i]);
        let estado, color;
        if (tempJson.estado == 4) {
            color = "#3065ac";
            estado = "Entregado";
        } else if (tempJson.estado == 5) {
            color = "#ad69bc";
            estado = "Parcial";
        }
        var d = new Date(tempJson.fecha_oc);
        d = addDaysToDate(d, 20);

        var facturas = (tempJson.facturas).split(',');
        var fechas = (tempJson.fechas).split(',');
        var entregas = (tempJson.entregado).split(',');
        var suma = 0;

        html += '<div class="col" style="margin:5px 0 5px 0">';
        html += '    <div class=" h-100">';
        html += '        <div class="card text-center h-100" style="height: 100;width: 18em;background:' + color + '" onclick="mensaje(\'fecha\'+' + i + ')">';
        html += '            <div class="card-header" style=" color:white">';
        html += '                <span class="bold">ID: </span> ' + tempJson.id;
        html += '                <span id="fecha' + i + '" style="float: right;" class="d-inline-block" data-toggle="popover" data-content="Fecha Pedido: ' + tempJson.fecha_oc + '" ><img src="elements/calendar2-fill.svg" width="13px" alt=""></span>';
        html += '            </div>';
        html += '            <ul class="list-group list-group-flush">';
        html += '                <li class="list-group-item"><span class="bold">' + tempJson.codigo + '</span></li>';
        html += '                <li class="list-group-item">' + tempJson.producto + '</li>';
        html += '                <li class="list-group-item">  <span class="bold">' + tempJson.cantidad + ' pzas.</span>  </li>';
        html += '                <li class="list-group-item" style="font-size: 10px">  <span class="bold">Entrega estimada: <br></span>  ' + d + '</li>';
        html += '                <li class="list-group-item" style="font-size: 15px; font-weight:bold">  <span class="bold">O.C: </span>  ' + tempJson.oc + '</li>';
        html += '<li class="list-group-item"> <center><table>';
        html += '<tr>';
        html += '    <th>Factura</th>';
        html += '    <th>Entregado</th>';
        html += '    <th>Fecha</th>';
        html += '</tr>';
        for (let j = 0; j < entregas.length; j++) {

            //html += '  <span class="bold">Factura: </span>  ' + facturas[j] + " | " + entregas[j] + " | " + fechas[j] + "<br>";

            html += '<tr>';
            html += '    <td>' + facturas[j] + '</td>';
            html += '    <td>' + entregas[j] + '</td>';
            html += '    <td>' + fechas[j] + '</td>';
            html += '</tr>';
            suma += parseInt(entregas[j]);


        }
        
        html += '<tr>';
        html += '    <td></td>';
        html += '    <td><b>Total: </b></td>';
        html += '    <td><b>' + suma + ' pzas.</b></td>';
        html += '</tr>';

        html += '</table></center></li>';
        //html += '                <li class="list-group-item">  <span class="bold">Factura</span>  ' + d + '</li>';
        html += '            </ul>';
        html += '            <div class="card-footer">';
        html += '<span style="color: white; font-weight:bold">' + estado + '</span>';
        html += '            </div>';
        html += '        </div>';
        html += '    </div>';
        html += '</div>';

    }

    paginacion(contador);
    $('#tabla').html("");
    $('#tabla').html(html);
    //alert(respuesta);


}
function paginacion(contador) {
    var paginas = contador / 20;
    if (contador % 20 != 0) {
        paginas = parseInt(paginas) + 1;
    }
    var html = "";
    for (var i = 0; i < paginas; i++) {
        var active = "";
        if (pagina == (i + 1)) active = "active";
        html += '<li class="page-item ' + active + '"><a class="page-link" onclick="cambiarPagina(' + (i + 1) + ')">' + (i + 1) + '</a></li>';
    }
    $('#paginacionContenido').html(html);
    $('#paginacionContenido2').html(html);
    let limite = max > contador ? contador : max;
    html = min + " de " + limite + " / " + contador + " Pedidos";
    $('#registros').html(html);
    $('#registros2').html(html);
}
function cambiarPagina(page) {
    pagina = page;
    //para filtrar por busqueda
    let busqueda = $('#search').val();
    setBuscarPedidosSearch(busqueda)
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