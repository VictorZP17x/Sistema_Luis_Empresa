$(document).ready(function () {
  $("#datatable-work-type").DataTable({
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
    columnDefs: [{ targets: "_all", searchable: true }],
    dom:
      "<'row mb-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row mt-3'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="bi bi-file-earmark-excel"></i> Excel',
        className: "btn btn-success btn-sm",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="bi bi-file-earmark-pdf"></i> PDF',
        className: "btn btn-danger btn-sm",
      },
      {
        extend: "print",
        text: '<i class="bi bi-printer"></i> Imprimir',
        className: "btn btn-secondary btn-sm",
      },
    ],
  });

  $("#datatable-company").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    paging: true,
    searching: true,
    responsive: true,
    lengthChange: true,
    columnDefs: [{ targets: "_all", searchable: true }],
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".description-service-button")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var description = btn.getAttribute("data-description") || "";
        document.getElementById("service-description-modal").textContent =
          description;
      });
    });
});
