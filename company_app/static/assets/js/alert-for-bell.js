$(function () {
  // Simulación: cambia esto por tu lógica real de notificaciones
  var notificaciones = [
    { mensaje: "Tienes una nueva solicitud de trabajo.", fecha: "09/08/2025" },
    {
      mensaje: "Un trabajador ha actualizado el estado de un trabajo.",
      fecha: "08/08/2025",
    },
  ];

  if (notificaciones.length > 0) {
    $("#noti-badge").text(notificaciones.length).show();
    var html = "";
    notificaciones.forEach(function (n) {
      html += `<div class="dropdown-item border-bottom py-2">
                        <div class="fw-bold">${n.mensaje}</div>
                        <small class="text-muted">${n.fecha}</small>
                    </div>`;
    });
    $("#notificaciones-lista").html(html);
  }
});
