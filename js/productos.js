var link = "https://empaquessr.com/sistema/empaquessr_2/php/";
var pagina = 1;
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
function setBuscarProductosGrupo() {
    $('#currentPage').text(1);
    pagina = 1;
    setBuscarProductos()
}

function setBuscarProductos() {
    var id = localStorage.getItem("id");
    id = llenarCeros(id);
    let busqueda = $('#search').val();
    let cantidad = $('#grupos').val();
    //console.log(link + 'productos/cliente/select.php?search=' + busqueda + "&cliente=" + id + "&cantidad=" + cantidad + "&pagina=" + pagina);
    servidor(link + 'productos/cliente/select.php?search=' + busqueda + "&cliente=" + id + "&cantidad=" + cantidad + "&pagina=" + pagina,
        getBuscarProductos);

}
function getBuscarProductos(xhttp) {
    var respuesta = xhttp.responseText;
    if (respuesta == "") {
        $('#tabla').html("Sin Productos...");
        return 0;
    }
    var arrayJson = respuesta.split("|");
    var id = localStorage.getItem("id");

    // Generar filas dinámicamente
    let filas = arrayJson
        .slice(0, -2) // quitamos los dos últimos vacíos
        .map((item, i) => {
            let tempJson = JSON.parse(item);
            let cliente = tempJson.codigo.substr(0, 3);
            let producto = tempJson.codigo.split("/")[1];
            let tienePlano = tempJson.file == 1;

            let fileHtml = tienePlano
                ? '<img src="elements/pdf-true.svg" class="pdf">'
                : `<span id="element${i}" class="d-inline-block" 
             data-toggle="popover" 
             data-content="SIN PLANO - Solicite a su proveedor agregarlo" 
             onclick="mensaje('element${i}')">
             <img src="elements/pdf-false.svg" class="pdf">
         </span>`;

            let evento = tienePlano
                ? `onclick="visorphp('${cliente}','${producto}','${id}')"`
                : `onclick="mensaje('element${i}')"`;

            return `
      <tr ${evento} class="resaltar">
        <td scope="row">${tempJson.codigo}</td>
        <td>${tempJson.producto}</td>
        <td>$${tempJson.precio}</td>
        <td class="esconder">${fileHtml}</td>
      </tr>
    `;
        })
        .join("");

    // Generar tabla completa
    let html = `
  <table class="table table-sm">
    <thead style="background:rgba(47, 71, 92, 0.718);">
      <tr>
        <th scope="col">Codigo</th>
        <th scope="col">Descripción</th>
        <th scope="col">Precio</th>
        <th scope="col" class="esconder">Plano</th>
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

function visorphp(cliente, producto, id) {
    let win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`
  <iframe src="https://empaquessr.com/sistema/empaquessr_2/php/productos/visor.php?cliente=${cliente}&producto=${producto}&id=${id}" 
          style="width:100%;height:100%;border:none;"></iframe>
`);
}
function cambiarPagina(paginaCambio) {
    pagina += paginaCambio;
    setBuscarProductos();
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
