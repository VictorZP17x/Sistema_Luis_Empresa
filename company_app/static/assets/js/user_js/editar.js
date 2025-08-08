function formatVenezuelanPhone(raw) {
  let value = raw.replace(/\D/g, "");
  if (!value.startsWith("58")) value = "58" + value.replace(/^0+/, "");
  if (value.length > 2 && value[2] === "0")
    value = value.slice(0, 2) + value.slice(3);
  value = value.slice(0, 12);
  let formatted = "+58 ";
  if (value.length > 2) formatted += value.slice(2, 5);
  if (value.length > 5) formatted += "-" + value.slice(5, 8);
  if (value.length > 8) formatted += "-" + value.slice(8, 12);
  return formatted;
}

document.addEventListener("DOMContentLoaded", function () {
  // Toggle de mostrar/ocultar contraseña en modal editar usuario
  const toggleBtn = document.getElementById("toggle-edit-password");
  const passwordInput = document.getElementById("edit-password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", function () {
      // Siempre busca el ícono actual después de feather.replace()
      let iconEye = document.getElementById("icon-edit-eye");
      if (!iconEye) return;
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconEye.setAttribute("data-feather", "eye-off");
      } else {
        passwordInput.type = "password";
        iconEye.setAttribute("data-feather", "eye");
      }
      if (window.feather) feather.replace();
      // Vuelve a buscar el ícono después de reemplazar
      // para asegurar que el evento siga funcionando
    });
  }

  // Abrir modal y rellenar datos
  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".edit-user-button");
    if (!btn) return;
    document.getElementById("edit-user-id").value = btn.dataset.id;
    document.getElementById("edit-username").value = btn.dataset.username || "";
    document.getElementById("edit-password").value = "";
    document.getElementById("edit-first-name").value = btn.dataset.name;
    document.getElementById("edit-last-name").value = btn.dataset.lastname;
    document.getElementById("edit-email").value = btn.dataset.email;
    document.getElementById("edit-phone").value = btn.dataset.phone || "";
    new bootstrap.Modal(document.getElementById("edit-user-modal")).show();
  });

  // Validación y envío del formulario de edición
  const editForm = document.getElementById("edit-user-form");
  if (editForm) {
    let originalData = {};
    document
      .getElementById("edit-user-modal")
      .addEventListener("show.bs.modal", function () {
        originalData = {
          username: editForm.username.value,
          first_name: editForm.first_name.value,
          last_name: editForm.last_name.value,
          email: editForm.email.value,
          phone: editForm.phone.value,
          password: "",
        };
      });

    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Comprobar si hubo cambios
      let changed = false;
      for (let key in originalData) {
        if (editForm[key] && editForm[key].value !== originalData[key]) {
          changed = true;
          break;
        }
      }
      // Reinicia el estado del campo y el ícono si no hay cambios
      const passwordInput = document.getElementById("edit-password");
      const iconEye = document.getElementById("icon-edit-eye");
      if (!changed) {
        passwordInput.type = "password";
        passwordInput.value = "";
        iconEye.setAttribute("data-feather", "eye");
        if (window.feather) feather.replace();
        passwordInput.placeholder =
          "Solo puedes cambiar la contraseña mas no verla.";
        Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se detectaron cambios al editar.",
        });
        return;
      }

      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas editar este usuario?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Editar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData(editForm);
          fetch("/user/edit_user/", {
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
                  title: "¡Editado!",
                  text: "El usuario ha sido editado correctamente.",
                }).then(() => {
                  location.reload();
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.error || "No se pudo editar el usuario.",
                });
              }
            });
        }
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("edit-phone");
  if (phoneInput) {
    if (phoneInput.value.trim() === "") phoneInput.value = "+58 ";
    phoneInput.addEventListener("input", function (e) {
      e.target.value = formatVenezuelanPhone(e.target.value);
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
  // Validación antes de enviar el formulario
  const editForm = document.getElementById("edit-user-form");
  if (editForm && phoneInput) {
    editForm.addEventListener("submit", function (e) {
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");
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

async function validarDatosUsuarioEditar(username, email, phone, user_id) {
  const response = await fetch("/user/validar_datos_usuario/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
    },
    body: JSON.stringify({ username, email, phone, user_id }),
  });
  return await response.json();
}

document.addEventListener("DOMContentLoaded", function () {
  // ...existing code...
  const editForm = document.getElementById("edit-user-form");
  if (editForm) {
    let originalData = {};
    document
      .getElementById("edit-user-modal")
      .addEventListener("show.bs.modal", function () {
        originalData = {
          username: editForm.username.value,
          first_name: editForm.first_name.value,
          last_name: editForm.last_name.value,
          email: editForm.email.value,
          phone: editForm.phone.value,
          password: "",
        };
      });

    editForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = editForm.querySelector('[name="username"]').value;
      const email = editForm.querySelector('[name="email"]').value;
      const phone = editForm.querySelector('[name="phone"]').value;
      const user_id = editForm.querySelector('[name="user_id"]').value;

      const resultado = await validarDatosUsuarioEditar(
        username,
        email,
        phone,
        user_id
      );
      if (resultado.error) {
        Swal.fire({
          icon: "error",
          title: "Datos ya registrados",
          html: resultado.error,
          confirmButtonText: "Aceptar",
        });
        return false;
      }

      // ...lógica de cambios y SweetAlert "Sin cambios"...
      // ...resto del código...
    });
  }
  // ...existing code...
});
