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
  // Mostrar/Ocultar contraseña
  const toggleBtn = document.getElementById("toggle-edit-password");
  const passwordInput = document.getElementById("edit-password");
  const iconEye = document.getElementById("icon-edit-eye");
  if (toggleBtn && passwordInput && iconEye) {
    toggleBtn.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconEye.classList.remove("bi-eye");
        iconEye.classList.add("bi-eye-slash");
      } else {
        passwordInput.type = "password";
        iconEye.classList.remove("bi-eye-slash");
        iconEye.classList.add("bi-eye");
      }
    });
  }

  // Abrir modal y rellenar datos
  document.querySelectorAll(".edit-user-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.getElementById("edit-user-id").value = btn.dataset.id;
      document.getElementById("edit-username").value = btn
        .closest("tr")
        .querySelector("td:nth-child(2)")
        .textContent.trim();
      document.getElementById("edit-password").value = "";
      document.getElementById("edit-first-name").value = btn.dataset.name;
      document.getElementById("edit-last-name").value = btn.dataset.lastname;
      document.getElementById("edit-email").value = btn.dataset.email;
      // Asigna el teléfono tal cual está en el data-phone
      document.getElementById("edit-phone").value = btn.dataset.phone || "";
      const modal = new bootstrap.Modal(
        document.getElementById("edit-user-modal")
      );
      modal.show();
    });
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
      if (!changed) {
        passwordInput.type = "password";
        passwordInput.value = "";
        iconEye.classList.remove("bi-eye-slash");
        iconEye.classList.add("bi-eye");
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
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
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
