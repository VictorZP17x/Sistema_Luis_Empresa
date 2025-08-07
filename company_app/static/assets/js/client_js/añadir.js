document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-client-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = form.querySelector('[name="username"]').value;
      const email = form.querySelector('[name="email"]').value;
      const phone = form.querySelector('[name="phone"]').value;

      const resultado = await validarDatosCliente(username, email, phone);
      if (resultado.error) {
        Swal.fire({
          icon: "error",
          title: "Datos ya registrados",
          html: resultado.error,
          confirmButtonText: "Aceptar",
        });
        return false;
      }

      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas registrar este cliente?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Registrar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
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
                  text: "El cliente ha sido registrado correctamente.",
                  icon: "success",
                  confirmButtonText: "OK",
                  showConfirmButton: true,
                }).then(() => {
                  window.location.reload();
                });
                const modal = bootstrap.Modal.getInstance(
                  document.getElementById("register-client-modal")
                );
                modal.hide();
              } else {
                let errorMsg = "No se pudo registrar el cliente.";
                if (data.errors && data.errors.email) {
                  errorMsg = data.errors.email.join(" ");
                }
                Swal.fire({
                  title: "Error",
                  text: errorMsg,
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
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("id_password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", function () {
      let iconEye = document.getElementById("icon-eye");
      if (!iconEye) return;
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconEye.setAttribute("data-feather", "eye-off");
      } else {
        passwordInput.type = "password";
        iconEye.setAttribute("data-feather", "eye");
      }
      if (window.feather) feather.replace();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("id_phone");
  if (phoneInput) {
    // Al cargar, si el campo está vacío, coloca el prefijo
    if (phoneInput.value.trim() === "") {
      phoneInput.value = "+58 ";
    }

    // Formato automático para teléfono al escribir
    phoneInput.addEventListener("input", function (e) {
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
    phoneInput.addEventListener("keydown", function (e) {
      if (
        phoneInput.selectionStart <= 4 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });
  }

  // Validación antes de enviar el formulario
  const form = document.getElementById("add-client-form");
  if (form && phoneInput) {
    form.addEventListener("submit", function (e) {
      // Elimina espacios y guiones para validar
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");

      // Teléfono venezolano: +584121234567, +582121234567, etc.
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;

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
    });
  }
});

async function validarDatosCliente(username, email, phone) {
  const response = await fetch('/client/validar_datos_cliente/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: JSON.stringify({ username, email, phone })
  });
  return await response.json();
}
