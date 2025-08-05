$(document).ready(function () {
  $('#buscador-empresas').on('input', function () {
    const texto = $(this).val().toLowerCase();
    let visibles = 0;

    $('#cards-empresas > div[class*="col-"]').each(function (i) {
      const $col = $(this);
      const nombre = $col.find('h6').text().toLowerCase();
      const direccion = $col.find('.empresa-direccion').text().toLowerCase();
      const telefono = $col.find('.empresa-telefono').text().toLowerCase();
      const rif = $col.find('.empresa-rif').text().toLowerCase();

      if (
        nombre.includes(texto) ||
        direccion.includes(texto) ||
        telefono.includes(texto) ||
        rif.includes(texto)
      ) {
        $col.removeClass('oculto');
        visibles++;
      } else {
        $col.addClass('oculto');
      }
    });

    // Mostrar/ocultar mensaje según resultado
    $('#no-coincidencias-empresas').toggle(visibles === 0);
  });

  // Inicializar DataTables en cada tabla de servicios de empresa SOLO UNA VEZ
  $('[id^="datatable-servicios-"]').each(function () {
    if (!$.fn.DataTable.isDataTable(this)) {
      $(this).DataTable({
        paging: true,
        pageLength: 4,
        lengthChange: false,
        searching: true,
        ordering: true,
        info: false,
        language: {
          search: "Buscar servicio:",
          paginate: {
            previous: "Anterior",
            next: "Siguiente"
          },
          zeroRecords: "No se encontraron servicios"
        }
      });
    }
  });
  
});

$(document).ready(function () {
  var workersDetail = window.workersDetail;
  var empresaModalId = null;

  $('.btn-ver-trabajadores').on('click', function () {
    var companyId = $(this).data('company');
    var serviceId = $(this).data('service');
    empresaModalId = "#empresaModal" + companyId;
    var trabajadores = (workersDetail[companyId] && workersDetail[companyId][serviceId]) ? workersDetail[companyId][serviceId] : [];

    // Destruir DataTable anterior si existe
    if ($.fn.DataTable.isDataTable('#tabla-trabajadores-modal')) {
      $('#tabla-trabajadores-modal').DataTable().clear().destroy();
    }

    var $tbody = $('#tabla-trabajadores-modal tbody');
    $tbody.empty();

    if (!trabajadores || trabajadores.length === 0) {
      $tbody.append(
        `<tr>
          <td class="text-center" colspan="4">No hay trabajadores asociados a este servicio.</td>
          <td style="display:none"></td>
          <td style="display:none"></td>
          <td style="display:none"></td>
        </tr>`
      );
    } else {
      trabajadores.forEach(function (w) {
        $tbody.append(
          `<tr>
            <td>
              <img src="${w.photo ? w.photo : '/static/assets/img/default-user.png'}"
                   class="rounded-circle" style="width:40px;height:40px;object-fit:cover;">
            </td>
            <td><strong>${w.name}</strong></td>
            <td>${w.email}</td>
            <td>${w.phone}</td>
          </tr>`
        );
      });
    }

    // Inicializar DataTable con búsqueda y paginación de 6
    $('#tabla-trabajadores-modal').DataTable({
      paging: true,
      pageLength: 6,
      lengthChange: false,
      searching: true,
      ordering: false,
      info: false,
      language: {
        search: "Buscar trabajador:",
        paginate: {
          previous: "Anterior",
          next: "Siguiente"
        },
        zeroRecords: "No hay trabajadores asociados a este servicio."
      }
    });

    // Sincronizar el input con el DataTable search
    $('#buscador-trabajadores-modal').val('');
    $('#buscador-trabajadores-modal').off('input').on('input', function () {
      $('#tabla-trabajadores-modal').DataTable().search($(this).val()).draw();
    });
  });

  $('#volver-ver-mas').on('click', function () {
    $('#trabajadoresModal').modal('hide');
    if (empresaModalId) {
      setTimeout(function () {
        $(empresaModalId).modal('show');
      }, 500);
    }
  });
});