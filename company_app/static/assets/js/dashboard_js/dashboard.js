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
});