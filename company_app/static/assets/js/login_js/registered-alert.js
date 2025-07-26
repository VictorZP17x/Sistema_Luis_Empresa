Swal.fire({
    icon: "success",
    title: "¡Registrado!",
    text: "Se han guardado los datos correctamente. Ahora puedes iniciar sesión.",
    confirmButtonText: "Aceptar"
}).then(() => {
    // Elimina el parámetro ?registered=1 de la URL sin recargar
    if (window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.delete('registered');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }
});