$(document).ready(function () {
    $(document).on('click', '.delete-works_to_do-button', function () {
        const id = $(this).data('id');
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el trabajo.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Borrar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/works_to_do/delete_works_to_do/', { id: id }, function (response) {
                    if (response.success) {
                        Swal.fire('¡Eliminado!', 'El trabajo ha sido eliminado correctamente.', 'success')
                            .then(() => location.reload());
                    } else {
                        Swal.fire('Error', 'No se pudo eliminar el trabajo.', 'error');
                    }
                });
            }
        });
    });
});