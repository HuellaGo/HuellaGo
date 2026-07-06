document.addEventListener("DOMContentLoaded", () => {

    precargarHabitos();

    // GUARDAR CAMBIOS

    const saveHabitsBtn = document.getElementById("saveHabitsBtn");

    saveHabitsBtn.addEventListener("click", () => {

        const habitos = recopilarHabitosForm();

        guardarMedicion(habitos);

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

    // MODAL "SALIR SIN GUARDAR"
    // (antes fallaba porque backBtn nunca se declaraba con getElementById)

    const backBtn = document.getElementById("backBtn");
    const exitModal = document.getElementById("exitModal");
    const confirmExitBtn = document.getElementById("confirmExitBtn");
    const cancelExitBtn = document.getElementById("cancelExitBtn");

    backBtn.addEventListener("click", () => {

        exitModal.style.display = "flex";

    });

    cancelExitBtn.addEventListener("click", () => {

        exitModal.style.display = "none";

    });

    confirmExitBtn.addEventListener("click", () => {

        window.location.href = "mi-huella.html";

    });

});

// Rellena el formulario con los hábitos guardados (si existen)

function precargarHabitos() {

    const data = obtenerDatosHuella();

    if (!data || !data.habitos) return;

    const h = data.habitos;

    if (h.transporte) {
        setSelectValue("habMedio", h.transporte.medio);
        document.getElementById("habKm").value = h.transporte.kmSemana || "";
        setSelectValue("habDias", h.transporte.diasSemana);
    }

    if (h.energia) {
        setSelectValue("habVivienda", h.energia.vivienda);
        document.getElementById("habPersonas").value = h.energia.personas || "";
        setSelectValue("habFuente", h.energia.fuente);
    }

    if (h.alimentacion) {
        setSelectValue("habDieta", h.alimentacion.tipo);
    }

    if (h.residuos) {
        setSelectValue("habPlasticos", h.residuos.plasticos);
        setSelectValue("habRecicla", h.residuos.reciclas ? "Sí" : "No");
    }

}

function setSelectValue(id, valor) {

    const select = document.getElementById(id);
    if (!select || !valor) return;

    const opcion = Array.from(select.options).find(o => o.value === valor);
    if (opcion) select.value = valor;

}

// Lee los valores actuales del formulario

function recopilarHabitosForm() {

    return {
        transporte: {
            medio: document.getElementById("habMedio").value,
            kmSemana: document.getElementById("habKm").value,
            diasSemana: document.getElementById("habDias").value
        },
        energia: {
            vivienda: document.getElementById("habVivienda").value,
            personas: document.getElementById("habPersonas").value,
            fuente: document.getElementById("habFuente").value
        },
        alimentacion: {
            tipo: document.getElementById("habDieta").value
        },
        residuos: {
            plasticos: document.getElementById("habPlasticos").value,
            reciclas: document.getElementById("habRecicla").value === "Sí"
        }
    };

}