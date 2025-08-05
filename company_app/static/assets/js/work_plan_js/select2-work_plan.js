$('#addModal').on('shown.bs.modal', function () {
    $('#id_fk_works_to_do').select2({
        placeholder: "Seleccionar solicitud",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#addModal')
    });
});
$('#editModal').on('shown.bs.modal', function () {
    $('#edit-works-to-do').select2({
        placeholder: "Seleccionar solicitud",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#editModal')
    });
});