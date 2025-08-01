function formatVenezuelanPhone(raw) {
  // Elimina todo lo que no sea número
  let value = raw.replace(/\D/g, "");

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
  return formatted;
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggle-edit-password");
  const passwordInput = document.getElementById("edit-password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", function () {
      // Busca el ícono actual cada vez
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
    });
  }

  // Abrir modal y rellenar datos
  document.querySelectorAll(".edit-client-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.getElementById("edit-client-id").value = btn.dataset.id;
      document.getElementById("edit-username").value = btn
        .closest("tr")
        .querySelector("td:nth-child(2)")
        .textContent.trim();
      document.getElementById("edit-password").value = ""; // Siempre vacío
      document.getElementById("edit-first-name").value = btn.dataset.name;
      document.getElementById("edit-last-name").value = btn.dataset.lastname;
      document.getElementById("edit-email").value = btn.dataset.email;
      // Formatea el teléfono antes de mostrarlo
      document.getElementById("edit-phone").value = formatVenezuelanPhone(btn.dataset.phone || "");
      // Mostrar modal
      const modal = new bootstrap.Modal(
        document.getElementById("edit-client-modal")
      );
      modal.show();
    });
  });

  // Validación y envío del formulario de edición
  const editForm = document.getElementById("edit-client-form");
  if (editForm) {
    let originalData = {};
    // Guardar datos originales al abrir el modal
    document
      .getElementById("edit-client-modal")
      .addEventListener("show.bs.modal", function () {
        originalData = {
          username: editForm.username.value,
          first_name: editForm.first_name.value,
          last_name: editForm.last_name.value,
          email: editForm.email.value,
          phone: editForm.phone.value,
          password: "", // No comparar contraseña
        };
      });

    async function validarDatosClienteEditar(username, email, phone, client_id) {
      const response = await fetch('/client/validar_datos_cliente/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({ username, email, phone, client_id })
      });
      return await response.json();
    }

    editForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = editForm.querySelector('[name="username"]').value;
      const email = editForm.querySelector('[name="email"]').value;
      const phone = editForm.querySelector('[name="phone"]').value;
      const client_id = editForm.querySelector('[name="client_id"]').value;

      const resultado = await validarDatosClienteEditar(username, email, phone, client_id);
      if (resultado.error) {
        Swal.fire({
          icon: "error",
          title: "Datos ya registrados",
          html: resultado.error,
          confirmButtonText: "Aceptar",
        });
        return false;
      }

      // Comprobar si hubo cambios
      let changed = false;
      for (let key in originalData) {
        if (editForm[key] && editForm[key].value !== originalData[key]) {
          changed = true;
          break;
        }
      }
      if (!changed) {
        // Siempre ocultar la contraseña, restaurar el icono y limpiar el campo
        passwordInput.type = "password";
        passwordInput.value = ""; // Asegura que el campo esté vacío
        iconEye.classList.remove("bi-eye-slash");
        iconEye.classList.add("bi-eye");
        // Opcional: fuerza el placeholder
        passwordInput.placeholder = "Solo puedes cambiar la contraseña mas no verla.";
        Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se detectaron cambios al editar.",
        });
        return;
      }

      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas editar este cliente?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Enviar datos por AJAX
          const formData = new FormData(editForm);
          fetch("/client/edit_client/", { // <-- Cambia la ruta aquí
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
                  text: "El cliente ha sido editado correctamente.",
                }).then(() => {
                  location.reload();
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.error || "No se pudo editar el cliente.",
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
    // Al cargar, si el campo está vacío, coloca el prefijo
    if (phoneInput.value.trim() === "") {
      phoneInput.value = "+58 ";
    }

    // Formato automático para teléfono al escribir
    phoneInput.addEventListener("input", function (e) {
      e.target.value = formatVenezuelanPhone(e.target.value);
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
  const editForm = document.getElementById("edit-client-form");
  if (editForm && phoneInput) {
    editForm.addEventListener("submit", function (e) {
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