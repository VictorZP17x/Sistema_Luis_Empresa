$(document).ready(function () {
  // Inicializa select2 para empresa
  $("#worker-company").select2({
    placeholder: "Seleccione una empresa",
    width: "100%",
    dropdownParent: $("#add-worker-modal"),
  });

  $("#worker-services").select2({
    placeholder: "Seleccione los servicios",
    width: "100%",
    dropdownParent: $("#add-worker-modal"),
  });

  // Cuando cambia la empresa seleccionada
  $("#worker-company").on("change", function () {
    var companyId = $(this).val();
    filterWorkTypes(companyId, "#worker-services");
  });

  // Al abrir el modal de añadir (por si ya hay una empresa seleccionada)
  $("#add-worker-modal").on("shown.bs.modal", function () {
    var companyId = $("#worker-company").val();
    filterWorkTypes(companyId, "#worker-services");
  });

  // Confirmación y envío AJAX con validaciones
  $("#add-worker-form").on("submit", function (e) {
    e.preventDefault();

    // --- VALIDACIÓN DE CONTRASEÑA ---
    const passwordInput = document.getElementById("worker-password");
    if (passwordInput) {
      const password = passwordInput.value;
      const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!regex.test(password)) {
        Swal.fire({
          icon: "error",
          title: "Contraseña inválida",
          text: "La contraseña debe tener al menos 8 caracteres, una letra y un número.",
        });
        passwordInput.focus();
        return false;
      }
    }

    // --- VALIDACIÓN DE TELÉFONO ---
    const phoneInput = document.getElementById("worker-phone");
    if (phoneInput) {
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;
      if (!phoneRegex.test(phoneValue)) {
        Swal.fire({
          icon: "error",
          title: "Teléfono inválido",
          text: "El número debe ser venezolano y tener el formato correcto (ej: +58 412-123-4567).",
        });
        phoneInput.focus();
        return false;
      }
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas registrar este trabajador con los datos ingresados?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Cambia a FormData para enviar archivos
        var formData = new FormData(this);

        $.ajax({
          url: addWorkerUrl,
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
          headers: { "X-Requested-With": "XMLHttpRequest" },
          success: function (response) {
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "¡Trabajador registrado!",
                text: "El trabajador se registró correctamente.",
                confirmButtonText: "Aceptar",
              }).then(() => {
                location.reload();
              });
            } else {
              let errorMsg = response.error || "Error en el registro";
              if (response.errors) {
                errorMsg = Object.values(response.errors).join("\n");
              }
              Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
              });
            }
          },
          error: function () {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error en la comunicación con el servidor.",
            });
          },
        });
      }
    });
  });
});

// --- FORMATO AUTOMÁTICO Y PREFIJO FIJO PARA TELÉFONO EN MODAL DE TRABAJADOR ---
$(document).ready(function () {
  const workerPhoneInput = document.getElementById("worker-phone");
  if (workerPhoneInput) {
    // Al abrir el modal, si está vacío, coloca el prefijo
    $("#add-worker-modal").on("shown.bs.modal", function () {
      if (workerPhoneInput.value.trim() === "") {
        workerPhoneInput.value = "+58 ";
      }
    });

    // Formato automático para teléfono al escribir
    workerPhoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Siempre inicia con 58
      if (!value.startsWith("58")) {
        value = "58" + value.replace(/^0+/, "");
      }

      // Elimina el cero si lo ponen después del prefijo
      if (value.length > 2 && value[2] === "0") {
        value = value.slice(0, 2) + value.slice(3);
      }

      value = value.slice(0, 12); // +58 y 10 números

      // Formatea como +58 412-123-4567
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

    // Evita borrar el prefijo +58
    workerPhoneInput.addEventListener("keydown", function (e) {
      if (
        workerPhoneInput.selectionStart <= 4 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });
  }
});

// Previsualización de imagen en el modal de añadir trabajador
document.addEventListener("DOMContentLoaded", function () {
  const photoInput = document.getElementById("worker-photo");
  const previewImg = document.getElementById("worker-photo-preview");
  if (photoInput && previewImg) {
    photoInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          previewImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        // Si se elimina la selección, vuelve a la imagen por defecto
        previewImg.src = "{% static 'assets/img/default-user.png' %}";
      }
    });
  }
});
