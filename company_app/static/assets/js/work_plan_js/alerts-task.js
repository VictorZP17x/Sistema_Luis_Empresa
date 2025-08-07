// Añadir tarea
$("#add-task-form").on("submit", function (e) {
  e.preventDefault();
  const form = this;
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas registrar esta tarea?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, Registrar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
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
    confirmButtonText: "Sí, Borrar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
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
$(document).on("click", ".btn-edit-task", function () {
  const id = $(this).data("id");
  const task = $(this).data("task");
  const requirements = $(this).data("requirements");
  const start = $(this).data("start");
  const end = $(this).data("end");
  const planId = $(this).data("plan-id");

  $("#edit-task-id").val(id);
  $("#edit-task-name").val(task).attr("data-original", task);
  $("#edit-task-requirements").val(requirements).attr("data-original", requirements);
  $("#edit-task-start").val(start).attr("data-original", start);
  $("#edit-task-end").val(end).attr("data-original", end);
  $("#edit-task-plan-id").val(planId).attr("data-original", planId);

  new bootstrap.Modal(document.getElementById("editTaskModal")).show();
});

$("#edit-task-form").on("submit", function (e) {
  e.preventDefault();
  const id = $("#edit-task-id").val();

  // --- DETECCIÓN DE CAMBIOS SOLO PARA CAMPOS EXISTENTES ---
  const nameInput = document.getElementById("edit-task-name");
  const requirementsInput = document.getElementById("edit-task-requirements");
  const startInput = document.getElementById("edit-task-start");
  const endInput = document.getElementById("edit-task-end");
  const planIdInput = document.getElementById("edit-task-plan-id");

  const nameChanged = nameInput.value !== nameInput.getAttribute("data-original");
  const requirementsChanged = requirementsInput.value !== requirementsInput.getAttribute("data-original");
  const startValue = startInput.value ? new Date(startInput.value) : null;
  const startOriginal = startInput.getAttribute("data-original") ? new Date(startInput.getAttribute("data-original")) : null;
  const startChanged = startValue && startOriginal ? startValue.getTime() !== startOriginal.getTime() : startValue !== startOriginal;
  const endValue = endInput.value ? new Date(endInput.value) : null;
  const endOriginal = endInput.getAttribute("data-original") ? new Date(endInput.getAttribute("data-original")) : null;
  const endChanged = endValue && endOriginal ? endValue.getTime() !== endOriginal.getTime() : endValue !== endOriginal;
  const planIdChanged = planIdInput.value !== planIdInput.getAttribute("data-original");

  // Validación de cambios
  if (!(nameChanged || requirementsChanged || startChanged || endChanged || planIdChanged)) {
    Swal.fire({
      icon: "info",
      title: "Sin cambios",
      text: "No se detectaron cambios para guardar.",
      confirmButtonText: "Aceptar"
    });
    return;
  }

  // Validación de fechas
  const start = new Date(startInput.value);
  const end = new Date(endInput.value);
  if (start > end) {
    Swal.fire({
      icon: "error",
      title: "Fechas incorrectas",
      text: "La fecha de inicio no puede ser mayor a la fecha de finalización.",
      confirmButtonText: "Aceptar",
    });
    return;
  }
  if (start.getTime() === end.getTime()) {
    Swal.fire({
      icon: "error",
      title: "Fechas inválidas",
      text: "La fecha de inicio y la fecha de finalización no pueden ser la misma.",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  // Confirmación y envío
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas guardar los cambios de esta tarea?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, Guardar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
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