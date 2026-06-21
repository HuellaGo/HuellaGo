document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const inputs = form.querySelectorAll("input");

        const nombre = inputs[0].value.trim();
        const correo = inputs[1].value.trim();
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;

        if (!nombre || !correo || !password || !confirmPassword) {
            alert("Completa todos los campos.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        localStorage.setItem("usuarioNombre", nombre);
        localStorage.setItem("usuarioCorreo", correo);

        window.location.href = "onboarding.html";

    });

});