$(document).on("click", ".show-tasks-btn", function () {
  const $btn = $(this);
  const planId = $btn.data("plan-id");
  const $tr = $btn.closest("tr");

  // Si ya existe una fila hija justo después, la ocultamos con animación y la eliminamos al terminar
  if ($tr.next().hasClass("tasks-detail-row")) {
    $tr.next().fadeOut(200, function () {
      $(this).remove();
    });
    return;
  }

  // Elimina cualquier otra fila hija abierta con animación
  $(".tasks-detail-row").each(function () {
    $(this).fadeOut(200, function () {
      $(this).remove();
    });
  });

  // Muestra un loader mientras carga
  const colspan = $tr.children("td").length;
  $tr.after(`
    <tr class="tasks-detail-row" style="display:none;">
      <td colspan="${colspan}">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
      </td>
    </tr>
  `);
  $tr.next().fadeIn(200);

  fetch(`/work_plan/tasks_by_work_plan/${planId}/`)
    .then((r) => r.json())
    .then((data) => {
      let html = "";
      if (!data.tasks || data.tasks.length === 0) {
        html = `<div class="alert alert-info mb-0">Este plan de trabajo no tiene tareas registradas.</div>`;
      } else {
        html = `
          <div class="mb-2">
            <input type="text" class="form-control form-control-sm task-search-input" placeholder="Buscar tarea...">
          </div>
          <div class="table-responsive">
            <table class="table table-sm mb-0 task-table">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Requerimientos</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Terminada</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
        `;
        data.tasks.forEach((task) => {
          let reqList = "";
          if (Array.isArray(task.requirements) && task.requirements.length > 0) {
            reqList = "<ul>";
            task.requirements.forEach((req) => {
              reqList += `<li>${req}</li>`;
            });
            reqList += "</ul>";
          }
          let finishBtn = task.finished
            ? `<span class="badge bg-success">Sí</span>`
            : `<button class="btn btn-success btn-finish-task btn-sm" data-id="${task.id}">Terminar</button>`;
          let options = "";
          if (task.finished) {
            options += `
    <button class="btn btn-sm btn-info btn-view-observation" data-id="${task.id}">
      <i data-feather="eye"></i>
    </button>
  `;
          } else if (!data.plan_status) {
            options += `
    <button class="btn btn-sm btn-primary btn-edit-task"
      data-id="${task.id}"
      data-task="${task.task}"
      data-requirements="${task.requirements ? task.requirements.join('\n') : ''}"
      data-start="${task.start_date}"
      data-end="${task.end_date}"
      data-plan-id="${planId}">
      <i data-feather="edit"></i>
    </button>
    <button class="btn btn-sm btn-danger btn-delete-task" data-id="${task.id}">
      <i data-feather="trash-2"></i>
    </button>
  `;
          }
          html += `
  <tr${task.finished ? ' class="text-decoration-line-through text-muted"' : ''}>
    <td>${task.task}</td>
    <td>${reqList}</td>
    <td>${task.start_date}</td>
    <td>${task.end_date}</td>
    <td>${finishBtn}</td>
    <td>${options}</td>
  </tr>
`;
        });
        html += `
        </tbody>
      </table>
      <div class="no-tasks-found alert alert-warning mt-2 mb-0" style="display:none;">No se encontraron tareas que coincidan.</div>
    </div>
  `;
      }
      $tr.next().find("td").hide().html(html).slideDown(200);
      // Filtro de búsqueda para la tabla de tareas
      const $taskSearch = $tr.next().find('.task-search-input');
      $taskSearch.on('keyup', function () {
        const value = $(this).val().toLowerCase();
        let visibleRows = 0;
        $tr.next().find('.task-table tbody tr').each(function () {
          const rowText = $(this).text().toLowerCase();
          const match = rowText.indexOf(value) > -1;
          $(this).toggle(match);
          if (match) visibleRows++;
        });
        // Mostrar/ocultar mensaje de "no se encontraron tareas"
        const $noTasks = $tr.next().find('.no-tasks-found');
        if (visibleRows === 0) {
          $noTasks.show();
        } else {
          $noTasks.hide();
        }
      });
      if (window.feather) feather.replace();
    })
    .catch(() => {
      $tr.next().find("td").hide().html('<div class="alert alert-danger mb-0">Error al cargar las tareas.</div>').slideDown(200);
    });
});