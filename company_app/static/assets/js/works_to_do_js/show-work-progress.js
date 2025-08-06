$(document).on("click", ".show-progress-btn", function () {
    const worksToDoId = $(this).data("id");
    // Llama a un endpoint que devuelva el progreso
    $.get(`/work_plan/progress_by_works_to_do/${worksToDoId}/`, function (data) {
        if (data.success) {
            const n = data.finished_tasks;
            const m = data.total_tasks;
            const percent = m > 0 ? Math.round((n / m) * 100) : 0;
            let html = `
                <div class="mb-2">Tareas terminadas: <strong>${n}/${m}</strong></div>
                <div class="progress">
                  <div class="progress-bar custom-progress-bar" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">${percent}%</div>
                </div>
            `;
            $("#progress-bar-container").html(html);
            new bootstrap.Modal(document.getElementById("progressModal")).show();
        } else {
            $("#progress-bar-container").html('<div class="alert alert-danger">No se pudo obtener el progreso.</div>');
            new bootstrap.Modal(document.getElementById("progressModal")).show();
        }
    });
});