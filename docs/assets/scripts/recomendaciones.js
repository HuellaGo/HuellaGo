let recomendacionesActuales = [];
let ordenActual = "impacto-desc";
let tabActual = "pendientes";
let recomendacionSeleccionada = null;

document.addEventListener("DOMContentLoaded", () => {

    const data = obtenerDatosHuella();

    if (!data || !data.habitos) {

        document.getElementById("sinHabitosCard").style.display = "flex";
        return;

    }

    document.getElementById("recoContenido").style.display = "block";

    cargarRecomendaciones();

    // TABS

    document.querySelectorAll(".reco-tab").forEach((tab) => {

        tab.addEventListener("click", () => {

            document.querySelectorAll(".reco-tab").forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            tabActual = tab.getAttribute("data-tab");

            document.getElementById("estadoVacioTexto").textContent = tabActual === "historial"
                ? "Todavía no has marcado ninguna recomendación como realizada o convertida en reto."
                : "¡Vas muy bien! No tenemos recomendaciones nuevas por ahora según tus hábitos actuales.";

            render();

        });

    });

    // BUSCADOR

    document.getElementById("searchInput").addEventListener("input", render);

    // ORDENAR

    document.getElementById("sortBtn").addEventListener("click", () => {

        ordenActual = ordenActual === "impacto-desc" ? "impacto-asc" : "impacto-desc";

        document.getElementById("sortLabel").textContent =
            ordenActual === "impacto-desc" ? "Mayor impacto" : "Menor impacto";

        render();

    });

    // FILTRO (dropdown)

    const filterBtn = document.getElementById("filterBtn");
    const filterDropdown = document.getElementById("filterDropdown");

    filterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
            filterDropdown.classList.remove("show");
        }
    });

    filterDropdown.querySelectorAll("input[type=checkbox]").forEach((chk) => {
        chk.addEventListener("change", render);
    });

    // MODAL

    document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);

    document.getElementById("modalExplicacion").addEventListener("click", (e) => {
        if (e.target.id === "modalExplicacion") cerrarModal();
    });

    document.getElementById("modalMarcarBtn").addEventListener("click", () => {
        if (!recomendacionSeleccionada) return;
        marcarComoRealizada(recomendacionSeleccionada);
        cerrarModal();
    });

    document.getElementById("modalConvertirBtn").addEventListener("click", () => {
        if (!recomendacionSeleccionada) return;
        convertirEnReto(recomendacionSeleccionada);
    });

});

function cargarRecomendaciones() {

    recomendacionesActuales = obtenerRecomendaciones();
    pintarBanner();
    render();

}

// ===== BANNER PRIORITARIO (HU38) =====

function pintarBanner() {

    const pendientes = recomendacionesActuales.filter(r => r.estado === "pendiente");

    if (pendientes.length === 0) {
        document.getElementById("bannerPrioritario").style.display = "none";
        return;
    }

    const prioritaria = [...pendientes].sort((a, b) => b.impactoKg - a.impactoKg)[0];

    document.getElementById("bannerPrioritario").style.display = "flex";
    document.getElementById("bannerTexto").textContent =
        `"${prioritaria.titulo}" podría reducir ${prioritaria.impactoKg} kg CO₂e/semana.`;

    document.getElementById("bannerVerBtn").onclick = () => abrirModal(prioritaria);

}

// ===== RENDER PRINCIPAL =====

function render() {

    if (tabActual === "historial") {
        renderHistorial();
        return;
    }

    renderPendientes();

}

function renderPendientes() {

    const contenedor = document.getElementById("cardsContainer");
    const vacio = document.getElementById("estadoVacio");
    const texto = document.getElementById("searchInput").value.trim().toLowerCase();

    const categoriasActivas = Array.from(
        document.querySelectorAll("#filterDropdown input:checked")
    ).map(chk => chk.value);

    let lista = recomendacionesActuales.filter((r) =>
        r.estado === "pendiente" &&
        categoriasActivas.includes(r.categoria) &&
        (r.titulo.toLowerCase().includes(texto) || r.categoria.toLowerCase().includes(texto))
    );

    lista.sort((a, b) =>
        ordenActual === "impacto-desc" ? b.impactoKg - a.impactoKg : a.impactoKg - b.impactoKg
    );

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        vacio.style.display = "flex";
        return;
    }

    vacio.style.display = "none";

    lista.forEach((r) => {

        const card = document.createElement("article");
        card.className = "reco-card";

        card.innerHTML = `
            <div class="reco-card-header">
                <span class="reco-categoria">${r.categoria}</span>
                <span class="reco-impacto">-${r.impactoKg} kg CO₂e/sem</span>
            </div>

            <h3>${r.titulo}</h3>
            <p>${r.descripcion}</p>

            <div class="reco-card-footer">
                <button class="reco-link-btn" data-accion="explicar">Ver explicación</button>
                <button class="reco-link-btn" data-accion="realizar">Marcar como realizada</button>
                ${r.retoRelacionado ? `<button class="reco-link-btn destacado" data-accion="convertir">Convertir en reto</button>` : ""}
            </div>
        `;

        card.querySelector('[data-accion="explicar"]').addEventListener("click", () => abrirModal(r));
        card.querySelector('[data-accion="realizar"]').addEventListener("click", () => marcarComoRealizada(r));

        const btnConvertir = card.querySelector('[data-accion="convertir"]');
        if (btnConvertir) btnConvertir.addEventListener("click", () => convertirEnReto(r));

        contenedor.appendChild(card);

    });

}

function renderHistorial() {

    const contenedor = document.getElementById("cardsContainer");
    const vacio = document.getElementById("estadoVacio");
    const texto = document.getElementById("searchInput").value.trim().toLowerCase();

    let historial = obtenerHistorialRecomendaciones()
        .filter(h => h.snapshot?.titulo?.toLowerCase().includes(texto) || h.snapshot?.categoria?.toLowerCase().includes(texto));

    contenedor.innerHTML = "";

    if (historial.length === 0) {
        vacio.style.display = "flex";
        return;
    }

    vacio.style.display = "none";

    historial.forEach((h) => {

        const card = document.createElement("article");
        card.className = "reco-card historial";

        const etiqueta = h.estado === "convertida" ? "Convertida en reto" : "Realizada";

        card.innerHTML = `
            <div class="reco-card-header">
                <span class="reco-categoria">${h.snapshot.categoria}</span>
                <span class="reco-badge ${h.estado}">${etiqueta}</span>
            </div>

            <h3>${h.snapshot.titulo}</h3>
            <p>Impacto estimado: -${h.snapshot.impactoKg} kg CO₂e/sem</p>
            <p class="historial-fecha-reco">${formatearFechaLarga(h.fecha)}</p>
        `;

        contenedor.appendChild(card);

    });

}

// ===== ACCIONES =====

function marcarComoRealizada(recomendacion) {

    marcarRecomendacionRealizada(recomendacion);
    cargarRecomendaciones();

}

function convertirEnReto(recomendacion) {

    if (!recomendacion.retoRelacionado || !retosData[recomendacion.retoRelacionado]) {
        alert("Esta recomendación no tiene un reto asociado todavía.");
        return;
    }

    const retoId = recomendacion.retoRelacionado;
    const estadoReto = obtenerEstadoReto(retoId);

    if (estadoReto.estado === "disponible") {

        // Nunca se había iniciado: lo activamos desde cero
        actualizarEstadoReto(retoId, { estado: "activo", progreso: 0, avances: [] });

    } else if (estadoReto.estado === "completado") {

        // Ya se había completado antes: lo reiniciamos para que la conversión
        // desde la recomendación arranque un reto nuevo, no muestre el de antes
        actualizarEstadoReto(retoId, { estado: "activo", progreso: 0, avances: [] });

    }

    // Si ya estaba "activo" (en progreso), lo dejamos tal cual para no perder ese avance

    marcarRecomendacionConvertida(recomendacion);

    // Vamos directo al reto para seguir el flujo normal (Comenzar reto → Registrar avances → Completar)
    window.location.href = `detalle-reto.html?id=${retoId}`;

}

// ===== MODAL (HU34) =====

function abrirModal(recomendacion) {

    recomendacionSeleccionada = recomendacion;

    document.getElementById("modalCategoria").textContent = recomendacion.categoria;
    document.getElementById("modalTitulo").textContent = recomendacion.titulo;
    document.getElementById("modalImpacto").textContent =
        `Impacto estimado: -${recomendacion.impactoKg} kg CO₂e/semana`;
    document.getElementById("modalExplicacionTexto").textContent = recomendacion.explicacion;

    document.getElementById("modalConvertirBtn").style.display =
        recomendacion.retoRelacionado ? "inline-flex" : "none";

    document.getElementById("modalExplicacion").classList.add("show");

}

function cerrarModal() {
    document.getElementById("modalExplicacion").classList.remove("show");
    recomendacionSeleccionada = null;
}