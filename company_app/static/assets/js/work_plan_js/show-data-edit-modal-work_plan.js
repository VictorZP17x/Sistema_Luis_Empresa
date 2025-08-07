$(document).ready(function () {
    // Obtén la instancia de la modal solo una vez
    var editModalEl = document.getElementById("editModal");
    var editModal = bootstrap.Modal.getOrCreateInstance(editModalEl);

    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            document.getElementById("edit-id").value = this.dataset.id;
            document.getElementById("edit-name").value = this.dataset.name;
            document.getElementById("edit-works-to-do").value = this.dataset.worksToDo;

            // Guarda los valores originales SOLO de los campos que existen
            document.getElementById("edit-name").setAttribute("data-original", this.dataset.name || "");
            document.getElementById("edit-works-to-do").setAttribute("data-original", this.dataset.worksToDo || "");

            editModal.show();
        });
    });
});