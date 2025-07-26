document.addEventListener('DOMContentLoaded', function() {
  // Validación para registro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const password = document.getElementById('password-input').value;
      const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!regex.test(password)) {
        e.preventDefault();
        Swal.fire({
          icon: "error",
          title: "Contraseña inválida",
          text: "La contraseña debe tener al menos 8 caracteres, una letra y un número."
        });
      }
    });
  }

  // Validación para login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const passwordInput = loginForm.querySelector('input[name="password"]');
      if (passwordInput) {
        const password = passwordInput.value;
        const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!regex.test(password)) {
          e.preventDefault();
          Swal.fire({
            icon: "error",
            title: "Contraseña inválida",
            text: "La contraseña debe tener al menos 8 caracteres, una letra y un número."
          });
        }
      }
    });
  }
});