$(document).on("click", ".show-tasks-btn", function () {
  const planId = $(this).data("plan-id");
  fetch(`/work_plan/tasks_by_work_plan/${planId}/`)
    .then((r) => r.json())
    .then((data) => {
      let html = `
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
      if (!data.tasks || data.tasks.length === 0) {
        html += `<tr><td colspan="6" class="text-center text-muted">No hay tareas registradas</td></tr>`;
      } else {
        data.tasks.forEach((task) => {
          let reqList = "";
          if (Array.isArray(task.requirements) && task.requirements.length > 0) {
            reqList = "<ul>";
            task.requirements.forEach((req) => {
              reqList += `<li>${req}</li>`;
            });
            reqList += "</ul>";
          }
          let finishBtn = "";
          if (task.finished) {
            finishBtn = `<span class="badge bg-success">Sí</span>`;
          } else {
            finishBtn = `<button class="btn btn-success btn-finish-task" data-id="${task.id}">Terminar</button>`;
          }
          let options = "";
          if (!data.plan_status) {
            options += `
              <button class="btn btn-sm btn-primary btn-edit-task"
                data-id="${task.id}"
                data-task="${task.task}"
                data-requirements="${task.requirements ? task.requirements.join('\n') : ''}"
                data-start="${task.start_date}"
                data-end="${task.end_date}"
                data-plan-id="${planId}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger btn-delete-task" data-id="${task.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            `;
          }
          if (task.finished) {
            options += `
              <button class="btn btn-sm btn-info btn-view-observation" data-id="${task.id}">
                <i class="fas fa-eye"></i>
              </button>
            `;
          }
          html += `
            <tr>
              <td>${task.task}</td>
              <td>${reqList}</td>
              <td>${task.start_date}</td>
              <td>${task.end_date}</td>
              <td>${finishBtn}</td>
              <td>${options}</td>
            </tr>
          `;
        });
      }
      html += "</tbody></table>";
      Swal.fire({
        title: "Tareas del Plan",
        html: html,
        width: "60%",
        showCloseButton: true,
        showConfirmButton: false,
      });
    });
});