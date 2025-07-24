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