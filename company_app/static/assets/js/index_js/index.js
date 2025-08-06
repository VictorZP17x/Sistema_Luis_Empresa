document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll("#customCarousel .carousel-slide");
  let current = 0;
  const interval = 4000; // 4 segundos

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, interval);
});

$(function () {
  // Scroll suave solo si el destino existe
  $(".navbar-nav a.nav-link").on("click", function (e) {
    var target = $(this).attr("href");
    if (target.startsWith("#")) {
      var $destino = $(target);
      if ($destino.length) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: $destino.offset().top - 70,
          },
          600
        );
      }
    }
  });

  // Paginación AJAX con scroll al centro de la sección
  $(document).off("click", "#servicios-section .pagination a");
  $(document).on("click", "#servicios-section .pagination a", function (e) {
    e.preventDefault();
    var url = $(this).attr("href");
    $.get(url, function (data) {
      $("#servicios-section").html(data);
      // Scroll para mostrar el título y las cards/paginación juntas
      var $serviciosSection = $("#servicios-section");
      if ($serviciosSection.length) {
        var scrollTo = $serviciosSection.offset().top - 40;
        $("html, body").animate({ scrollTop: scrollTo }, 300);
      }
      // Re-inicializar DataTables en las nuevas tablas
      if (window.inicializarDataTablesServicios) {
        window.inicializarDataTablesServicios();
      }
    });
    return false;
  });
});

$(function () {
  $(document).on("input", "#buscador-empresas", function () {
    const texto = $(this).val().toLowerCase();
    let visibles = 0;

    $('#cards-empresas > div[class*="col-"]').each(function () {
      const $col = $(this);
      const nombre = $col.find("h6").text().toLowerCase();
      const direccion = $col.find(".empresa-direccion").text().toLowerCase();
      const telefono = $col.find(".empresa-telefono").text().toLowerCase();
      const rif = $col.find(".empresa-rif").text().toLowerCase();

      if (
        nombre.includes(texto) ||
        direccion.includes(texto) ||
        telefono.includes(texto) ||
        rif.includes(texto)
      ) {
        $col.removeClass("d-none");
        visibles++;
      } else {
        $col.addClass("d-none");
      }
    });

    // Mostrar/ocultar mensaje según resultado
    $("#no-coincidencias-empresas").toggle(visibles === 0);
  });
});

$(function () {
  $(document).on("click", ".btn-ver-mas", function () {
    const nombre = $(this).data("nombre");
    const servicios = $(this).data("servicios");
    $("#modalEmpresaNombre").text(nombre);

    if (servicios && servicios.trim() !== "") {
      const badges = servicios
        .split(",")
        .map((s) => `<span class="badge bg-info me-1">${s.trim()}</span>`)
        .join(" ");
      $("#modalEmpresaServicios").html(`<strong>Servicios:</strong> ${badges}`);
    } else {
      $("#modalEmpresaServicios").html(
        '<span class="text-muted">Sin servicios</span>'
      );
    }

    const modal = new bootstrap.Modal(
      document.getElementById("modalServiciosEmpresa")
    );
    modal.show();
  });
});

window.inicializarDataTablesServicios = function () {
  $('[id^="datatable-servicios-"]').each(function () {
    if (!$.fn.DataTable.isDataTable(this)) {
      $(this).DataTable({
        paging: true,
        pageLength: 3,
        lengthChange: false,
        searching: true,
        ordering: false,
        info: false,
        language: {
          search: "Buscar servicio:",
          paginate: {
            previous: "Anterior",
            next: "Siguiente",
          },
          zeroRecords: "No hay servicios",
        },
      });
    }
  });
};
$(function () {
  window.inicializarDataTablesServicios();
});
