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
    // Al cargar, si el campo está vacío, coloca el prefijo
    if (telefonoInput.value.trim() === "") telefonoInput.value = "+58 ";

    // Formato automático para teléfono al escribir
    telefonoInput.addEventListener("input", function (e) {
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
    telefonoInput.addEventListener("keydown", function (e) {
      if (
        telefonoInput.selectionStart <= 4 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });
  }

  // Validación y confirmación en un solo submit
  const form = document.getElementById("register-form");
  const btn = document.getElementById("register-btn");
  if (form && btn && telefonoInput) {
    form.addEventListener("submit", async function (e) {
      // Validación de teléfono venezolano
      const phoneValue = telefonoInput.value.replace(/\s|-/g, "");
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;
      if (!phoneRegex.test(phoneValue)) {
        e.preventDefault();
        Swal.fire({
          icon: "error",
          title: "Teléfono inválido",
          text: "El número debe ser venezolano y tener el formato correcto (ej: +58 412-123-4567).",
        });
        telefonoInput.focus();
        return false;
      }

      // Validación AJAX de datos repetidos
      e.preventDefault();
      const username = form.querySelector('[name="username"]').value;
      const email = form.querySelector('[name="email"]').value;
      const telefono = telefonoInput.value;
      const resultado = await validarDatosRepetidos(username, email, telefono);
      console.log("Resultado AJAX:", resultado); // <-- Agrega esto

      if (resultado.error) {
        Swal.fire({
          icon: "error",
          title: "Datos ya registrados",
          html: resultado.error,
          confirmButtonText: "Aceptar",
        });
        return false;
      }

      // Si todo está bien, mostrar confirmación
      Swal.fire({
        title: "¿Confirmar registro?",
        text: "¿Estás seguro de que los datos ingresados son correctos?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  }
});

// Mostrar SweetAlert de éxito solo si viene de ?registered=1
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("registered") === "1") {
  Swal.fire({
    icon: "success",
    title: "¡Registrado!",
    text: "Se han guardado los datos correctamente. Ahora puedes iniciar sesión.",
    confirmButtonText: "Aceptar",
  }).then(() => {
    window.location.href = "/login/";
  });
}

async function validarDatosRepetidos(username, email, telefono) {
  // Ajusta la URL a tu endpoint real
  const response = await fetch('/login/validar_datos/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: JSON.stringify({ username, email, telefono })
  });
  return await response.json();
}
