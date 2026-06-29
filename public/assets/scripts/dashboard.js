document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const logoutMenuBtn = document.getElementById("logoutMenuBtn");

    // Abrir menú del perfil
    profileBtn.addEventListener("click", () => {
        profileMenu.classList.toggle("show");
    });

    // Abrir modal desde el botón de la barra lateral
    logoutBtn.addEventListener("click", () => {
        logoutModal.style.display = "flex";
    });

    // Abrir modal desde el menú desplegable
    logoutMenuBtn.addEventListener("click", () => {
        logoutModal.style.display = "flex";
    });

    // Confirmar cierre de sesión
    confirmLogoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });

});