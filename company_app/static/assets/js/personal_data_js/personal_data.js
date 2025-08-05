document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("id_phone");
  const form = document.getElementById("personal-data-form");
  const passwordInput = document.getElementById("id_password");
  const usernameInput = document.getElementById("id_username");
  const firstNameInput = document.getElementById("id_first_name");
  const lastNameInput = document.getElementById("id_last_name");
  const emailInput = document.getElementById("id_email");
  const photoInput = document.getElementById("id_photo");
  const previewImg = document.getElementById("profile-preview");

  // Guardar valores originales (excepto contraseña)
  let originalValues = {};
  if (usernameInput) originalValues.username = usernameInput.value;
  if (firstNameInput) originalValues.first_name = firstNameInput.value;
  if (lastNameInput) originalValues.last_name = lastNameInput.value;
  if (emailInput) originalValues.email = emailInput.value;
  if (phoneInput) originalValues.phone = phoneInput.value;
  if (passwordInput) passwordInput.value = "";
  // --- GUARDAR LA FOTO ORIGINAL ---
  originalValues.photoSrc = previewImg ? previewImg.src : "";

  // Formato y protección del campo teléfono (igual que antes)
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
      // --- AGREGADO: Detectar cambio de foto ---
      if (photoInput && photoInput.files && photoInput.files.length > 0)
        changed = true;
      // --- FIN AGREGADO ---
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
                // Detectar si se cambió la contraseña
                const cambioPassword =
                  passwordInput && passwordInput.value.trim() !== "";

                if (cambioPassword) {
                  // SweetAlert para cambio de contraseña
                  Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "¡Tus datos personales se han actualizado correctamente! Ahora, debe iniciar sesión nuevamente.",
                    confirmButtonText: "Aceptar",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                  }).then(() => {
                    window.location.href = "/login/";
                  });
                } else {
                  // SweetAlert para cualquier otro cambio
                  Swal.fire({
                    icon: "success",
                    title: "¡Datos actualizados!",
                    text: "¡Tus datos personales se han actualizado correctamente!",
                    confirmButtonText: "Aceptar",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                  }).then(() => {
                    window.location.href = "/personal_data/";
                  });
                }
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

async function validarDatosPersonales(username, email, phone) {
  const response = await fetch("/personal_data/validar_datos_personales/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
    },
    body: JSON.stringify({ username, email, phone }),
  });
  return await response.json();
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("personal-data-form");
  const usernameInput = document.getElementById("id_username");
  const emailInput = document.getElementById("id_email");
  const phoneInput = document.getElementById("id_phone");

  if (form && phoneInput) {
    form.addEventListener("submit", async function (e) {
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

      // Validación de datos repetidos antes de enviar
      const username = usernameInput.value;
      const email = emailInput.value;
      const phone = phoneInput.value;

      const resultado = await validarDatosPersonales(username, email, phone);
      if (resultado.error) {
        Swal.fire({
          icon: "error",
          title: "Datos ya registrados",
          html: resultado.error,
          confirmButtonText: "Aceptar",
        });
        return false;
      }
    });
  }
});

async function validarDatosPersonales(username, email, phone) {
  const response = await fetch("/personal_data/validar_datos_personales/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
    },
    body: JSON.stringify({ username, email, phone }),
  });
  return await response.json();
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("personal-data-form");
  const usernameInput = document.getElementById("id_username");
  const emailInput = document.getElementById("id_email");
  const phoneInput = document.getElementById("id_phone");
  const photoInput = document.getElementById("id_photo");
  const previewImg = document.getElementById("profile-preview");

  if (form && phoneInput) {
    form.addEventListener("submit", async function (e) {
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
      // --- CAMBIO DE FOTO ---
      if (photoInput && photoInput.files && photoInput.files.length > 0) {
        // Si hay archivo seleccionado, es cambio
        changed = true;
      }
      // --- FIN CAMBIO DE FOTO ---
      if (!changed) {
        Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se detectaron cambios en tus datos personales.",
        });
        return false;
      }

      // Validación de datos repetidos antes de enviar
      const username = usernameInput.value;
      const email = emailInput.value;
      const phone = phoneInput.value;

      const resultado = await validarDatosPersonales(username, email, phone);
      if (resultado.error) {
        Swal.fire({
          icon: "error",
          title: "Datos ya registrados",
          html: resultado.error,
          confirmButtonText: "Aceptar",
        });
        return false;
      }
    });

    // Previsualización de imagen
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
          // Si se borra la selección, vuelve a la original
          previewImg.src = originalValues.photoSrc;
        }
      });
    }
  }
});
