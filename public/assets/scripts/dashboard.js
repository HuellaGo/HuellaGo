document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const logoutMenuBtn = document.getElementById("logoutMenuBtn");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.querySelector(".sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    hamburgerBtn.addEventListener("click", () => {

    sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");

    });

    document.addEventListener("click", (e) => {

    const clickEnSidebar = sidebar.contains(e.target);
    const clickEnHamburger = hamburgerBtn.contains(e.target);

    if (!clickEnSidebar && !clickEnHamburger) {

        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");

    }

    });

    sidebarOverlay.addEventListener("click", () => {

    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");

    });

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

    document.querySelectorAll(".menu-item").forEach(item => {

    item.addEventListener("click", () => {

        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");

    });

    });

});