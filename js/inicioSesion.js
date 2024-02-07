function setEntrar() {
    var rfc = $('#rfc').val();
    var contrasena = $('#contrasena').val();
    if (!vacio(rfc, contrasena)) {
        
        servidor('https://empaquessr.com/sistema/php/usuario/select.php?rfc='+rfc+'&contrasena='+contrasena,getEntrar)
        
    }
    else alert("Espacios vacios!");
}
function getEntrar(xhttp)
{
    var respuesta = xhttp.responseText;
    //alert(respuesta);
    //var array;
    if(respuesta != "" || respuesta != 0){
        respuesta = respuesta.split(',');
        let id = respuesta[0];
        let rfc = respuesta[1];
        let nombre = respuesta[2];

        localStorage.setItem("id", id);
        localStorage.setItem("rfc",rfc);
        localStorage.setItem("nombre", nombre);
        window.location.href = "productos.html";
        //alert(respuesta);
    }
    else{
        alert("RFC o contraseña incorrecta!");
    }
    
    
}

function vacio(...datos) {
    for (i = 0; i < datos.length; i++) if (datos[i] == "") return true;

    return false;
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
        alerta('Revisa tu conexión <i style="color:gray" class="fa-solid fa-wifi fa-lg"></i>');
    }
}

function primero()
{
    //alert(localStorage.getItem("rfc"));
    if(localStorage.getItem("rfc") != null) window.location.href = "productos.html";
}