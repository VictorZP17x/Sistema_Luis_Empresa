if (window.loginError) {
  Swal.fire({
    icon: "error",
    title: "Error de autenticación",
    text: window.loginError
  });
}