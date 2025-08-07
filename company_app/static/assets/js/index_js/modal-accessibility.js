document.addEventListener('DOMContentLoaded', function () {
    const serviceButtons = document.querySelectorAll('button[data-bs-toggle="modal"][data-bs-target^="#modalServicios"]');
    let lastServiceButton = null;

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            lastServiceButton = btn;
        });
    });

    const serviceModals = document.querySelectorAll('.modal[id^="modalServicios"]');
    serviceModals.forEach(modal => {
        // Al abrir el modal, remueve 'inert'
        modal.addEventListener('show.bs.modal', function () {
            modal.removeAttribute('inert');
        });
        // Al cerrar el modal, aplica 'inert' y mueve el foco
        modal.addEventListener('hide.bs.modal', function () {
            modal.setAttribute('inert', '');
            // Si el foco está dentro del modal, muévelo fuera
            if (modal.contains(document.activeElement)) {
                if (lastServiceButton) {
                    lastServiceButton.focus();
                } else {
                    document.body.focus();
                }
            }
        });
        // Al terminar de cerrar, asegura el foco fuera del modal
        modal.addEventListener('hidden.bs.modal', function () {
            if (lastServiceButton) {
                lastServiceButton.focus();
                lastServiceButton = null;
            } else {
                document.body.focus();
            }
        });
    });
});