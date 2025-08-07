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

      const photoPreview = document.getElementById("edit-photo-preview");
      const rowPhotoBtn = row.querySelector(".show-photo-modal");
      if (rowPhotoBtn && rowPhotoBtn.getAttribute("data-photo-url")) {
        photoPreview.src = rowPhotoBtn.getAttribute("data-photo-url");
      } else {
        photoPreview.src = "https://via.placeholder.com/120?text=Sin+foto";
      }

      // Guarda los valores originales en atributos data-*
      document.getElementById("edit-name").setAttribute("data-original", document.getElementById("edit-name").value);
      document.getElementById("edit-address").setAttribute("data-original", document.getElementById("edit-address").value);
      document.getElementById("edit-phone").setAttribute("data-original", document.getElementById("edit-phone").value);
      document.getElementById("edit-rif").setAttribute("data-original", document.getElementById("edit-rif").value);
      document.getElementById("edit-description").setAttribute("data-original", document.getElementById("edit-description").value);
      document.getElementById("edit-photo-preview").setAttribute("data-original", document.getElementById("edit-photo-preview").src);

      const workTypesSelect = document.getElementById("edit-work-types");
      const selectedWorkTypes = btn.getAttribute("data-work-types")?.split(",") || [];
      if (workTypesSelect) {
        Array.from(workTypesSelect.options).forEach(opt => {
          opt.selected = selectedWorkTypes.includes(opt.value);
        });
        // Guardar los servicios originales en data-original
        workTypesSelect.setAttribute("data-original", selectedWorkTypes.join(","));
      }
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

      // Validaciones...
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

      // Detectar cambios
      const nameChanged = document.getElementById("edit-name").value !== document.getElementById("edit-name").getAttribute("data-original");
      const addressChanged = document.getElementById("edit-address").value !== document.getElementById("edit-address").getAttribute("data-original");
      const phoneChanged = document.getElementById("edit-phone").value !== document.getElementById("edit-phone").getAttribute("data-original");
      const rifChanged = document.getElementById("edit-rif").value !== document.getElementById("edit-rif").getAttribute("data-original");
      const descChanged = document.getElementById("edit-description").value !== document.getElementById("edit-description").getAttribute("data-original");
      const photoInput = document.getElementById("edit-photo");
      const photoChanged = photoInput.files.length > 0;

      // Detectar cambios en servicios
      const workTypesSelect = document.getElementById("edit-work-types");
      const originalWorkTypes = (workTypesSelect.getAttribute("data-original") || "").split(",").filter(Boolean);
      // Usa Select2 para obtener los valores seleccionados
      const currentWorkTypes = $('#edit-work-types').val() || [];
      function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        return a.slice().sort().join(",") === b.slice().sort().join(",");
      }
      const workTypesChanged = !arraysEqual(originalWorkTypes, currentWorkTypes);

      if (!(nameChanged || addressChanged || phoneChanged || rifChanged || descChanged || photoChanged || workTypesChanged)) {
        e.preventDefault();
        Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se detectaron cambios para guardar.",
        });
        return false;
      }

      // Confirmación antes de guardar
      e.preventDefault();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas guardar los cambios de la empresa?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Guardar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData(this);
          fetch(`/company/edit/${formData.get("company_id")}/`, {
            method: "POST",
            headers: {
              "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
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
        }
      });
    });

  document.getElementById("edit-photo").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        document.getElementById("edit-photo-preview").src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});

$(document).ready(function () {

  $('#edit-modal').on('shown.bs.modal', function () {
    $('#edit-work-types').select2({
      placeholder: "Seleccionar servicios",
      allowClear: true,
      width: '100%',
      dropdownParent: $('#edit-modal')
    });
  });
});