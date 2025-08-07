document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-user-form");
  const phoneInput = document.getElementById("id_phone");

  // Mostrar/ocultar contraseña
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = document.getElementById(this.dataset.target);
      if (input.type === "password") {
        input.type = "text";
        this.classList.add("showing");
      } else {
        input.type = "password";
        this.classList.remove("showing");
      }
    });
  });

  // Formato automático para teléfono
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (!value.startsWith("58")) {
        value = "58" + value.replace(/^0+/, "");
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

  // Validación y envío del formulario
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validación de teléfono
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

      // Validación de datos únicos
      const username = form.querySelector('[name="username"]').value;
      const email = form.querySelector('[name="email"]').value;
      const phone = form.querySelector('[name="phone"]').value;
      const resultado = await validarDatosUsuario(username, email, phone);
      if (resultado.error) {
        Swal.fire({
          icon: "error",
          title: "Datos ya registrados",
          html: resultado.error,
          confirmButtonText: "Aceptar",
        });
        return false;
      }

      // Confirmación final
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas registrar este usuario?",
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
                  text: "El usuario ha sido registrado correctamente.",
                  icon: "success",
                  confirmButtonText: "OK",
                  showConfirmButton: true,
                }).then(() => {
                  window.location.reload();
                });
                const modal = bootstrap.Modal.getInstance(
                  document.getElementById("register-user-modal")
                );
                if (modal) modal.hide();
              } else {
                let errorMsg = "No se pudo registrar el usuario.";
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

// Función para validar datos únicos vía AJAX
async function validarDatosUsuario(username, email, phone) {
  const response = await fetch('/user/validar_datos_usuario/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: JSON.stringify({ username, email, phone })
  });
  return await response.json();
}