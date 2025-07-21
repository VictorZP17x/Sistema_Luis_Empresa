document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-service-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas registrar este servicio?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // AJAX para enviar el formulario
          const formData = new FormData(form);
          fetch("", {
            method: "POST",
            body: formData,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                Swal.fire({
                  title: "¡Registrado!",
                  text: "El servicio ha sido registrado correctamente.",
                  icon: "success",
                  confirmButtonText: "OK",
                  showConfirmButton: true,
                }).then(() => {
                  window.location.reload();
                });
                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById("register-modal"));
                modal.hide();
              } else {
                Swal.fire({
                  title: "Error",
                  text: "No se pudo registrar el servicio.",
                  icon: "error",
                  confirmButtonText: "OK",
                  showConfirmButton: true,
                });
              }
            });
        }
      });
    });
  }

  // Mostrar descripción en el modal
  document.querySelectorAll(".description-service-button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const desc = this.getAttribute("data-description");
      document.getElementById("service-description-modal").textContent = desc;
    });
  });
});
