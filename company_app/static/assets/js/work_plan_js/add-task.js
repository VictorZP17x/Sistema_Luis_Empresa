document.querySelectorAll(".add-task-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const planId = this.dataset.planId;
    document.getElementById("task-plan-id").value = planId;
    document.getElementById("add-task-form").reset();
    // No hay select dinámico, solo textarea para requerimientos
    new bootstrap.Modal(document.getElementById("addTaskModal")).show();
  });
});