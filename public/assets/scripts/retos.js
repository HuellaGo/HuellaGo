document.addEventListener("DOMContentLoaded", () => {

    pintarEstadosEnCards();
    initFiltros();
    initVerDetalle();

});

// Pinta el progreso/estado real (desde localStorage) en cada card de la lista

function pintarEstadosEnCards() {

    document.querySelectorAll(".reto-card").forEach((card) => {

        const retoId = card.getAttribute("data-reto-id");
        const reto = retosData[retoId];

        if (!reto) return;

        const estado = obtenerEstadoReto(retoId);

        card.setAttribute("data-estado", estado.estado);

        const progressFill = card.querySelector(".progress-fill");
        const progressLabel = card.querySelector(".reto-card-footer span");

        const pct = Math.round((estado.progreso / reto.progresoTotal) * 100);

        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressLabel) progressLabel.textContent = `${estado.progreso} / ${reto.progresoTotal}`;

    });

}

function initFiltros() {

    const tabs = document.querySelectorAll(".tab");
    const cards = document.querySelectorAll(".reto-card");
    const searchInput = document.getElementById("searchInput");

    const cardsContainer = document.getElementById("cardsContainer");
    const colectivosContainer = document.getElementById("colectivosContainer");
    const toolbar = document.getElementById("retosToolbar");

    let tabActual = "disponible";

    function filtrarCards() {

        const texto = searchInput.value.trim().toLowerCase();

        cards.forEach((card) => {

            const estado = card.getAttribute("data-estado");
            const titulo = card.querySelector("h3").textContent.toLowerCase();

            const coincideTab = estado === tabActual;
            const coincideTexto = titulo.includes(texto);

            card.classList.toggle("hidden", !(coincideTab && coincideTexto));

        });

    }

    tabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            tabActual = tab.getAttribute("data-tab");

            if (tabActual === "colectivos") {

                cardsContainer.style.display = "none";
                toolbar.style.display = "none";
                colectivosContainer.style.display = "block";

                pintarColectivos();

            } else {

                cardsContainer.style.display = "grid";
                toolbar.style.display = "flex";
                colectivosContainer.style.display = "none";

                filtrarCards();

            }

        });

    });

    searchInput?.addEventListener("input", filtrarCards);

    filtrarCards();

}

function initVerDetalle() {

    document.querySelectorAll(".ver-detalle-btn").forEach((btn) => {

        btn.addEventListener("click", () => {

            const retoId = btn.getAttribute("data-reto-id");

            window.location.href = `detalle-reto.html?id=${retoId}`;

        });

    });

}

// ===== COLECTIVOS (HU43) =====

function pintarColectivos() {

    // Intro solo la primera vez

    const intro = document.getElementById("colectivosIntro");

    if (esPrimeraVezEnComunidad()) {

        intro.style.display = "block";

        document.getElementById("btnCerrarIntro").addEventListener("click", () => {
            intro.style.display = "none";
            marcarIntroComunidadVista();
        }, { once: true });

    } else {

        intro.style.display = "none";

    }

    // Retos grupales

    const grid = document.getElementById("colectivosGrid");
    grid.innerHTML = "";

    RETOS_COLECTIVOS.forEach((reto) => {

        const pct = Math.round((reto.avanceActual / reto.metaTotal) * 100);

        const card = document.createElement("article");
        card.className = "colectivo-card";

        card.innerHTML = `
            <h4>${reto.titulo}</h4>
            <p>${reto.descripcion}</p>

            <div class="progress-track">
                <div class="progress-fill" style="width: ${pct}%;"></div>
            </div>

            <div class="colectivo-footer">
                <span>${reto.avanceActual} / ${reto.metaTotal} ${reto.unidad}</span>
                <span>${reto.participantes} participantes</span>
            </div>
        `;

        grid.appendChild(card);

    });

    // Feed de actividad

    const feed = document.getElementById("actividadFeed");
    feed.innerHTML = "";

    obtenerFeedComunidad().forEach((item) => {

        const li = document.createElement("li");
        li.textContent = item.texto;
        feed.appendChild(li);

    });

}