document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".edit-service-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const description = btn.getAttribute("data-description");
      document.getElementById("edit-service-id").value = id;
      document.getElementById("edit-name").value = name;
      document.getElementById("edit-description").value = description;
      // Guarda valores originales
      document.getElementById("edit-name").setAttribute("data-original", name);
      document.getElementById("edit-description").setAttribute("data-original", description);
      const modal = new bootstrap.Modal(document.getElementById("edit-modal"));
      modal.show();
    });
  });

  document
    .getElementById("edit-service-form")
    .addEventListener("submit", function (e) {
      // Detección de cambios
      const nameInput = document.getElementById("edit-name");
      const descInput = document.getElementById("edit-description");
      const nameChanged = nameInput.value !== nameInput.getAttribute("data-original");
      const descChanged = descInput.value !== descInput.getAttribute("data-original");

      if (!(nameChanged || descChanged)) {
        e.preventDefault();
        Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se detectaron cambios para guardar.",
        });
        return false;
      }

      e.preventDefault();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas editar los datos de este servicio?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, Editar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const form = e.target;
          const data = new FormData(form);
          fetch("/work_type/edit_service/", {
            method: "POST",
            body: data,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                Swal.fire({
                  title: "¡Editado!",
                  text: "El servicio ha sido editado correctamente.",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                  location.reload();
                });
              } else {
                Swal.fire("Error", "No se pudo editar el servicio.", "error");
              }
            });
        }
      });
    });
});