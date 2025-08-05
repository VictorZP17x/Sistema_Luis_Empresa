$(document).ready(function () {
  // Inicializa select2 para empresa y servicios en editar
  $("#edit-worker-company").select2({
    placeholder: "Seleccione una empresa",
    width: "100%",
    dropdownParent: $("#edit-worker-modal"),
  });

  $("#edit-worker-services").select2({
    placeholder: "Seleccione los servicios",
    width: "100%",
    dropdownParent: $("#edit-worker-modal"),
  });

  // Filtra servicios según empresa seleccionada
  $("#edit-worker-company").on("change", function () {
    var companyId = $(this).val();
    filterWorkTypes(companyId, "#edit-worker-services");
  });

  // Al abrir el modal de editar, filtra servicios y actualiza foto
  $("#edit-worker-modal").on("shown.bs.modal", function () {
    var companyId = $("#edit-worker-company").val();
    filterWorkTypes(companyId, "#edit-worker-services");
    feather.replace(); // Si usas feather icons
  });

  // Formato automático y prefijo fijo para teléfono en editar
  const editPhoneInput = document.getElementById("edit-worker-phone");
  if (editPhoneInput) {
    $("#edit-worker-modal").on("shown.bs.modal", function () {
      if (editPhoneInput.value.trim() === "") {
        editPhoneInput.value = "+58 ";
      }
    });

    editPhoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (!value.startsWith("58")) {
        value = "58" + value.replace(/^0+/, "");
      }
      if (value.length > 2 && value[2] === "0") {
        value = value.slice(0, 2) + value.slice(3);
      }
      value = value.slice(0, 12);
      let formatted = "+58 ";
      if (value.length > 2) {
        formatted += value.slice(2, 5);
      }
      if (value.length > 5) {
        formatted += "-" + value.slice(5, 8);
      }
      if (value.length > 8) {
        formatted += "-" + value.slice(8, 12);
      }
      e.target.value = formatted;
    });

    editPhoneInput.addEventListener("keydown", function (e) {
      if (
        editPhoneInput.selectionStart <= 4 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });
  }

  // Envío del formulario con validaciones y SweetAlert
  async function validarDatosTrabajador(username, email, phone, user_id) {
    const response = await fetch("/workers/validar_datos_trabajador/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
      body: JSON.stringify({ username, email, phone, user_id }),
    });
    return await response.json();
  }

  $("#edit-worker-form").on("submit", async function (e) {
    e.preventDefault();

    const username = this.username.value;
    const email = this.email.value;
    const phone = this.phone.value;
    const user_id = this.user_id.value;

    const resultado = await validarDatosTrabajador(username, email, phone, user_id);
    if (resultado.error) {
      Swal.fire({
        icon: "error",
        title: "Datos ya registrados",
        html: resultado.error,
        confirmButtonText: "Aceptar",
      });
      return false;
    }

    // --- VALIDACIÓN DE TELÉFONO ---
    const phoneInput = document.getElementById("edit-worker-phone");
    if (phoneInput) {
      const phoneValue = phoneInput.value.replace(/\s|-/g, "");
      const phoneRegex = /^\+58(412|414|416|424|426|212)\d{7}$/;
      if (!phoneRegex.test(phoneValue)) {
        Swal.fire({
          icon: "error",
          title: "Teléfono inválido",
          text: "El número debe ser venezolano y tener el formato correcto (ej: +58 412-123-4567).",
        });
        phoneInput.focus();
        return false;
      }
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas guardar los cambios de este trabajador?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        var formData = new FormData(this);

        $.ajax({
          url: $(this).attr("action"), // Debes poner la URL de editar en el atributo action del form
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
          headers: { "X-Requested-With": "XMLHttpRequest" },
          success: function (response) {
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "¡Trabajador actualizado!",
                text: "Los datos se guardaron correctamente.",
                confirmButtonText: "Aceptar",
              }).then(() => {
                location.reload();
              });
            } else {
              let errorMsg = response.error || "Error al guardar";
              if (response.errors) {
                errorMsg = Object.values(response.errors).join("\n");
              }
              Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
              });
            }
          },
          error: function () {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error en la comunicación con el servidor.",
            });
          },
        });
      }
    });
  });
});

// Llenar los campos al hacer click en editar
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".edit-worker-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Llenar campos básicos
      document.getElementById("edit-worker-id").value = btn.dataset.id;
      document.getElementById("edit-worker-username").value =
        btn.dataset.username || "";
      document.getElementById("edit-worker-first-name").value =
        btn.dataset.firstName || "";
      document.getElementById("edit-worker-last-name").value =
        btn.dataset.lastName || "";
      document.getElementById("edit-worker-email").value =
        btn.dataset.email || "";

      // Formatear teléfono si es necesario
      let phone = btn.dataset.phone || "";
      // Elimina todo lo que no sea dígito
      phone = phone.replace(/\D/g, "");
      // Si el número tiene 10 dígitos (sin el 58), lo formatea
      if (phone.length === 12 && phone.startsWith("58")) {
        phone =
          "+58 " +
          phone.slice(2, 5) +
          "-" +
          phone.slice(5, 8) +
          "-" +
          phone.slice(8, 12);
      } else if (phone.length === 11 && phone.startsWith("58")) {
        phone =
          "+58 " +
          phone.slice(2, 5) +
          "-" +
          phone.slice(5, 8) +
          "-" +
          phone.slice(8, 11);
      } else if (phone.length === 10) {
        phone =
          "+58 " +
          phone.slice(0, 3) +
          "-" +
          phone.slice(3, 6) +
          "-" +
          phone.slice(6, 10);
      } else {
        phone = "+58 ";
      }
      document.getElementById("edit-worker-phone").value = phone;

      // Empresa
      $("#edit-worker-company")
        .val(btn.dataset.company || "")
        .trigger("change");

      // Servicios: espera a que el select2 se actualice tras filtrar
      let services = btn.dataset.services
        ? btn.dataset.services.split(",")
        : [];
      setTimeout(function () {
        $("#edit-worker-services").val(services.map(String)).trigger("change");
      }, 200);

      // Foto
      const photoUrl =
        btn.dataset.photoUrl || "/static/assets/img/default-user.png";
      document.getElementById("edit-worker-photo-preview").src = photoUrl;

      // Abre el modal
      new bootstrap.Modal(document.getElementById("edit-worker-modal")).show();
    });
  });
});
