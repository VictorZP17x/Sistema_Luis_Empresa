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

// Enlaza los eventos de eliminación
function bindDeleteButtons() {
    document.querySelectorAll(".delete-worker-button").forEach(function (btn) {
        btn.addEventListener("click", function () {
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
                                // Obtén la página actual
                                let currentPage = 1;
                                const activePage = document.querySelector(".pagination .active .page-link");
                                if (activePage) currentPage = parseInt(activePage.textContent);

                                // Si solo queda una card y no es la primera página, baja una página
                                const cards = document.querySelectorAll("#cards-trabajadores .col-12.col-sm-6.col-md-4.col-lg-3");
                                if (cards.length === 1 && currentPage > 1) {
                                    reloadWorkers(currentPage - 1);
                                } else {
                                    reloadWorkers(currentPage);
                                }
                                Swal.fire("¡Eliminado!", "El trabajador ha sido eliminado.", "success");
                            } else {
                                Swal.fire("Error", data.error || "No se pudo eliminar.", "error");
                            }
                        });
                }
            });
        });
    });
}

// Inicializa los eventos al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    bindDeleteButtons();
});