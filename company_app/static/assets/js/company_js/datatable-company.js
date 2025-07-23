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

//Mostrar descripción de la empresa
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".description-company-button")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var description = btn.getAttribute("data-description") || "";
        document.getElementById("company-description-modal").textContent =
          description;
      });
    });
});

// Mostrar la foto en la modal
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".show-photo-modal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const photoUrl = btn.getAttribute("data-photo-url");
      document.getElementById("company-photo-modal-img").src = photoUrl;
      new bootstrap.Modal(document.getElementById("photoModal")).show();
    });
  });
});
