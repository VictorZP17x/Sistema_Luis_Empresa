// Mostrar SweetAlert de error del backend (usuario, email o teléfono repetido)
if (window.registerError) {
  console.log("Mostrando alerta de error:", window.registerError); // <-- Agrega esto
  let title = "Datos ya registrados";
  if (window.registerError.includes("usuario")) title = "Usuario ya registrado";
  else if (window.registerError.includes("email")) title = "Email ya registrado";
  else if (window.registerError.includes("teléfono")) title = "Teléfono ya registrado";

  Swal.fire({
    icon: "error",
    title: title,
    html: window.registerError,
    confirmButtonText: "Aceptar",
  }).then(() => {
    window.location.href = window.location.pathname;
  });

  // Bloquea el botón para evitar submit hasta que el usuario corrija
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("register-btn");
    if (btn) btn.setAttribute("data-error", "1");
    // Si el usuario edita cualquier campo, quita el error
    const form = document.getElementById("register-form");
    if (form && btn) {
      form.addEventListener("input", function () {
        btn.removeAttribute("data-error");
      });
    }
  });
}
