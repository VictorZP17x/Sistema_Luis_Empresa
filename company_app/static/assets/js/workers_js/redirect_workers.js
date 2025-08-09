document.addEventListener("DOMContentLoaded", function () {
  // Solo para clientes
  document.querySelectorAll(".solicitar-servicio-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Guarda datos en localStorage
      localStorage.setItem(
        "solicitud_empresa_id",
        btn.getAttribute("data-company-id")
      );
      localStorage.setItem(
        "solicitud_trabajador_id",
        btn.getAttribute("data-worker-id")
      );
      // Redirige al módulo de solicitudes de trabajo
      window.location.href = "/works_to_do/"; // Ajusta si tu URL es diferente
    });
  });
});
