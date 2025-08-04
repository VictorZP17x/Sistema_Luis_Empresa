document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".delete-worker-button").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const workerId = btn.dataset.id;
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¡Esta acción no se puede deshacer!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, borrar",
                cancelButtonText: "Cancelar"
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
                                // Elimina la card del DOM
                                btn.closest(".col-12.col-sm-6.col-md-4.col-lg-3").remove();
                                Swal.fire("¡Eliminado!", "El trabajador ha sido eliminado.", "success");
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