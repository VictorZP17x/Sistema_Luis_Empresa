$(function () {
  // Buscador de trabajadores
  $(document).on("input", "#buscador-trabajadores", function () {
    const texto = $(this).val().toLowerCase();
    let visibles = 0;

    $('#cards-trabajadores > div[class*="col-"]').each(function () {
      const $col = $(this);

      // Nombre completo
      const nombre = $col.find("h6").text().toLowerCase();
      // Usuario
      const usuario = $col.find("span").eq(0).text().toLowerCase();
      // Empresa
      const empresa = $col.find("span").eq(1).text().toLowerCase();
      // Teléfono
      const telefono = $col.find("span").eq(2).text().toLowerCase();
      // Email (en el modal, pero lo buscamos en el DOM de la card)
      let email = "";
      const modalId = $col
        .find("button[data-bs-target^='#workerModal']")
        .attr("data-bs-target");
      if (
        modalId &&
        $(modalId + " .modal-body div:contains('Email:')").length
      ) {
        email = $(modalId + " .modal-body div:contains('Email:')")
          .text()
          .toLowerCase();
      }
      // Servicios (badges dentro del modal, pero también pueden estar en la card)
      let servicios = "";
      if (
        modalId &&
        $(modalId + " .modal-body div:contains('Servicios:')").length
      ) {
        servicios = $(modalId + " .modal-body div:contains('Servicios:')")
          .text()
          .toLowerCase();
      }

      // También buscamos los badges de servicios en la card si los tienes ahí
      servicios +=
        " " +
        $col
          .find(".badge")
          .map(function () {
            return $(this).text().toLowerCase();
          })
          .get()
          .join(" ");

      // Buscar en todos los campos
      if (
        nombre.includes(texto) ||
        usuario.includes(texto) ||
        empresa.includes(texto) ||
        telefono.includes(texto) ||
        email.includes(texto) ||
        servicios.includes(texto)
      ) {
        $col.removeClass("d-none");
        visibles++;
      } else {
        $col.addClass("d-none");
      }
    });

    // Mostrar/ocultar mensaje según resultado
    $("#no-coincidencias-trabajadores").toggle(visibles === 0);
  });

  // Paginación AJAX para trabajadores
  $(document).off("click", "#cards-trabajadores .pagination a");
  $(document).on("click", "#cards-trabajadores .pagination a", function (e) {
    e.preventDefault();
    var url = $(this).attr("href");
    $.get(url, function (data) {
      $("#cards-trabajadores").html(data);
      // Scroll para mostrar el título y las cards/paginación juntas
      var $trabajadoresSection = $("#cards-trabajadores");
      if ($trabajadoresSection.length) {
        var scrollTo = $trabajadoresSection.offset().top - 40;
        $("html, body").animate({ scrollTop: scrollTo }, 300);
      }
    });
    return false;
  });
});
