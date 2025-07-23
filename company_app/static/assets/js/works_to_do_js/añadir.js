$(document).ready(function () {
    // Inicializa select2
    $('#add-fk_company, #add-fk_user, #add-fk_work_type').select2({
        placeholder: "Seleccionar",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#register-works_to_do-modal')
    });

    // Añadir trabajo
    $('#add-works_to_do-form').submit(function (e) {
        e.preventDefault();
        // Cierra el modal antes de mostrar SweetAlert2
        $('#register-works_to_do-modal').modal('hide');
        setTimeout(function () {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Deseas registrar este trabajo?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, registrar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    $.post('/works_to_do/add_works_to_do/', $('#add-works_to_do-form').serialize(), function (response) {
                        if (response.success) {
                            Swal.fire('¡Registrado!', 'El trabajo ha sido registrado correctamente.', 'success')
                                .then(() => location.reload());
                        } else {
                            Swal.fire('Error', 'No se pudo registrar el trabajo.', 'error');
                        }
                    });
                }
            });
        }, 300);
    });
});