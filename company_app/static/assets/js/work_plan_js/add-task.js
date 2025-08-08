document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        const btn = e.target.closest(".add-task-btn");
        if (!btn) return;

        const planId = btn.dataset.planId;
        document.getElementById("task-plan-id").value = planId;
        document.getElementById("add-task-form").reset();
        new bootstrap.Modal(document.getElementById("addTaskModal")).show();
    });
});