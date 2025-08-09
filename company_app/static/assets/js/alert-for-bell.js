function actualizarBadgeNotificaciones() {
  $.get("/notifications/get/", function (data) {
    var notificaciones = data.notificaciones || [];
    if (notificaciones.length > 0) {
      $("#noti-badge").text(notificaciones.length).show();
    } else {
      $("#noti-badge").hide();
    }
  });
}

$(function () {
  // Cuando se abre el dropdown de la campana
  $("#bellDropdown").on("show.bs.dropdown", function () {
    $.get("/notifications/get/", function (data) {
      var notificaciones = data.notificaciones || [];
      if (notificaciones.length > 0) {
        $("#noti-badge").text(notificaciones.length).show();
        var html = "";
        notificaciones.forEach(function (n) {
          html += `
            <div class="dropdown-item border-bottom py-2 noti-item d-flex justify-content-between align-items-center" data-id="${n.id}" style="cursor:pointer;">
              <div>
                <div class="fw-bold">${n.mensaje}</div>
                <small class="text-muted">${n.fecha}</small>
              </div>
              <button class="btn btn-link btn-sm text-danger p-0 ms-2 btn-delete-noti" title="Eliminar notificación" data-id="${n.id}" style="box-shadow:none;">
                <i data-feather="trash-2"></i>
              </button>
            </div>
          `;
        });
        $("#notificaciones-lista").html(html);
        if (window.feather) feather.replace();
      } else {
        $("#notificaciones-lista").html(
          '<div class="text-center text-muted py-3">No tienes notificaciones nuevas.</div>'
        );
        $("#noti-badge").hide();
      }
    });
  });

  // Solo la papelera puede borrar la notificación
  $(document).on("click", ".btn-delete-noti", function (e) {
    e.stopPropagation(); // Evita que se dispare cualquier otro evento
    var $item = $(this).closest(".noti-item");
    var id = $(this).data("id");
    $.post(
      "/notifications/mark_read/",
      { id: id, csrfmiddlewaretoken: window.CSRF_TOKEN },
      function (resp) {
        if (resp.success) {
          $item.fadeOut(300, function () {
            $(this).remove();
            if ($(".noti-item").length === 0) {
              $("#notificaciones-lista").html(
                '<div class="text-center text-muted py-3">No tienes notificaciones nuevas.</div>'
              );
              $("#noti-badge").hide();
            }
          });
          actualizarBadgeNotificaciones();
        }
      }
    );
  });

  // Llama la función al cargar la página para mostrar el número si hay notificaciones
  actualizarBadgeNotificaciones();
});
