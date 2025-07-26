//Validar contraseña en la modal de Añadir
document.addEventListener('DOMContentLoaded', function() {
  // Añadir cliente
  const addClientForm = document.getElementById('add-client-form');
  if (addClientForm) {
    addClientForm.addEventListener('submit', function(e) {
      const passwordInput = addClientForm.querySelector('input[name="password"]');
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

  //Validar contraseña en la modal de Editar
  const editClientForm = document.getElementById('edit-client-form');
  if (editClientForm) {
    editClientForm.addEventListener('submit', function(e) {
      const passwordInput = editClientForm.querySelector('input[name="password"]');
      // Solo validar si el campo tiene algún valor (si se va a cambiar la contraseña)
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