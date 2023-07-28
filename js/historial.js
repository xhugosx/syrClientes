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

//funciones para consultar tabla
function setBuscarHistorial() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);

    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAllHistorialPedidos.php?filtro=1&estado=4,5,&cliente=" + id, getBuscarHistorial);
}
function getBuscarHistorial(xhttp) {

    var respuesta = xhttp.responseText;
    if (respuesta == "") {
        $('#tabla').html("Sin resultados...");
        return 0;
    }
    var arrayJson = respuesta.split("|");
    var html = "";

    html += '<table class="table table-sm">';
    html += '            <thead>';
    html += '                <tr>';
    html += '                <th scope="col">Id</th>';
    html += '                <th scope="col">Codigo</th>';
    html += '                <th scope="col">Producto</th>';
    html += '                <th scope="col">Piezas</th>';
    html += '                <th scope="col">Fecha Pedido</th>';
    html += '                <th scope="col">Entrega Estimada</th>';
    html += '                <th scope="col">Estatus</th>';
    html += '                <th scope="col">Entregado</th>';
    html += '                <th scope="col">Facturas</th>';
    html += '                <th scope="col">Fechas</th>';
    html += '                </tr>';
    html += '            </thead>';
    html += '            <tbody>';

    for (var i = 0; i < arrayJson.length - 1; i++) {

        let tempJson = JSON.parse(arrayJson[i]);
        let estado, color;
        if (tempJson.estado == 4) {
            color = "#3f90eda5";
            estado = "Entregado";
        } else if (tempJson.estado == 5) {
            color = "rgba(161, 133, 148, 0.657)";
            estado = "Parcial";
        }
        var d = new Date(tempJson.fecha_oc);
        d = addDaysToDate(d, 20);
        //console.log();
        //console.log(tempJson);

        var facturas = (tempJson.facturas).split(',');
        var fechas = (tempJson.fechas).split(',');
        var entregas = (tempJson.entregado).split(',');

        html += '<tr style="background:' + color + '">';
        html += '    <td rowspan="'+facturas.length+'">' + tempJson.id + '</td>';
        html += '    <td rowspan="'+facturas.length+'">' + tempJson.codigo + '</td>';
        html += '    <td rowspan="'+facturas.length+'">' + tempJson.producto + '</td>';
        html += '    <td rowspan="'+facturas.length+'">' + tempJson.cantidad + '</td>';
        html += '    <td rowspan="'+facturas.length+'">' + tempJson.fecha_oc + '</td>';
        html += '    <td rowspan="'+facturas.length+'">' + d + '</td>';
        html += '    <td rowspan="'+facturas.length+'">' + estado + '</td>';
        html += '    <td >' + entregas[0] + '</td>';
        html += '    <td >' + facturas[0] + '</td>';
        html += '    <td ">' + fechas[0] + '</td>';
        html += '</tr>';
        html += '<tr tr style="background:' + color + '">';
        for (let j = 1; j < entregas.length; j++) html += '    <td>' + entregas[j] + '</td>';
        for (let j = 1; j < facturas.length; j++) html += '    <td>' + facturas[j] + '</td>';
        for (let j = 1; j < fechas.length; j++) html += '    <td>' + fechas[j] + '</td>';
        html += '</tr>'



    }
    html += '        </tbody>';
    html += '    </table>';

    $('#tabla').html(html);
    //alert(respuesta);


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