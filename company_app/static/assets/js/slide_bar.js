
document.addEventListener("DOMContentLoaded", function () {
  // Modal code...
  var empresaModal = document.getElementById("empresaModal");
  empresaModal.addEventListener("show.bs.modal", function (event) {
    var button = event.relatedTarget;
    var title = button.getAttribute("data-title");
    var dato1 = button.getAttribute("data-dato1");
    var dato2 = button.getAttribute("data-dato2");
    var dato3 = button.getAttribute("data-dato3");
    document.getElementById("empresaModalLabel").textContent = title;
    document.getElementById("modalDato1").textContent = dato1;
    document.getElementById("modalDato2").textContent = dato2;
    document.getElementById("modalDato3").textContent = dato3;
  });

  // Sidebar toggle
  var sidebarHideBtn = document.getElementById("sidebar-hide");
  if (sidebarHideBtn) {
    sidebarHideBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-collapsed");
    });
  }
});