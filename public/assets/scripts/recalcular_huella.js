const steps = document.querySelectorAll(".step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const progressBar = document.getElementById("progressBar");
const stepIndicator = document.getElementById("stepIndicator");

let currentStep = 0;

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

        currentStep++;
        updateStep();

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

// BOTÓN DASHBOARD DEL PASO 5
document.addEventListener("click", (e) => {

    if (e.target.id === "dashboardBtn") {

        window.location.href = "dashboard.html";

    }

});

// Inicializar
updateStep();