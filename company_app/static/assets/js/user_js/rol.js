document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".profile-user-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const userId = btn.dataset.id;
      const currentRole = parseInt(btn.dataset.role, 10);

      // Lógica personalizada para cada botón
      let title, text, confirmButtonText, successText;
      if (currentRole === 1) {
        // Botón verde: usuario → admin
        title = "¿Estás seguro?";
        text = "¿Deseas convertir este usuario en administrador?";
        confirmButtonText = "Sí, convertir en administrador";
        successText = "¡El usuario ahora es administrador!";
      } else {
        // Botón gris: admin → usuario
        title = "¿Estás seguro?";
        text = "¿Deseas convertir este administrador en usuario?";
        confirmButtonText = "Sí, convertir en usuario";
        successText = "¡El administrador ahora es usuario!";
      }

      Swal.fire({
        title: title,
        text: text,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/user/toggle_role/${userId}/`, {
            method: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "X-CSRFToken": document.querySelector(
                "[name=csrfmiddlewaretoken]"
              ).value,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                Swal.fire({
                  icon: "success",
                  title: "¡Rol cambiado!",
                  text: successText,
                  confirmButtonText: "Aceptar",
                }).then(() => {
                  // Recarga la página para actualizar los botones y roles
                  window.location.reload();
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.error || "No se pudo cambiar el rol.",
                });
              }
            });
        }
      });
    });
  });
});
