document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".delete-client-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const clientId = btn.dataset.id;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el cliente permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/client/delete_client/${clientId}/`, {
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
                  title: "¡Eliminado!",
                  text: "El cliente ha sido eliminado correctamente.",
                  confirmButtonText: "Aceptar"
                }).then(() => {
                  location.reload();
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.error || "No se pudo eliminar el cliente.",
                });
              }
            });
        }
      });
    });
  });
});