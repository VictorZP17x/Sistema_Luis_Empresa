document.addEventListener("DOMContentLoaded", function () {
  // Solo para clientes
  if (typeof IS_CLIENTE !== "undefined" && IS_CLIENTE) {
    // Si hay datos guardados en localStorage, rellenar y abrir modal
    const empresaId = localStorage.getItem("solicitud_empresa_id");
    const trabajadorId = localStorage.getItem("solicitud_trabajador_id");
    if (empresaId && trabajadorId) {
      // Espera a que el DOM y select2 estén listos
      setTimeout(function () {
        // Selecciona empresa
        const empresaSelect = document.getElementById("add-fk_company");
        if (empresaSelect) {
          empresaSelect.value = empresaId;
          if ($(empresaSelect).hasClass("select2")) {
            $(empresaSelect).trigger("change");
          }
        }
        // Selecciona trabajador
        const trabajadorSelect = document.getElementById("add-worker");
        if (trabajadorSelect) {
          trabajadorSelect.value = trabajadorId;
          if ($(trabajadorSelect).hasClass("select2")) {
            $(trabajadorSelect).trigger("change");
          }
        }
        // Abre la modal
        const modal = new bootstrap.Modal(
          document.getElementById("register-works_to_do-modal")
        );
        modal.show();
        // Limpia localStorage para que no se repita
        localStorage.removeItem("solicitud_empresa_id");
        localStorage.removeItem("solicitud_trabajador_id");
      }, 500); // Ajusta el tiempo si es necesario
    }
  }
});
