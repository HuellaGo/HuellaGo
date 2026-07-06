document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        if(email === "" || password === ""){

            alert(
                "Por favor completa todos los campos."
            );

            return;
        }

        console.log("Email:", email);
        console.log("Password:", password);

        // Aquí luego conectarás Firebase o backend

        window.location.href = "onboarding.html";

    });

    // ===== "¿Olvidaste tu contraseña?" (simulado, HU de recuperación) =====

    const forgotLink = document.getElementById("forgotPasswordLink");
    const forgotModal = document.getElementById("forgotModalOverlay");
    const forgotModalTexto = document.getElementById("forgotModalTexto");
    const forgotModalCerrar = document.getElementById("forgotModalCerrar");

    if (forgotLink && forgotModal) {

        forgotLink.addEventListener("click", (event) => {

            event.preventDefault();

            const email = document.getElementById("email").value.trim();

            forgotModalTexto.textContent = email
                ? `Hemos enviado un enlace para restablecer tu contraseña a ${email}.`
                : "Hemos enviado un enlace para restablecer tu contraseña a tu correo.";

            forgotModal.classList.add("show");

        });

        forgotModalCerrar?.addEventListener("click", () => {
            forgotModal.classList.remove("show");
        });

        forgotModal.addEventListener("click", (event) => {
            if (event.target === forgotModal) {
                forgotModal.classList.remove("show");
            }
        });

    }

});