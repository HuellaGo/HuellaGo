async function loadComponent(url, containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;

    try {

        const response = await fetch(url);
        const html = await response.text();

        container.innerHTML = html;

    } catch (error) {

        console.error(`Error cargando ${url}:`, error);

    }

}

function marcarPaginaActiva() {

    let currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

    if (currentPage === "actualizar-habitos.html") {
        currentPage = "mi-huella.html";
    }

    document.querySelectorAll(".menu-item").forEach((item) => {

        const page = item.getAttribute("data-page");

        if (page === currentPage) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }

    });

}

function initSidebarToggle() {

    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (!hamburgerBtn || !sidebar) return;

    hamburgerBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay?.classList.toggle("active");
    });

    overlay?.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });

}

function initProfileMenu() {

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");

    if (!profileBtn || !profileMenu) return;

    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        profileMenu.classList.remove("show");
    });

}

function initLogout() {

    console.log("initLogout ejecutado");

    const logoutBtn = document.getElementById("logoutBtn");
    const logoutMenuBtn = document.getElementById("logoutMenuBtn");

    const logoutModal = document.getElementById("logoutModal");
    const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

    console.log(logoutBtn);
    console.log(logoutMenuBtn);
    console.log(logoutModal);

    const abrirModal = (e) => {
        console.log("SE EJECUTÓ abrirModal");
        e?.preventDefault();
        logoutModal?.classList.add("show");
    };

    logoutBtn?.addEventListener("click", abrirModal);
    logoutMenuBtn?.addEventListener("click", abrirModal);

    cancelLogoutBtn?.addEventListener("click", () => {
        logoutModal?.classList.remove("show");
    });

    confirmLogoutBtn?.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
    });

}

// ===== NIVEL REAL EN EL NAVBAR =====
// Antes "Nivel 5 · Eco Heroe" venía hardcodeado en navbar.html, asi que
// aparecia igual en todas las paginas sin importar los eco puntos reales
// del usuario. Esta funcion lo reemplaza por el nivel calculado de verdad,
// usando la misma logica que ya usa insignias.html (NIVELES / obtenerEstadisticasSeguras
// de insignias-data.js).
//
// Requiere que la pagina tenga cargados (antes de components.js, o en
// cualquier orden ya que igual corren antes de DOMContentLoaded):
//   retos-data.js, huella-data.js, insignias-data.js
//
// Si alguna de esas funciones no esta disponible en la pagina actual,
// no rompe nada: simplemente deja el texto que ya venia en navbar.html.

function actualizarNivelNavbar() {

    const nivelSpan = document.getElementById("navUserLevel");
    if (!nivelSpan) return;

    if (typeof obtenerEstadisticasSeguras !== "function") {
        console.warn(
            "actualizarNivelNavbar: falta incluir insignias-data.js (y sus dependencias " +
            "retos-data.js / huella-data.js) en esta página. Se deja el nivel por defecto del navbar."
        );
        return;
    }

    try {

        const { stats } = obtenerEstadisticasSeguras();
        nivelSpan.textContent = `Nivel ${stats.nivelActual.nivel} · ${stats.nivelActual.nombre}`;

    } catch (error) {

        console.error("No se pudo calcular el nivel para el navbar:", error);

    }

}

async function initLayout() {

    await Promise.all([
        loadComponent("components/sidebar.html", "sidebar-container"),
        loadComponent("components/navbar.html", "navbar-container"),
        loadComponent("components/logout-modal.html", "logout-modal-container")
    ]);

    marcarPaginaActiva();
    initSidebarToggle();
    initProfileMenu();
    initLogout();
    actualizarNivelNavbar();

}


document.addEventListener("DOMContentLoaded", initLayout);