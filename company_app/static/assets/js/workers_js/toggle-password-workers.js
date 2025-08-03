document.addEventListener("DOMContentLoaded", function () {
    // Toggle mostrar/ocultar contraseña
    const passwordInput = document.getElementById("worker-password");
    if (passwordInput) {
        // Crea el botón de toggle
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "btn btn-outline-secondary btn-sm";
        toggleBtn.style.position = "absolute";
        toggleBtn.style.right = "10px";
        toggleBtn.style.top = "50%";
        toggleBtn.style.transform = "translateY(-50%)";
        toggleBtn.innerHTML = '<i id="icon-eye" data-feather="eye"></i>';

        // Crea el contenedor relativo
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        passwordInput.parentNode.insertBefore(wrapper, passwordInput);
        wrapper.appendChild(passwordInput);
        wrapper.appendChild(toggleBtn);

        toggleBtn.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                toggleBtn.innerHTML = '<i id="icon-eye" data-feather="eye-off"></i>';
            } else {
                passwordInput.type = "password";
                toggleBtn.innerHTML = '<i id="icon-eye" data-feather="eye"></i>';
            }
            if (window.feather) feather.replace();
        });
        if (window.feather) feather.replace();
    }
});