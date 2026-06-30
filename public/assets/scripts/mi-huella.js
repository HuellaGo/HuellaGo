document.addEventListener("DOMContentLoaded", () => {

    // ACTUALIZAR HÁBITOS

    const updateHabitsBtn = document.getElementById("updateHabitsBtn");

    updateHabitsBtn.addEventListener("click", () => {
        window.location.href = "actualizar-habitos.html";
    });


    // RECALCULAR HUELLA

    const recalculateBtn = document.getElementById("recalculateBtn");
    const recalculateSmallBtn = document.getElementById("recalculateSmallBtn");

    function goToOnboarding() {
        window.location.href = "recalcular_huella.html";
    }

    recalculateBtn.addEventListener("click", goToOnboarding);
    recalculateSmallBtn.addEventListener("click", goToOnboarding);


    // MODAL DE CERRAR SESIÓN

    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

    logoutBtn.addEventListener("click", () => {
        logoutModal.style.display = "flex";
    });


    // MENÚ DE PERFIL

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const logoutMenuBtn = document.getElementById("logoutMenuBtn");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.querySelector(".sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    profileBtn.addEventListener("click", () => {
        profileMenu.classList.toggle("show");
    });

    // MENU HAMBURGUESA

    hamburgerBtn.addEventListener("click", () => {

    sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");

    });

    sidebarOverlay.addEventListener("click", () => {

    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");

    });

    document.addEventListener("click", (e) => {

    const clickEnSidebar = sidebar.contains(e.target);
    const clickEnHamburger = hamburgerBtn.contains(e.target);

    if (!clickEnSidebar && !clickEnHamburger) {

        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");

    }

    });

    document.querySelectorAll(".menu-item").forEach(item => {

    item.addEventListener("click", () => {

        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");

       });

    });


    // CERRAR SESIÓN DESDE EL MENÚ DEL PERFIL

    logoutMenuBtn.addEventListener("click", () => {
        logoutModal.style.display = "flex";
    });


    // CONFIRMAR CIERRE DE SESIÓN

    confirmLogoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });
});