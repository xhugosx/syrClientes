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
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?cliente=' + id + '&search=' + busqueda + "&filtro=1&estado=0,1,2,3,5,6", getBuscarPedidos);
}

function setBuscarPedidos() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);

    //$('#tabla').empty(); 
    //$('#tabla').append("Buscando...");

    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?cliente=' + id + "&filtro=1&estado=0,1,2,3,5,6,", getBuscarPedidos);
}
function getBuscarPedidos(xhttp) {

    var respuesta = xhttp.responseText;
    if (respuesta == "") {
        $('#tabla').html("Sin resultados...");
        return 0;
    }
    var arrayJson = respuesta.split("|");
    var html = "";
    /*html += '<table class="table table-sm">';
    html += '            <thead>';
    html += '                <tr>';
    html += '                <th scope="col">Id</th>';
    html += '                <th scope="col">Codigo</th>';
    html += '                <th scope="col">Producto</th>';
    html += '                <th scope="col">Piezas</th>';
    html += '                <th scope="col">Fecha Pedido</th>';
    html += '                <th scope="col">Entrega Estimada</th>';
    html += '                <th scope="col">Estatus</th>';
    html += '                </tr>';
    html += '            </thead>';
    html += '            <tbody>';

    for (var i = 0; i < arrayJson.length - 1; i++) {
        let tempJson = JSON.parse(arrayJson[i]);
        let estado, color;
        if (tempJson.estado == 0) {
            color = "#dfdfdfc7";
            estado = "Pendiente";
        } else if (tempJson.estado == 1) {
            color = "#e9a371b0";
            estado = "Proceso";
        } else if(tempJson.estado == 2 || tempJson.estado == 3) {
            color = "#77dd778f";
            estado = "Terminado";
        }else if (tempJson.estado == 5) {
            color = "rgba(161, 133, 148, 0.657)";
            estado = "Parcial";
        }else if (tempJson.estado == 6) {
            color = "rgba(83, 83, 83, 0.605)";
            estado = "Cancelada";
        }
        var d = new Date(tempJson.fecha_oc);
        d = addDaysToDate(d, 20);
        //console.log();
        //console.log(tempJson);
        html += '<tr style="background:' + color + '">';
        html += '    <td>' + tempJson.id + '</td>';
        html += '    <td>' + tempJson.codigo + '</td>';
        html += '    <td>' + tempJson.producto + '</td>';
        html += '    <td>' + tempJson.cantidad + '</td>';
        html += '    <td>' + tempJson.fecha_oc + '</td>';
        html += '    <td>'+d+'</td>';
        html += '    <td>' + estado + '</td>';
        html += '</tr>';


    }
    html += '        </tbody>';
    html += '    </table>';*/


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
        html += '        <div class="card text-center h-100" style="height: 100;width: 18em;background:' + color + '" onclick="mensaje(\'fecha\'+'+i+')">';
        html += '            <div class="card-header" style=" color:white">';
        html += '                <span class="bold">ID: </span> ' + tempJson.id;
        html += '                <span id="fecha'+i+'" style="float: right;" class="d-inline-block" data-toggle="popover" data-content="Fecha Pedido: ' + tempJson.fecha_oc + '" ><img src="elements/calendar2-fill.svg" width="13px" alt=""></span>';
        html += '            </div>';
        html += '            <ul class="list-group list-group-flush">';
        html += '                <li class="list-group-item"><span class="bold">' + tempJson.codigo + '</span></li>';
        html += '                <li class="list-group-item">' + tempJson.producto + '</li>';
        html += '                <li class="list-group-item">  <span class="bold">' + tempJson.cantidad + ' pzas.</span>  </li>';
        html += '                <li class="list-group-item">  <span class="bold">Estimado:</span>  ' + d + '</li>';
        html += '            </ul>';
        html += '            <div class="card-footer">';
        html += '<span style="color: white; font-weight:bold">' + estado + '</span>';
        html += '            </div>';
        html += '        </div>';
        html += '    </div>';
        html += '</div>';

    }

    $('#tabla').html(html);
    //alert(respuesta);


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
function addDaysToDate(date, days) {
    date = new Date(date);
    var fecha = new Date(date.getFullYear() + "-" + (date.getMonth() + 2) + "-" + (date.getDate() + 1));
    fecha.setDate(fecha.getDate() + days);
    return fecha.getFullYear() + "-" + llenarCerosFecha(fecha.getMonth()) + "-" + llenarCerosFecha(fecha.getDate());
}
/* function sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    
    return fecha.getFullYear() + "-" + llenarCerosFecha(fecha.getMonth()) + "-" + llenarCerosFecha(fecha.getDate());
} */