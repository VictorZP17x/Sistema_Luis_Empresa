// Añadir tarea
$("#add-task-form").on("submit", function (e) {
  e.preventDefault();
  const form = this;
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas añadir esta tarea?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("/work_plan/task_create/", {
        method: "POST",
        body: new FormData(form),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire(
              "¡Guardado!",
              "La tarea fue añadida correctamente.",
              "success"
            ).then(() => {
              bootstrap.Modal.getInstance(
                document.getElementById("addTaskModal")
              ).hide();
              location.reload();
            });
          } else {
            Swal.fire("Error", data.message, "error");
          }
        })
        .catch(() => {
          Swal.fire("Error", "Error en la petición", "error");
        });
    }
  });
});

// Eliminar tarea
$(document).on("click", ".btn-delete-task", function () {
  const id = $(this).data("id");
  Swal.fire({
    title: "¿Eliminar tarea?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/work_plan/task_delete/${id}/`, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire(
              "¡Eliminado!",
              "La tarea ha sido eliminada.",
              "success"
            ).then(() => {
              location.reload();
            });
          } else {
            Swal.fire("Error", data.message, "error");
          }
        })
        .catch(() => {
          Swal.fire("Error", "Error en la petición.", "error");
        });
    }
  });
});

// Editar tarea
$("#edit-task-form").on("submit", function (e) {
  e.preventDefault();
  const id = $("#edit-task-id").val();
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas guardar los cambios de esta tarea?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/work_plan/task_update/${id}/`, {
        method: "POST",
        body: new FormData(this),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire(
              "¡Editado!",
              "La tarea fue actualizada correctamente.",
              "success"
            ).then(() => {
              bootstrap.Modal.getInstance(
                document.getElementById("editTaskModal")
              ).hide();
              location.reload();
            });
          } else {
            Swal.fire("Error", data.message, "error");
          }
        })
        .catch(() => {
          Swal.fire("Error", "Error en la petición", "error");
        });
    }
  });
});

// Mostrar modal de editar tarea con datos actuales
$(document).on("click", ".btn-edit-task", function () {
  const id = $(this).data("id");
  const task = $(this).data("task");
  const requirements = $(this).data("requirements");
  const start = $(this).data("start");
  const end = $(this).data("end");
  const planId = $(this).data("plan-id");

  $("#edit-task-id").val(id);
  $("#edit-task-name").val(task);
  $("#edit-task-requirements").val(requirements);
  $("#edit-task-start").val(start);
  $("#edit-task-end").val(end);
  $("#edit-task-plan-id").val(planId);

  new bootstrap.Modal(document.getElementById("editTaskModal")).show();
});