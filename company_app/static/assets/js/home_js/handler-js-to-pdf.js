document.addEventListener('DOMContentLoaded', function () {
    // Manejar el click para generar PDF General (Solicitudes de Trabajo)
    document.querySelectorAll('.btn-pdf-general').forEach(function(btn) {
        btn.addEventListener('click', function() {
            window.location.href = btn.getAttribute('data-href');
        });
    });
    // Manejar el click para generar PDF Individual (Solicitudes de Trabajo)
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-pdf-individual');
        if (btn) {
            window.location.href = btn.getAttribute('data-href');
        }
    });
});