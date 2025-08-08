$(document).ready(function () {
  $("#datatable-company").DataTable({
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      infoFiltered: "(filtrado de un total de _MAX_ registros)",
      sSearch: "Buscar:",
      sProcessing: "Procesando...",
      emptyTable: "No hay datos disponibles en la tabla",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
    },
    paging: true,
    searching: true,
    responsive: true,
    lengthChange: true,
    // Asegura que todas las columnas sean buscables
    columnDefs: [{ targets: "_all", searchable: true }],
  });
});

// Mostrar descripción de la empresa
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".description-company-button");
    if (!btn) return;
    var description = btn.getAttribute("data-description") || "";
    var services = btn.getAttribute("data-services") || "Sin servicios";
    var modalContent = `
      <strong>Servicios:</strong>
      <div class="mb-2">
        ${services.split(',').map(s => `<span class="badge bg-info me-1">${s.trim()}</span>`).join('')}
      </div>
      <strong>Descripción:</strong>
      <div>${description}</div>
    `;
    document.getElementById("company-description-modal").innerHTML = modalContent;
    // Si necesitas abrir la modal, hazlo aquí:
    // new bootstrap.Modal(document.getElementById("descriptionModal")).show();
  });
});

// Mostrar la foto en la modal
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".show-photo-modal");
    if (!btn) return;
    const photoUrl = btn.getAttribute("data-photo-url");
    document.getElementById("company-photo-modal-img").src = photoUrl;
    new bootstrap.Modal(document.getElementById("photoModal")).show();
  });
});