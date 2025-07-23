document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("datatable-user").addEventListener("click", function (e) {
    const btn = e.target.closest(".profile-user-button");
    if (!btn) return;

    const userId = btn.dataset.id;
    const currentRole = parseInt(btn.dataset.role, 10);

    let title, text, confirmButtonText, successText;
    if (currentRole === 1) {
      title = "¿Estás seguro?";
      text = "¿Deseas cambiar este usuario a administrador?";
      confirmButtonText = "Sí, cambiar a administrador";
      successText = "¡El usuario ahora es administrador!";
    } else {
      title = "¿Estás seguro?";
      text = "¿Deseas cambiar este administrador a usuario?";
      confirmButtonText = "Sí, cambiar a usuario";
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
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
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
                // Cambia el botón según el nuevo rol
                if (data.new_role === 0) {
                  btn.className = "btn btn-secondary btn-sm profile-user-button";
                  btn.setAttribute("data-role", "0");
                  btn.innerHTML = '<span class="pc-micon"><i class="bi bi-person-gear"></i></span>';
                } else {
                  btn.className = "btn btn-success btn-sm profile-user-button";
                  btn.setAttribute("data-role", "1");
                  btn.innerHTML = '<span class="pc-micon"><i class="bi bi-person"></i></span>';
                }
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