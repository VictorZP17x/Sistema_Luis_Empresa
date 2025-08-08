document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".profile-user-button");
    if (!btn) return;
    const userId = btn.dataset.id;
    const currentRole = parseInt(btn.dataset.role, 10);

    let title, text, confirmButtonText, successText;
    if (currentRole === 1) {
      title = "¿Estás seguro?";
      text = "¿Deseas convertir este usuario en Administrador?";
      confirmButtonText = "Sí, Convertir en Administrador";
      successText = "¡El Usuario ahora es Administrador!";
    } else {
      title = "¿Estás seguro?";
      text = "¿Deseas convertir este Administrador en Usuario?";
      confirmButtonText = "Sí, Convertir en Usuario";
      successText = "¡El Administrador ahora es Usuario!";
    }

    Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/user/toggle_role/${userId}/`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
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