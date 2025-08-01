document.addEventListener("DOMContentLoaded", function () {
  // Toggle mostrar/ocultar contraseña
  const toggleBtn = document.getElementById("toggle-personal-password");
  const passwordInput = document.getElementById("id_password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", function () {
      let iconEye = document.getElementById("icon-personal-eye");
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

  // Validación de patrón de contraseña al enviar el formulario
  const form = document.getElementById("personal-data-form");
  if (form && passwordInput) {
    form.addEventListener("submit", function (e) {
      // Solo valida si el usuario escribió algo
      if (passwordInput.value.trim() !== "") {
        const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!regex.test(passwordInput.value)) {
          e.preventDefault();
          Swal.fire({
            icon: "error",
            title: "Contraseña inválida",
            text: "La contraseña debe tener al menos 8 caracteres, una letra y un número."
          });
          passwordInput.focus();
        }
      }
    });
  }
});