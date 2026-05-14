document.addEventListener('DOMContentLoaded', function () {
    const pagina = window.location.pathname.split('/').pop();
    if (pagina !== 'index.html') {
        if (localStorage.getItem('cliente_id') == null) {
            window.location.href = "index.html";
            return;
        }
    }

    if (localStorage.getItem('sesion_activa') == 'true') {
        alerta(
            "success",
            "Inicio de sesión exitoso",
            "Bienvenido " + localStorage.getItem('cliente_nombre') + "!",
            6000
        );

        localStorage.setItem('sesion_activa', 'false');
    }

});

function servidor(link, form, miFuncion) {
    if (window.navigator.onLine) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                miFuncion(this);
            }
        };
        xhttp.open("POST", link, true);
        xhttp.send(form);
    }
    else {
        alerta('Revisa tu conexión <i style="color:gray" class="fa-solid fa-wifi fa-lg"></i>');
    }
}

function alerta(tipo, titulo, mensaje, tiempo = 4000) {

    const alerta = document.getElementById('alerta');
    const icono = document.getElementById('alertaIcono');

    document.getElementById('alertaTitulo').innerText = titulo;
    document.getElementById('alertaMensaje').innerText = mensaje;

    icono.className = 'alert-icon';

    if (tipo === 'error') {

        icono.classList.add('error');
        icono.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i>';

    }
    else if (tipo === 'success') {

        icono.classList.add('success');
        icono.innerHTML = '<i class="bi bi-check-circle-fill"></i>';

    }
    alerta.classList.remove('d-none');
    clearTimeout(alerta.timer);
    alerta.timer = setTimeout(() => {
        cerrarAlerta();
    }, tiempo);
}
function cerrarAlerta() {
    document.getElementById('alerta').classList.add('d-none');
}

function mostrarCarga() {

    document
        .getElementById('loader')
        .classList
        .remove('d-none');

}

function cerrarCarga() {

    document
        .getElementById('loader')
        .classList
        .add('d-none');

}
function borrarLocalStorage() {
    localStorage.clear();
}
//funcion para rellenar de ceros y convertirlo en cadena de texto
function tresDigitos(num) {
    return String(num).padStart(3, '0');
}