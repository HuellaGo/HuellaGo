const steps = document.querySelectorAll(".step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const progressBar = document.getElementById("progressBar");
const stepIndicator = document.getElementById("stepIndicator");

let currentStep = 0;
let reciclaSeleccion = true; // por defecto "Sí", igual que el botón activo inicial

function updateStep() {

    // Ocultar todos los pasos
    steps.forEach(step => {
        step.classList.remove("active");
    });

    // Mostrar paso actual
    steps[currentStep].classList.add("active");

    // Actualizar barra
    progressBar.style.width =
        `${((currentStep + 1) / steps.length) * 100}%`;

    // Actualizar texto
    stepIndicator.textContent =
        `Paso ${currentStep + 1} de ${steps.length}`;

    // Mostrar / ocultar botón anterior
    prevBtn.style.visibility =
        currentStep === 0
            ? "hidden"
            : "visible";

    // PASO RESULTADO
    if (currentStep === steps.length - 1) {

        nextBtn.style.display = "none";
        prevBtn.style.display = "none";

        stepIndicator.textContent =
            "Resultado";

    } else {

        nextBtn.style.display = "block";
        prevBtn.style.display = "block";

        nextBtn.textContent =
            currentStep === steps.length - 2
                ? "Ver resultado"
                : "Siguiente";
    }
}

// BOTÓN SIGUIENTE
nextBtn.addEventListener("click", () => {

    if (currentStep < steps.length - 1) {

        const vaAlResultado = currentStep === steps.length - 2;

        currentStep++;
        updateStep();

        if (vaAlResultado) {
            mostrarResultado();
        }

    }

});

// BOTÓN ANTERIOR
prevBtn.addEventListener("click", () => {

    if (currentStep > 0) {

        currentStep--;
        updateStep();

    }

});

// SELECCIÓN DE OBJETIVOS
document.querySelectorAll(".goal-card")
.forEach(card => {

    card.addEventListener("click", () => {

        card.classList.toggle("selected");

    });

});

// TOGGLE "¿RECICLAS?"
document.querySelectorAll("#recicleToggle button").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll("#recicleToggle button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        reciclaSeleccion = btn.getAttribute("data-valor") === "si";

    });

});

// BOTÓN DASHBOARD DEL PASO 5
document.addEventListener("click", (e) => {

    if (e.target.id === "dashboardBtn") {

        window.location.href = "dashboard.html";

    }

});

// ===== RECOPILAR RESPUESTAS Y CALCULAR LA PRIMERA MEDICIÓN =====

function recopilarHabitos() {

    const objetivos = Array.from(document.querySelectorAll(".goal-card.selected"))
        .map(card => card.getAttribute("data-goal"));

    return {
        objetivos,
        transporte: {
            medio: document.getElementById("transporteMedio").value,
            kmSemana: document.getElementById("transporteKm").value,
            diasSemana: document.getElementById("transporteDias").value
        },
        energia: {
            vivienda: document.getElementById("energiaVivienda").value,
            personas: document.getElementById("energiaPersonas").value,
            fuente: document.getElementById("energiaFuente").value
        },
        alimentacion: {
            tipo: document.getElementById("alimentacionTipo").value
        },
        residuos: {
            plasticos: document.getElementById("residuosPlasticos").value,
            reciclas: reciclaSeleccion
        }
    };

}

function mostrarResultado() {

    const habitos = recopilarHabitos();
    const data = guardarMedicion(habitos); // primera medición del historial

    const kg = data.historial[0].valor;
    const nivel = obtenerNivelHuella(kg);

    document.getElementById("resultCircleValue").textContent = kg;
    document.getElementById("resultLevelBadge").textContent = `Nivel: ${nivel}`;

    // Equivalencias ilustrativas (no científicas, solo para motivar visualmente)
    document.getElementById("eqArboles").textContent = Math.max(1, Math.round(kg * 10));
    document.getElementById("eqBici").textContent = Math.max(1, Math.round(kg * 50));
    document.getElementById("eqReciclaje").textContent = Math.max(1, Math.round(kg * 7));

}

// Inicializar
updateStep();