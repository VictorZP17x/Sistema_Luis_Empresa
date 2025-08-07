$(document).ready(function () {
    $('#edit-fk_company, #edit-fk_user, #edit-worker').select2({
        placeholder: "Seleccionar",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#edit-works_to_do-modal')
    });
    $('#edit-fk_work_type').select2({
        placeholder: "Seleccionar",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#edit-works_to_do-modal'),
        multiple: true
    });

    // Al hacer click en el botón de editar
    $('.edit-works_to_do-button').click(function () {
        $('#edit-id').val($(this).data('id'));
        $('#edit-name').val($(this).data('name'));
        $('#edit-description').val($(this).data('description'));
        $('#edit-fk_company').val($(this).data('fk_company_id')).trigger('change');
        $('#edit-fk_user').val($(this).data('fk_user_id')).trigger('change');

        // Guarda valores originales
        $('#edit-name').attr('data-original', $(this).data('name'));
        $('#edit-description').attr('data-original', $(this).data('description'));
        $('#edit-fk_company').attr('data-original', $(this).data('fk_company_id'));
        $('#edit-fk_user').attr('data-original', $(this).data('fk_user_id'));

        // Filtra los servicios según la empresa del registro
        var companyId = $(this).data('fk_company_id').toString();
        filterWorkTypes(companyId, '#edit-fk_work_type');

        // Preselecciona los servicios del registro
        var workTypeIds = $(this).data('fk_work_type_id');
        if (typeof workTypeIds === 'string') {
            workTypeIds = workTypeIds.split(',').map(function (id) { return id.trim(); });
        }
        $('#edit-fk_work_type').val(workTypeIds).trigger('change');
        $('#edit-fk_work_type').attr('data-original', workTypeIds.join(','));

        // Preselecciona el trabajador actual
        var workerId = $(this).data('fk_worker_id');
        setTimeout(function () {
            $('#edit-worker').val(workerId).trigger('change');
        }, 200);

        $('#edit-works_to_do-modal').modal('show');
    });

    // Cuando cambia la empresa seleccionada en el modal de editar
    $('#edit-fk_company').on('change', function () {
        var companyId = $(this).val();
        filterWorkTypes(companyId, '#edit-fk_work_type');
        // Limpia la selección de servicios si cambias de empresa
        $('#edit-fk_work_type').val(null).trigger('change');
    });

    $('#edit-works_to_do-form').off('submit').on('submit', function (e) {
        // Detección de cambios
        const nameChanged = $('#edit-name').val() !== $('#edit-name').attr('data-original');
        const descChanged = $('#edit-description').val() !== $('#edit-description').attr('data-original');
        const companyChanged = $('#edit-fk_company').val() !== $('#edit-fk_company').attr('data-original');
        const userChanged = $('#edit-fk_user').val() !== $('#edit-fk_user').attr('data-original');
        const originalWorkTypes = ($('#edit-fk_work_type').attr('data-original') || '').split(',').filter(Boolean);
        const currentWorkTypes = $('#edit-fk_work_type').val() || [];
        const workTypesChanged = originalWorkTypes.sort().join(',') !== currentWorkTypes.sort().join(',');

        if (!(nameChanged || descChanged || companyChanged || userChanged || workTypesChanged)) {
            e.preventDefault();
            Swal.fire({
                icon: "info",
                title: "Sin cambios",
                text: "No se detectaron cambios para guardar.",
            });
            return false;
        }

        e.preventDefault();
        $('#edit-works_to_do-modal').modal('hide');
        setTimeout(function () {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Deseas editar este trabajo?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, Editar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
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