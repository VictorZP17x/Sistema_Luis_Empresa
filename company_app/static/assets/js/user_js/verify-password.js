// Validar contraseña en la modal de Añadir
document.addEventListener('DOMContentLoaded', function() {
  const addUserForm = document.getElementById('add-user-form');
  if (addUserForm) {
    addUserForm.addEventListener('submit', function(e) {
      const passwordInput = addUserForm.querySelector('input[name="password"]');
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

  // Validar contraseña en la modal de Editar
  const editUserForm = document.getElementById('edit-user-form');
  if (editUserForm) {
    editUserForm.addEventListener('submit', function(e) {
      const passwordInput = editUserForm.querySelector('input[name="password"]');
      if (passwordInput && passwordInput.value.trim() !== "") {
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