// Función para actualizar contador de caracteres
function setCharCounter(textareaId, counterId, max) {
    var textarea = document.getElementById(textareaId);
    var counter = document.getElementById(counterId);
    if (textarea && counter) {
        textarea.addEventListener('input', function() {
            var actual = textarea.value.length;
            counter.textContent = max - actual;
        });
        // Inicializar valor al abrir modal
        textarea.addEventListener('focus', function() {
            counter.textContent = max - textarea.value.length;
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setCharCounter('add-description', 'works-description-left', 255);
    setCharCounter('edit-description', 'works-description-left-edit', 255);
    setCharCounter('add-description', 'company-description-left', 255);
    setCharCounter('edit-description', 'company-description-left-edit', 255);
    setCharCounter('add-description', 'service-description-left', 255);
    setCharCounter('edit-description', 'service-description-left-edit', 255);
});