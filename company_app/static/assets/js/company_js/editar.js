document.addEventListener("DOMContentLoaded", function () {
  // Abrir modal y cargar datos
  document.querySelectorAll(".edit-company-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const row = btn.closest("tr");
      document.getElementById("edit-company-id").value =
        btn.getAttribute("data-id");
      document.getElementById("edit-name").value =
        row.children[1].textContent.trim();
      document.getElementById("edit-address").value =
        row.children[2].textContent.trim();
      document.getElementById("edit-phone").value =
        row.children[3].textContent.trim();
      document.getElementById("edit-rif").value =
        row.children[4].textContent.trim();
      document.getElementById("edit-description").value =
        row
          .querySelector(".description-company-button")
          ?.getAttribute("data-description") || "";
      // Forzar el formato del teléfono
      const phoneInput = document.getElementById("edit-phone");
      if (
        phoneInput.value.trim() === "" ||
        !phoneInput.value.startsWith("+58")
      ) {
        phoneInput.value = "+58 ";
      }
      // Abre la modal
      new bootstrap.Modal(document.getElementById("edit-modal")).show();
    });
  });

  // Validación y formato igual que añadir
  const phoneInput = document.getElementById("edit-phone");
  const rifInput = document.getElementById("edit-rif");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (!value.startsWith("58")) {
        value = "58" + value.replace(/^0+/, "");
      }
      if (value.length > 2 && value[2] === "0") {
        value = value.slice(0, 2) + value.slice(3);
      }
      value = value.slice(0, 12);
      let formatted = "+58 ";
      if (value.length > 2) {
        formatted += value.slice(2, 5);
      }
      if (value.length > 5) {
        formatted += "-" + value.slice(5, 8);
      }
      if (value.length > 8) {
        formatted += "-" + value.slice(8, 12);
      }
      e.target.value = formatted;
    });
    phoneInput.addEventListener("keydown", function (e) {
      if (
        phoneInput.selectionStart <= 4 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });
  }
  if (rifInput) {
    rifInput.addEventListener("input", function (e) {
      let value = e.target.value.toUpperCase().replace(/[^VJGEPR0-9]/g, "");
      if (value.length > 1) value = value.slice(0, 1) + "-" + value.slice(1);
      if (value.length > 10)
        value = value.slice(0, 10) + "-" + value.slice(10, 11);
      e.target.value = value;
    });
  }

  // Envío del formulario con validación y SweetAlert
  document
    .getElementById("edit-company-form")
    .addEventListener("submit", function (e) {
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");
      const rifValue = rifInput.value.trim();
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;
      const rifRegex = /^[VJGEPR]-\d{8}-\d{1}$/i;

      if (!phoneRegex.test(phoneValue)) {
        e.preventDefault();
        Swal.fire({
          icon: "error",
          title: "Teléfono inválido",
          text: "El número debe ser venezolano y tener el formato correcto (ej: +58 412-123-4567).",
        });
        phoneInput.focus();
        return false;
      }
      if (!rifRegex.test(rifValue)) {
        e.preventDefault();
        Swal.fire({
          icon: "error",
          title: "RIF inválido",
          text: "El RIF debe tener el formato correcto (ej: J-12345678-9).",
        });
        rifInput.focus();
        return false;
      }

      // Envío AJAX (opcional, aquí ejemplo básico)
      e.preventDefault();
      const formData = new FormData(this);
      fetch(`/company/edit/${formData.get("company_id")}/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire(
              "¡Actualizado!",
              "La empresa ha sido actualizada.",
              "success"
            ).then(() => window.location.reload());
          } else {
            Swal.fire("Error", data.error || "No se pudo actualizar.", "error");
          }
        });
    });
});
