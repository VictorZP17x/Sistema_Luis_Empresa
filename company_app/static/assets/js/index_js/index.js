document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('#customCarousel .carousel-slide');
    let current = 0;
    const interval = 4000; // 4 segundos

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    setInterval(() => {
        current = (current + 1) % slides.length;
        showSlide(current);
    }, interval);
});

$(function() {
    // Scroll suave para los enlaces del header
    $('.navbar-nav a.nav-link').on('click', function(e) {
        var target = $(this).attr('href');
        if (target.startsWith('#') && $(target).length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top - 70 // Ajusta el offset si cambias la altura de la navbar
            }, 600);
        }
    });

    // Delegación para enlaces de paginación dentro de servicios
    $(document).on('click', '#servicios-section .pagination a', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function(data) {
            $('#servicios-section').html(data);
            // Scroll suave a la sección de servicios
            $('html, body').animate({
                scrollTop: $('#servicios-section').offset().top - 80
            }, 400);
        });
        return false; // Previene cualquier acción por defecto restante
    });
});