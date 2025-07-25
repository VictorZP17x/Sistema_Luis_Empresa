$(document).ready(function () {
    $('.change-status-works_to_do-button').click(function () {
        var id = $(this).data('id');
        var status = $(this).data('status');
        var nextStatus = parseInt(status) + 1;
        var statusName = nextStatus === 1 ? "En Proceso" : "Terminado";
        Swal.fire({
            title: "¿Cambiar estado?",
            text: "¿Deseas cambiar el estado a '" + statusName + "'?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/works_to_do/change_status_works_to_do/', { id: id }, function (response) {
                    if (response.success) {
                        Swal.fire('¡Actualizado!', 'El estado ha sido cambiado.', 'success')
                            .then(() => location.reload());
                    } else {
                        Swal.fire('Error', response.msg || 'No se pudo cambiar el estado.', 'error');
                    }
                });
            }
        });
    });
});