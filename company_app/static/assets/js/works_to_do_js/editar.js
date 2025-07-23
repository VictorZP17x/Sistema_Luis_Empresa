$(document).ready(function () {
    $('#edit-fk_company, #edit-fk_user, #edit-fk_work_type').select2({
        placeholder: "Seleccionar",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#edit-works_to_do-modal')
    });

    $('.edit-works_to_do-button').click(function () {
        $('#edit-id').val($(this).data('id'));
        $('#edit-name').val($(this).data('name'));
        $('#edit-description').val($(this).data('description'));
        $('#edit-fk_company').val($(this).data('fk_company_id')).trigger('change');
        $('#edit-fk_user').val($(this).data('fk_user_id')).trigger('change');
        $('#edit-fk_work_type').val($(this).data('fk_work_type_id')).trigger('change');
        $('#edit-works_to_do-modal').modal('show');
    });

    $('#edit-works_to_do-form').off('submit').on('submit', function (e) {
        e.preventDefault();
        $('#edit-works_to_do-modal').modal('hide');
        setTimeout(function () {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Deseas editar este trabajo?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, editar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    $.post('/works_to_do/edit_works_to_do/', $('#edit-works_to_do-form').serialize(), function (response) {
                        if (response.success) {
                            Swal.fire('¡Editado!', 'El trabajo ha sido editado correctamente.', 'success')
                                .then(() => location.reload());
                        } else {
                            Swal.fire('Error', 'No se pudo editar el trabajo.', 'error');
                        }
                    });
                }
            });
        }, 300);
    });
});