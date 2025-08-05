// Terminar tarea (marcar como terminada y guardar observación)
$(document).on("click", ".btn-finish-task", function () {
  const taskId = $(this).data("id");
  $("#finish-task-id").val(taskId);
  $("#finish-observation").val("");
  new bootstrap.Modal(document.getElementById("finishTaskModal")).show();
});

$("#finish-task-form").on("submit", function (e) {
  e.preventDefault();
  const taskId = $("#finish-task-id").val();
  const observation = $("#finish-observation").val();

  if (!observation.trim()) {
    Swal.fire("Error", "La observación es obligatoria.", "error");
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas guardar la observación y terminar la tarea?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/work_plan/task_finish/${taskId}/`, {
        method: "POST",
        body: new URLSearchParams({
          observation: observation,
          csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
        }),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire(
              "¡Guardado!",
              "La tarea fue terminada.",
              "success"
            ).then(() => {
              location.reload();
            });
          } else {
            Swal.fire("Error", data.message, "error");
          }
        });
    }
  });
});

// Ver observación de tarea terminada
$(document).on("click", ".btn-view-observation", function () {
  const taskId = $(this).data("id");
  fetch(`/work_plan/get_observation/${taskId}/`)
    .then((r) => r.json())
    .then((data) => {
      let html = `<div class="mb-3"><strong>Observación:</strong><br>${data.observation ? data.observation : '<span class="text-muted">Sin observación</span>'}</div>`;
      $("#view-observation-content").html(html);
      new bootstrap.Modal(document.getElementById("viewObservationModal")).show();
    });
});