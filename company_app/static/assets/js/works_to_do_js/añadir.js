$(document).ready(function () {
    // Inicializa select2
    $('#add-fk_company, #add-fk_user, #add-worker').select2({
        placeholder: "Seleccionar",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#register-works_to_do-modal')
    });
    // El de servicios es múltiple
    $('#add-fk_work_type').select2({
        placeholder: "Seleccionar",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#register-works_to_do-modal'),
        multiple: true
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

    // Cuando cambia la empresa seleccionada
    $('#add-fk_company').on('change', function () {
        var companyId = $(this).val();
        filterWorkTypes(companyId, '#add-fk_work_type');
    });

    // Al abrir el modal de añadir (por si ya hay una empresa seleccionada)
    $('#register-works_to_do-modal').on('shown.bs.modal', function () {
        var companyId = $('#add-fk_company').val();
        filterWorkTypes(companyId, '#add-fk_work_type');
    });
});