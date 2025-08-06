$(document).ready(function () {

    function filterWorkers(companyId, serviceIds, selectId) {
        var $select = $(selectId);
        $select.empty();
        $select.append('<option value="">Seleccione el trabajador</option>');
        workersData.forEach(function (worker) {
            if (
                worker.company_id == companyId &&
                serviceIds.every(id => worker.work_types.includes(parseInt(id)))
            ) {
                $select.append('<option value="' + worker.id + '">' + worker.name + '</option>');
            }
        });
        $select.trigger('change');
    }

    // Añadir
    $('#add-fk_company, #add-fk_work_type').on('change', function () {
        var companyId = $('#add-fk_company').val();
        var serviceIds = $('#add-fk_work_type').val() || [];
        filterWorkers(companyId, serviceIds, '#add-worker');
    });

    // Editar
    $('#edit-fk_company, #edit-fk_work_type').on('change', function () {
        var companyId = $('#edit-fk_company').val();
        var serviceIds = $('#edit-fk_work_type').val() || [];
        filterWorkers(companyId, serviceIds, '#edit-worker');
    });
});