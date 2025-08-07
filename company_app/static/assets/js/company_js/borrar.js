document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".delete-company-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const button = this;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Borrar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const companyId = button.getAttribute("data-id");
          fetch(`/company/delete/${companyId}/`, {
            method: "POST",
            headers: {
              "X-CSRFToken": getCookie("csrftoken"),
              Accept: "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                button.closest("tr").remove();
                Swal.fire("¡Eliminado!", "La empresa ha sido eliminada.", "success");
                setTimeout(function () {
                  location.reload();
                }, 600);
              } else {
                Swal.fire("Error", data.error || "No se pudo eliminar.", "error");
              }
            });
        }
      });
    });
  });
});

// Función para obtener el CSRF token desde las cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}