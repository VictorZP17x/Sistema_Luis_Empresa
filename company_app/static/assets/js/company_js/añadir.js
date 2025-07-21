document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#register-modal form");
  if (form) {
    const phoneInput = form.querySelector('input[name="phone_number"]');
    const rifInput = form.querySelector('input[name="rif"]');

    // Al cargar, si el campo está vacío, coloca el prefijo
    if (phoneInput && phoneInput.value.trim() === "") {
      phoneInput.value = "+58 ";
    }

    // Formato automático para teléfono al escribir
    phoneInput.addEventListener("input", function (e) {
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

    // Evita borrar el prefijo +58
    phoneInput.addEventListener("keydown", function (e) {
      if (
        phoneInput.selectionStart <= 4 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });

    // Formato automático para RIF al escribir
    rifInput.addEventListener("input", function (e) {
      let value = e.target.value.toUpperCase().replace(/[^VJGEPR0-9]/g, "");
      if (value.length > 1) value = value.slice(0, 1) + "-" + value.slice(1);
      if (value.length > 10)
        value = value.slice(0, 10) + "-" + value.slice(10, 11);
      e.target.value = value;
    });

    form.addEventListener("submit", function (e) {
      // Elimina espacios y guiones para validar
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");
      const rifValue = rifInput.value.trim();

      // Teléfono venezolano: +584121234567, +582121234567, etc.
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;
      // RIF venezolano: V-12345678-9, J-12345678-9, etc.
      const rifRegex = /^[VJGEPR]-\d{8}-\d{1}$/i;

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

      if (!rifRegex.test(rifValue)) {
        e.preventDefault();
        Swal.fire({
          icon: "error",
          title: "RIF inválido",
          text: "El RIF debe tener el formato correcto (ej: J-12345678-9).",
        });
        rifInput.focus();
        return false;
      }
    });
  }

  // Vista previa de imagen al registrar
  const photoInput = document.querySelector('#register-modal input[type="file"][name="photo"]');
  const previewImg = document.getElementById('register-photo-preview');
  if (photoInput && previewImg) {
      photoInput.addEventListener('change', function (e) {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function (ev) {
                  previewImg.src = ev.target.result;
              };
              reader.readAsDataURL(file);
          } else {
              previewImg.src = "{% static 'assets/img/default-company.png' %}";
          }
      });
  }

  // SweetAlert de confirmación antes de enviar el formulario
  if (form) {
      form.addEventListener("submit", function (e) {
          e.preventDefault();
          Swal.fire({
              title: '¿Estás seguro?',
              text: "¿Deseas registrar esta empresa con los datos ingresados?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí, registrar',
              cancelButtonText: 'Cancelar'
          }).then((result) => {
              if (result.isConfirmed) {
                  form.submit();
              }
          });
      });
  }

  // Mostrar SweetAlert de éxito si la URL tiene ?success=1
  if (window.location.search.includes('success=1')) {
      Swal.fire({
          icon: 'success',
          title: '¡Empresa registrada!',
          text: 'La empresa se registró correctamente.',
          confirmButtonText: 'Aceptar'
      });
      // Limpia el parámetro de la URL para evitar mostrarlo de nuevo al recargar
      if (window.history.replaceState) {
          const url = new URL(window.location);
          url.searchParams.delete('success');
          window.history.replaceState({}, document.title, url.pathname);
      }
  }
});
