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

function setBuscarPedidosSearch(busqueda) {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);
    //$('#tabla').empty(); 
    //$('#tabla').append("Buscando...");
    if (busqueda == "") setBuscarPedidos();
    else
        servidor('https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?cliente=' + id + '&search=' + busqueda + "&filtro=1&estado=0,1,2,3,5,6", getBuscarPedidos);
}

function setBuscarPedidos() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);

    //$('#tabla').empty(); 
    //$('#tabla').append("Buscando...");

    servidor('https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?cliente=' + id + "&filtro=1&estado=0,1,2,3,5,6,", getBuscarPedidos);
}
function getBuscarPedidos(xhttp) {

    var respuesta = xhttp.responseText;
    if (respuesta == "") {
        $('#tabla').html("Sin Pedidos Pendientes...");
        return 0;
    }
    var arrayJson = respuesta.split("|");
    var html = "";
    for (var i = 0; i < arrayJson.length - 1; i++) {
        let tempJson = JSON.parse(arrayJson[i]);
        let estado, color;
        if (tempJson.estado == 0) {
            color = "#9b9b9b";
            estado = "Pendiente";
        } else if (tempJson.estado == 1) {
            color = "#f7bd56";
            estado = "Proceso";
        } else if (tempJson.estado == 2 || tempJson.estado == 3) {
            color = "#a5d3ae";
            estado = "Terminado";
        } else if (tempJson.estado == 5) {
            color = "#ad69bc";
            estado = "Parcial";
        } else if (tempJson.estado == 6) {
            color = "black";
            estado = "Cancelada";
        }
        var d = new Date(tempJson.fecha_oc);
        d = addDaysToDate(d, 20);

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
        html += '            </ul>';
        html += '            <div class="card-footer">';
        html += '<span style="color: white; font-weight:bold">' + estado + '</span>';
        html += '            </div>';
        html += '        </div>';
        html += '    </div>';
        html += '</div>';
    }
    $('#tabla').html(html);

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