document.addEventListener('DOMContentLoaded', function () {
    // Lista de todos los selectores de modales de tu proyecto
    const modalSelectors = [
        // Dashboard
        '.modal[id^="empresaModal"]',
        '#trabajadoresModal',
        // Solicitudes de Trabajo
        '#works_to_doModal',
        '#register-works_to_do-modal',
        '#edit-works_to_do-modal',
        '#progressModal',
        '#empresaModal',
        '#trabajadoresModal',
        // Planes de Trabajo
        '#addModal',
        '#editModal',
        '#addTaskModal',
        '#editTaskModal',
        '#finishTaskModal',
        '#viewObservationModal',
        // Servicios
        '#serviceModal',
        '#register-modal',
        '#edit-modal',
        // Empresas
        '#companyModal',
        '#photoModal',
        // Cliente
        '#register-client-modal',
        '#edit-client-modal',
        // Trabajadores
        '.modal[id^="workerModal"]',
        '#add-worker-modal',
        '#edit-worker-modal',
        // Usuarios
        '#register-user-modal',
        '#edit-user-modal',
    ];
    const modals = document.querySelectorAll(modalSelectors.join(','));

    // Botones que abren modales (puedes ajustar el selector si usas otros triggers)
    const modalOpeners = document.querySelectorAll('button[data-bs-toggle="modal"], a[data-bs-toggle="modal"]');
    let lastModalButton = null;

    modalOpeners.forEach(btn => {
        btn.addEventListener('click', function () {
            lastModalButton = btn;
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            modal.removeAttribute('inert');
        });
        modal.addEventListener('hide.bs.modal', function () {
            modal.setAttribute('inert', '');
            if (modal.contains(document.activeElement)) {
                if (lastModalButton) {
                    lastModalButton.focus();
                } else {
                    document.body.focus();
                }
            }
        });
        modal.addEventListener('hidden.bs.modal', function () {
            if (lastModalButton) {
                lastModalButton.focus();
                lastModalButton = null;
            } else {
                document.body.focus();
            }
        });
    });
});