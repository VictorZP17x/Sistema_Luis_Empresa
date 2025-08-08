$(document).ready(function () {
  // Inicializa select2
  $("#add-fk_company, #add-fk_user, #add-worker").select2({
    placeholder: "Seleccionar",
    allowClear: true,
    width: "100%",
    dropdownParent: $("#register-works_to_do-modal"),
  });
  // El de servicios es múltiple
  $("#add-fk_work_type").select2({
    placeholder: "Seleccionar",
    allowClear: true,
    width: "100%",
    dropdownParent: $("#register-works_to_do-modal"),
    multiple: true,
  });

  // Añadir trabajo
  $("#add-works_to_do-form").submit(function (e) {
    e.preventDefault();
    $("#register-works_to_do-modal").modal("hide");
    setTimeout(function () {
      // Condición para cliente
      if (typeof IS_CLIENTE !== "undefined" && IS_CLIENTE) {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Deseas registrar esta solicitud de trabajo? Tenga en cuenta que de hacerlo no podrá modificarla.",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, Registrar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            $.post(
              "/works_to_do/add_works_to_do/",
              $("#add-works_to_do-form").serialize(),
              function (response) {
                if (response.success) {
                  Swal.fire(
                    "¡Registrado!",
                    "La solicitud de trabajo ha sido registrada correctamente.",
                    "success"
                  ).then(() => location.reload());
                } else {
                  Swal.fire(
                    "Error",
                    "No se pudo registrar la solicitud de trabajo.",
                    "error"
                  );
                }
              }
            );
          }
        });
      } else {
        // SweetAlert para otros roles (el que ya tienes)
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Deseas registrar esta solicitud de trabajo?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, Registrar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            $.post(
              "/works_to_do/add_works_to_do/",
              $("#add-works_to_do-form").serialize(),
              function (response) {
                if (response.success) {
                  Swal.fire(
                    "¡Registrado!",
                    "La solicitud de trabajo ha sido registrado correctamente.",
                    "success"
                  ).then(() => location.reload());
                } else {
                  Swal.fire(
                    "Error",
                    "No se pudo registrar la solicitud de trabajo.",
                    "error"
                  );
                }
              }
            );
          }
        });
      }
    }, 300);
  });

  // Cuando cambia la empresa seleccionada
  $("#add-fk_company").on("change", function () {
    var companyId = $(this).val();
    filterWorkTypes(companyId, "#add-fk_work_type");
  });

  // Al abrir el modal de añadir (por si ya hay una empresa seleccionada)
  $("#register-works_to_do-modal").on("shown.bs.modal", function () {
    var companyId = $("#add-fk_company").val();
    filterWorkTypes(companyId, "#add-fk_work_type");
  });
});
