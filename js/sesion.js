document.getElementById('btn-sesion').addEventListener('click', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente
    mostrarCarga();
    let form = new FormData(document.getElementById('login-form'));
    servidor('https://empaquessr.com/sistema/cliente/sesion.php', form, function (response) {
        cerrarCarga();
        let res = JSON.parse(response.responseText);
        //console.log(res.data);
        if (res.status)
        {
            let data = res.data[0];
            localStorage.setItem('cliente_id', data.id);
            localStorage.setItem('rfc', data.rfc);
            localStorage.setItem('cliente_nombre', data.nombre);
            localStorage.setItem('sesion_activa', 'true');
            setTimeout(() => {
                window.location.href = "productos.html";
            }, 1000);

        }
        else
        {
            alerta("error", "Error al iniciar sesión", "Vuelve a intentarlo");
        }

    });
});

