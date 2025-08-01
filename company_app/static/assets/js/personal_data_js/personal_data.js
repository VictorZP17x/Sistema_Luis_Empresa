document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("id_phone");
  const form = document.getElementById("personal-data-form");
  const passwordInput = document.getElementById("id_password");
  const usernameInput = document.getElementById("id_username");
  const firstNameInput = document.getElementById("id_first_name");
  const lastNameInput = document.getElementById("id_last_name");
  const emailInput = document.getElementById("id_email");

  // Guardar valores originales (excepto contraseña)
  let originalValues = {};
  if (usernameInput) originalValues.username = usernameInput.value;
  if (firstNameInput) originalValues.first_name = firstNameInput.value;
  if (lastNameInput) originalValues.last_name = lastNameInput.value;
  if (emailInput) originalValues.email = emailInput.value;
  if (phoneInput) originalValues.phone = phoneInput.value;
  if (passwordInput) passwordInput.value = "";

  // Formato y protección del campo teléfono (igual que antes)
  // ... (todo tu código de formato de teléfono igual) ...

  // Validación antes de enviar el formulario
  if (form && phoneInput) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validación de teléfono
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;

      if (
        phoneInput.value.trim() === "+58" ||
        phoneInput.value.trim() === "+58 " ||
        phoneInput.value.trim() === "" ||
        !phoneRegex.test(phoneValue)
      ) {
        Swal.fire({
          icon: "error",
          title: "Teléfono inválido",
          text: "El número debe ser venezolano y tener el formato correcto (ej: +58 412-123-4567).",
        });
        phoneInput.focus();
        return false;
      }

      // Detectar si hubo cambios
      let changed = false;
      if (usernameInput && usernameInput.value !== originalValues.username)
        changed = true;
      if (firstNameInput && firstNameInput.value !== originalValues.first_name)
        changed = true;
      if (lastNameInput && lastNameInput.value !== originalValues.last_name)
        changed = true;
      if (emailInput && emailInput.value !== originalValues.email)
        changed = true;
      if (phoneInput && phoneInput.value !== originalValues.phone)
        changed = true;
      if (passwordInput && passwordInput.value.trim() !== "") changed = true;

      if (!changed) {
        Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se detectaron cambios en tus datos personales.",
        });
        return false;
      }

      // SweetAlert de confirmación
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas guardar los cambios de tus datos personales?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Enviar formulario por AJAX
          const formData = new FormData(form);
          fetch(form.action, {
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
                  icon: "success",
                  title: "¡Éxito!",
                  text: "¡Tus datos personales se han actualizado correctamente!",
                  confirmButtonText: "Aceptar",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                }).then(() => {
                  window.location.href = "/login/";
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.error || "Ocurrió un error al guardar los datos.",
                });
              }
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al guardar los datos.",
              });
            });
        }
      });
    });
  }
});
