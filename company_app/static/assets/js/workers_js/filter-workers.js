$(function () {
  // Buscador de trabajadores
  $(document).on("input", "#buscador-trabajadores", function () {
    const texto = $(this).val().toLowerCase();
    let visibles = 0;

    $('#cards-trabajadores > div[class*="col-"]').each(function () {
      const $col = $(this);
      const nombre = $col.find("h6").text().toLowerCase();
      const empresa = $col.find("span").first().text().toLowerCase();
      const telefono = $col.find("span").eq(1).text().toLowerCase();

      if (
        nombre.includes(texto) ||
        empresa.includes(texto) ||
        telefono.includes(texto)
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