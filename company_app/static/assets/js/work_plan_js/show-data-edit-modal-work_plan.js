document.addEventListener("DOMContentLoaded", function () {
    var editModalEl = document.getElementById("editModal");
    var editModal = bootstrap.Modal.getOrCreateInstance(editModalEl);

    document.body.addEventListener("click", function (e) {
        const btn = e.target.closest(".edit-btn");
        if (!btn) return;

        document.getElementById("edit-id").value = btn.dataset.id || "";
        document.getElementById("edit-name").value = btn.dataset.name || "";
        document.getElementById("edit-works-to-do").value = btn.dataset.worksToDo || "";

        document.getElementById("edit-name").setAttribute("data-original", btn.dataset.name || "");
        document.getElementById("edit-works-to-do").setAttribute("data-original", btn.dataset.worksToDo || "");

        editModal.show();
    });
});