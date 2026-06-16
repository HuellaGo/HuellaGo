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

});