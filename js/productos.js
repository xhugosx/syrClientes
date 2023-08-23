function primero() {
    //aqui ira la validacion de si ya inicio sesion
    if (localStorage.getItem('nombre') != null) {

        $('#cliente').text(localStorage.getItem('nombre'));
        setBuscarProductos();
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

function setBuscarProductosSearch(search) {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=4&search='+search+'&cliente='+id, getBuscarProductos)
}

function setBuscarProductos() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=1&search=' + id, getBuscarProductos)
}
function getBuscarProductos(xhttp) {
    var respuesta = xhttp.responseText;
    if(respuesta == ""){
        $('#tabla').html("Sin resultados...");
        return 0;
    } 
    var arrayJson = respuesta.split("|");
    var html = "";
    html += '<table class="table table-sm">';
    html += '            <thead style="background:rgba(47, 71, 92, 0.718);">';
    html += '                <tr>';
    html += '                    <th scope="col">Codigo</th>';
    html += '                    <th scope="col">Descripción</th>';
    html += '                    <th scope="col">Precio</th>';
    html += '                    <th scope="col" class="esconder">Plano</th>';
    html += '                </tr>';
    html += '            </thead>';
    html += '            <tbody>';

    for (var i = 0; i < arrayJson.length - 1; i++) {
        let tempJson = JSON.parse(arrayJson[i]);
        //console.log(tempJson);
        let cliente = tempJson.codigo.substr(0, 3);
        let codigo = tempJson.codigo.replace("/", "-");
        let temp = tempJson.file
        tempJson.file = temp == 1
            ? '<a href="https://empaquessyrgdl.000webhostapp.com/planos/' + cliente + '/' + codigo + '.pdf" target="_blank"><img src="elements/pdf-true.svg" class="pdf"></a>'
            : '<span id="element' + i + '" class="d-inline-block" data-toggle="popover" data-content="SIN PLANO - Solicite a su proveedor agregarlo" onclick="mensaje(\'element' + i + '\')"><img src="elements/pdf-false.svg" class="pdf" ></span>';
        let h = temp == 1 ? 'onclick="window.open(\'https://empaquessyrgdl.000webhostapp.com/planos/' + cliente + '/' + codigo + '.pdf\', \'_blank\')"' : 'onclick="mensaje(\'element' + i + '\')"';
        html += '<tr ' + h + ' class="resaltar">';
        html += '    <td scope="row">' + tempJson.codigo + '</td>';
        html += '    <td>' + tempJson.producto + '</td>';
        html += '    <td>$' + tempJson.precio + '</td>';
        html += '    <td class="esconder">' + tempJson.file + '</td>';
        html += '</tr>';


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
function mensaje(elemento) {
    $('#' + elemento).popover('show');

    setTimeout(() => {
        $('#' + elemento).popover('hide');
    }, 2000);
}

function imprimir() {
    $(".esconder").addClass("escondeExtra");
    window.print();
    $(".esconder").removeClass("escondeExtra");
    
}
