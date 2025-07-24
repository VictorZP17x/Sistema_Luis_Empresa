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

$(document).ready(function() {
    // Delegación para enlaces de paginación dentro de servicios
    $('#servicios-section').on('click', '.pagination a', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function(data) {
            // Solo reemplaza el contenido interno, no el div principal
            $('#servicios-section').find('> div, nav, .row').remove(); // Limpia el contenido anterior
            $('#servicios-section').append(data); // Inserta el nuevo contenido
            // No hagas scroll aquí
        });
    });
});