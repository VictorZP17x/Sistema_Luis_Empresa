function filterWorkTypes(companyId, workTypesSelector) {
    var companyServices = JSON.parse(document.getElementById('company-services-data').textContent);
    var allowed = companyServices[companyId] || [];

    // Guarda todas las opciones originales en data para restaurarlas después
    if (!$(workTypesSelector).data('all-options')) {
        $(workTypesSelector).data('all-options', $(workTypesSelector).html());
    }

    // Restaura todas las opciones
    $(workTypesSelector).html($(workTypesSelector).data('all-options'));

    // Elimina las opciones no permitidas
    $(workTypesSelector + ' option').each(function () {
        var serviceId = parseInt($(this).val());
        if (!allowed.includes(serviceId)) {
            $(this).remove();
        }
    });

    // Reinicializa select2
    $(workTypesSelector).select2('destroy');
    $(workTypesSelector).select2({
        placeholder: "Seleccionar",
        allowClear: true,
        width: '100%',
        dropdownParent: $(workTypesSelector).closest('.modal'),
        multiple: true
    });
}