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

// Recarga el fragmento de cards y paginación
function reloadWorkers(page = 1) {
    fetch(`/workers/list_fragment/?page=${page}`)
        .then(response => response.json())
        .then(data => {
            // Reemplaza SOLO el contenido del wrapper
            document.getElementById("cards-trabajadores-wrapper").innerHTML = data.html;
            bindDeleteButtons();
            if (window.feather) feather.replace();
        });
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".delete-worker-button");
    if (!btn) return;
    const workerId = btn.dataset.id;
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
        fetch(`/workers/delete/${workerId}/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            Accept: "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              location.reload();
              Swal.fire("¡Eliminado!", "El trabajador ha sido eliminado.", "success");
            } else {
              Swal.fire("Error", data.error || "No se pudo eliminar.", "error");
            }
          });
      }
    });
  });
});