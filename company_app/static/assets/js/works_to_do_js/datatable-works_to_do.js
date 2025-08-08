$(document).ready(function () {
  $("#datatable-works_to_do").DataTable({
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
    // DOM igual al de company
    dom:
      "<'row mb-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row mt-3'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 d-flex justify-content-end'p>>",
  });

  //Mostrar descripción del trabajo
  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".description-works_to_do-button");
    if (!btn) return;
    var description = btn.getAttribute("data-description") || "";
    document.getElementById("works_to_do-description-modal").textContent = description;
  });
});
