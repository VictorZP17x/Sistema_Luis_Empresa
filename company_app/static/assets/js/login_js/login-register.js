function togglePassword() {
  const input = document.getElementById("password-input");
  const icon = document.getElementById("eye-icon");
  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("data-feather", "eye-off");
  } else {
    input.type = "password";
    icon.setAttribute("data-feather", "eye");
  }
  if (window.feather) feather.replace();
}
if (window.feather) feather.replace();

document.addEventListener("DOMContentLoaded", function () {
  if (window.feather) feather.replace();
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.feather) feather.replace();

  // Prefijo fijo y validación para teléfono venezolano
  const telefonoInput = document.getElementById("telefono-input");
  if (telefonoInput) {
    if (telefonoInput.value.trim() === "") telefonoInput.value = "+58";
    telefonoInput.addEventListener("input", function (e) {
      e.target.value = formatVenezuelanPhone(e.target.value);
    });
    telefonoInput.addEventListener("keydown", function (e) {
      // No permitir borrar el prefijo
      if (
        telefonoInput.selectionStart <= 3 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });
  }

  // Validación al enviar el formulario
  const form = document.querySelector("form.card-body");
  if (form && telefonoInput) {
    form.addEventListener("submit", function (e) {
      const phoneValue = telefonoInput.value.replace(/\s|-/g, "");
      // Solo permite códigos válidos venezolanos y 7 dígitos después
      const phoneRegex = /^\+58\s?(412|414|416|424|426|212)-?\d{3}-?\d{4}$/;
      if (!phoneRegex.test(telefonoInput.value)) {
        e.preventDefault();
        Swal.fire({
          icon: "error",
          title: "Teléfono inválido",
          text: "El número debe ser venezolano y tener el formato correcto (ej: +58 412-123-4567).",
        });
        telefonoInput.focus();
        return false;
      }
    });
  }
});

function formatVenezuelanPhone(raw) {
  let value = raw.replace(/\D/g, "");
  if (!value.startsWith("58")) value = "58" + value.replace(/^0+/, "");
  if (value.length > 2 && value[2] === "0")
    value = value.slice(0, 2) + value.slice(3);
  value = value.slice(0, 12);
  let formatted = "+58";
  if (value.length > 2) formatted += " " + value.slice(2, 5);
  if (value.length > 5) formatted += "-" + value.slice(5, 8);
  if (value.length > 8) formatted += "-" + value.slice(8, 12);
  return formatted;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");
  const btn = document.getElementById("register-btn");

  if (form && btn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Swal.fire({
        title: "¿Confirmar registro?",
        text: "¿Estás seguro de que los datos ingresados son correctos?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Envía el formulario realmente
          form.submit();
        }
      });
    });
  }
});

Swal.fire({
  icon: "success",
  title: "¡Registrado!",
  text: "Se han guardado los datos correctamente.",
  confirmButtonText: "Aceptar",
}).then(() => {
  window.location.href = "{% url 'login:login' %}";
});

