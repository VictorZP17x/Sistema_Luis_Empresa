//Forzar a cualquier backdrop de cualquier modal a desaparecer al cerrar las modales
document.addEventListener('DOMContentLoaded', function() {
  var editModal = document.getElementById('editModal');
  editModal.addEventListener('hidden.bs.modal', function () {
    // Elimina cualquier backdrop que quede
    document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
      backdrop.remove();
    });
    document.body.classList.remove('modal-open');
    document.body.style = '';
  });
});