document.addEventListener('DOMContentLoaded', function() {
  const addWorkerForm = document.getElementById('add-worker-form');
  if (addWorkerForm) {
    addWorkerForm.addEventListener('submit', function(e) {
      const passwordInput = addWorkerForm.querySelector('input[name="password"]');
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
          passwordInput.focus();
        }
      }
    });
  }
});