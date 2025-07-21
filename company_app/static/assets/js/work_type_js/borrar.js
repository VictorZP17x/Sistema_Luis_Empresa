document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".delete-service-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const serviceId = btn.getAttribute("data-id");
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el servicio.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/work_type/delete/${serviceId}/`, {
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
                  title: "¡Eliminado!",
                  text: "El servicio ha sido eliminado correctamente.",
                  icon: "success",
                  confirmButtonText: "OK",
                  showConfirmButton: true,
                }).then(() => {
                  window.location.reload();
                });
              } else {
                Swal.fire({
                  title: "Error",
                  text: data.error || "No se pudo eliminar el servicio.",
                  icon: "error",
                  confirmButtonText: "OK",
                  showConfirmButton: true,
                });
              }
            });
        }
      });
    });
  });
});
