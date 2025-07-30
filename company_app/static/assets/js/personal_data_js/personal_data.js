document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("id_phone");
  if (phoneInput) {
    // Normaliza el valor inicial: si empieza con +58 pero no tiene espacio, lo agrega
    if (phoneInput.value.startsWith("+58") && !phoneInput.value.startsWith("+58 ")) {
      phoneInput.value = "+58 " + phoneInput.value.slice(4);
    }
    // Si el campo está vacío o solo tiene +58, coloca el prefijo
    if (phoneInput.value.trim() === "" || phoneInput.value.trim() === "+58") {
      phoneInput.value = "+58 ";
    }

    // Formato automático para teléfono al escribir
    phoneInput.addEventListener("input", function (e) {
      // Si el usuario intenta borrar el prefijo, lo restauramos SIEMPRE
      if (!e.target.value.startsWith("+58 ")) {
        e.target.value = "+58 ";
      }
      // Si solo queda el prefijo, no formateamos nada
      if (e.target.value.trim() === "+58") {
        e.target.value = "+58 ";
        return;
      }
      let value = e.target.value.replace(/\D/g, "");

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
      e.target.value = formatted;
    });

    // Evita borrar el prefijo +58 con Backspace o Delete
    phoneInput.addEventListener("keydown", function (e) {
      if (
        phoneInput.selectionStart <= 4 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
      // Si selecciona todo y presiona una tecla de borrado
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        phoneInput.selectionStart === 0 &&
        phoneInput.selectionEnd >= phoneInput.value.length
      ) {
        e.preventDefault();
        phoneInput.value = "+58 ";
      }
    });

    // Si el usuario borra todo, vuelve a poner el prefijo
    phoneInput.addEventListener("blur", function (e) {
      if (!phoneInput.value.startsWith("+58 ")) {
        phoneInput.value = "+58 ";
      }
      if (phoneInput.value.trim() === "" || phoneInput.value.trim() === "+58") {
        phoneInput.value = "+58 ";
      }
    });
  }

  // Validación antes de enviar el formulario
  const form = document.querySelector("form");
  if (form && phoneInput) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validación de teléfono
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;

      if (
        phoneInput.value.trim() !== "+58" &&
        phoneInput.value.trim() !== "+58 " &&
        !phoneRegex.test(phoneValue)
      ) {
        Swal.fire({
          icon: "error",
          title: "Teléfono inválido",
          text: "El número debe ser venezolano y tener el formato correcto (ej: +58 412-123-4567).",
        });
        phoneInput.focus();
        return false;
      }

      // SweetAlert de confirmación
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas guardar los cambios de tus datos personales?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Bandera para mostrar el SweetAlert de éxito tras redirección
          localStorage.setItem("personalDataSaved", "1");
          form.submit();
        }
      });
    });
  }

  // Mostrar SweetAlert de éxito solo si se acaba de guardar
  document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("personalDataSaved") === "1") {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "¡Tus datos personales se han actualizado correctamente!",
      });
      localStorage.removeItem("personalDataSaved");
    }
  });
});