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

  // Paginación AJAX sin scroll ni animación
  $(document).off("click", "#servicios-section .pagination a"); // Evita duplicados
  $(document).on("click", "#servicios-section .pagination a", function (e) {
    e.preventDefault();
    var url = $(this).attr("href");
    $.get(url, function (data) {
      $("#servicios-section").html(data);
    });
    return false;
  });
});
