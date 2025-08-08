document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function(e) {
        const btnGeneral = e.target.closest('.btn-pdf-general');
        if (btnGeneral) {
            window.location.href = btnGeneral.getAttribute('data-href');
            return;
        }
        const btnIndividual = e.target.closest('.btn-pdf-individual');
        if (btnIndividual) {
            window.location.href = btnIndividual.getAttribute('data-href');
        }
    });
});