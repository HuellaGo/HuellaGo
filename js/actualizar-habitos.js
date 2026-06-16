document.addEventListener("DOMContentLoaded", () => {

    // GUARDAR CAMBIOS

    const saveHabitsBtn = document.getElementById("saveHabitsBtn");

    saveHabitsBtn.addEventListener("click", () => {

        document.getElementById("mainContainer").style.display = "none";

        document.getElementById("successScreen").style.display = "flex";

    });


    // VOLVER A MI PERFIL

    document.getElementById("backProfileBtn").addEventListener("click", () => {

        window.location.href = "mi-huella.html";

    });


    // MENÚ DE PERFIL

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const logoutMenuBtn = document.getElementById("logoutMenuBtn");

    profileBtn.addEventListener("click", () => {
        profileMenu.classList.toggle("show");
    });


    // MODAL CERRAR SESIÓN

    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

    logoutBtn.addEventListener("click", () => {
        logoutModal.style.display = "flex";
    });


    // CERRAR SESIÓN DESDE EL MENÚ DEL PERFIL

    logoutMenuBtn.addEventListener("click", () => {
        logoutModal.style.display = "flex";
    });


    // CONFIRMAR CIERRE DE SESIÓN

    confirmLogoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "../index.html";

    });

});