document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function(e) {
        const btnGeneral = e.target.closest('.btn-pdf-general');
        if (btnGeneral) {
            Swal.fire({
                title: 'Generando PDF...',
                text: 'Por favor espera unos segundos.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            setTimeout(function() {
                Swal.close(); // Cierra el spinner antes de redirigir
                window.location.href = btnGeneral.getAttribute('data-href');
            }, 1200);
            return;
        }
        const btnIndividual = e.target.closest('.btn-pdf-individual');
        if (btnIndividual) {
            Swal.fire({
                title: 'Generando PDF...',
                text: 'Por favor espera unos segundos.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            setTimeout(function() {
                Swal.close();
                window.location.href = btnIndividual.getAttribute('data-href');
            }, 1200);
        }
    });
});