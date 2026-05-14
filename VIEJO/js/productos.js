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

    const respuesta = xhttp.responseText;

    if (!respuesta || respuesta.trim() === "") {
        $('#tabla').html(`
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Sin productos disponibles</p>
            </div>
        `);
        return;
    }

    const arrayJson = respuesta.split("|");
    const id = localStorage.getItem("id");

    let filas = arrayJson
        .slice(0, -2)
        .map((item, i) => {

            let tempJson = JSON.parse(item);

            let cliente = tempJson.codigo.substr(0, 3);
            let producto = tempJson.codigo.split("/")[1];
            let tienePlano = tempJson.file == 1;

            let fileHtml = tienePlano
                ? `<img src="elements/pdf-true.svg" class="pdf-icon">`
                : `
                <span id="element${i}" class="pdf-wrapper"
                    onclick="mensaje('element${i}')"
                    data-toggle="popover"
                    data-content="SIN PLANO - Solicite a su proveedor agregarlo">
                    <img src="elements/pdf-false.svg" class="pdf-icon">
                </span>
            `;

            let evento = tienePlano
                ? `onclick="visorphp('${cliente}','${producto}','${id}')"`
                : `onclick="mensaje('element${i}')"`;


            return `
                <tr class="table-row" ${evento}>
                    <td class="codigo">${tempJson.codigo}</td>
                    <td class="producto">${tempJson.producto}</td>
                    <td class="precio">$${tempJson.precio}</td>
                    <td class="plano esconder">${fileHtml}</td>
                </tr>
            `;
        }).join("");


    let html = `
        <div class="table-responsive">
            <table class="table modern-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th class="esconder">Plano</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        </div>
    `;

    $('#tabla').html(html);


    // PAGINACIÓN
    let datos = JSON.parse(arrayJson[arrayJson.length - 2]);

    $('#currentPage').text(datos.pagina_actual);
    $('#totalPages').text(' / ' + datos.paginas);

    $('#prevPage').prop('disabled', datos.pagina_actual == 1);
    $('#nextPage').prop('disabled', datos.pagina_actual == datos.paginas);
}

function visorphp(cliente, producto) {
    let win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`
        <iframe src="https://empaquessr.com/sistema/empaquessr_2/php/productos/visor.php?cliente=${cliente}&producto=${producto}" 
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
