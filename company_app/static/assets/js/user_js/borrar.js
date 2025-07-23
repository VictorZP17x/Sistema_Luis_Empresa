document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".delete-user-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const userId = btn.dataset.id;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el usuario permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/user/delete_user/${userId}/`, {
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
                  title: "¡Eliminado!",
                  text: "El usuario ha sido eliminado correctamente.",
                  confirmButtonText: "Aceptar",
                }).then(() => {
                  location.reload();
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.error || "No se pudo eliminar el usuario.",
                });
              }
            });
        }
      });
    });
  });
});
