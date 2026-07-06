document.addEventListener("DOMContentLoaded", () => {

    // ===== TABS (Insignias / Logros) =====

    document.querySelectorAll(".tab-btn").forEach((btn) => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".tab-btn").forEach((b) => {
                b.classList.remove("active-tab");
                b.setAttribute("aria-selected", "false");
            });

            btn.classList.add("active-tab");
            btn.setAttribute("aria-selected", "true");

            const destino = btn.getAttribute("data-tab");

            document.getElementById("panel-insignias").style.display = destino === "insignias" ? "flex" : "none";
            document.getElementById("panel-logros").style.display = destino === "logros" ? "flex" : "none";

        });

    });

    // ===== CARGA PRINCIPAL DEL PANEL (HU25, HU26, HU27, HU28) =====

    pintarPanelInsignias();

});

function pintarPanelInsignias() {

    const { stats, error } = obtenerEstadisticasSeguras();

    // HU25: notificar si ocurre un error, sin dejar la pantalla en blanco
    const errorBox = document.getElementById("insigniasErrorBox");
    if (error) {
        errorBox.style.display = "flex";
        document.getElementById("insigniasErrorTexto").textContent = error;
        mostrarToast("error", error);
    } else {
        errorBox.style.display = "none";
    }

    pintarProgreso(stats);

    const insigniasConEstado = obtenerInsigniasConEstado(stats);
    pintarInsignias(insigniasConEstado);

    // HU27: notificar insignias nuevas desbloqueadas en esta sesión
    const nuevas = detectarInsigniasNuevas(insigniasConEstado);
    nuevas.forEach((insignia) => {
        mostrarToast("insignia", `¡Insignia desbloqueada: ${insignia.nombre}!`, insignia.icono);
    });

    pintarLogros();

}

// ===== TU PROGRESO (HU25 + HU26) =====

function pintarProgreso(stats) {

    const infoNivel = obtenerNivelInfo(stats.puntosTotales);

    document.getElementById("nivelNombre").textContent = infoNivel.actual.nombre;
    document.getElementById("puntosTotales").textContent = stats.puntosTotales.toLocaleString("es-PE");
    document.getElementById("progresoFill").style.width = `${infoNivel.porcentaje}%`;

    const detalle = document.getElementById("progresoDetalle");

    if (infoNivel.esNivelMaximo) {
        detalle.textContent = "¡Nivel máximo alcanzado! Eres una leyenda verde 🌎";
    } else {
        detalle.textContent =
            `${stats.puntosTotales.toLocaleString("es-PE")} / ${infoNivel.siguiente.minPuntos.toLocaleString("es-PE")} pts para "${infoNivel.siguiente.nombre}"`;
    }

    // Nota: el nombre/nivel junto al avatar del navbar ya lo actualiza
    // automáticamente components.js (actualizarNivelNavbar), no hace falta
    // tocarlo aquí.

}

// ===== GRILLAS DE INSIGNIAS (HU27) =====

function pintarInsignias(lista) {

    const desbloqueadas = lista.filter(i => i.desbloqueada);
    const bloqueadas = lista.filter(i => !i.desbloqueada);

    document.getElementById("insigniasDesbloqueadasTitulo").textContent =
        `Insignias desbloqueadas (${desbloqueadas.length}/${lista.length})`;

    const contDesbloqueadas = document.getElementById("insigniasGridDesbloqueadas");
    contDesbloqueadas.innerHTML = "";

    if (desbloqueadas.length === 0) {

        contDesbloqueadas.innerHTML = `<p class="insignias-vacio">Todavía no has desbloqueado ninguna insignia. ¡Completa retos para ganar tu primera!</p>`;

    } else {

        desbloqueadas.forEach((insignia) => {
            contDesbloqueadas.appendChild(crearTarjetaInsignia(insignia, true));
        });

    }

    const contProximas = document.getElementById("insigniasGridProximas");
    contProximas.innerHTML = "";

    bloqueadas.forEach((insignia) => {
        contProximas.appendChild(crearTarjetaInsignia(insignia, false));
    });

}

function crearTarjetaInsignia(insignia, desbloqueada) {

    const div = document.createElement("div");
    div.className = `insignia-item ${desbloqueada ? "" : "bloqueada"}`;

    const progresoHtml = desbloqueada
        ? ""
        : `
            <div class="insignia-progreso-track">
                <div class="insignia-progreso-fill" style="width:${Math.min(100, (insignia.progresoActual / insignia.progresoMeta) * 100)}%"></div>
            </div>
            <span class="insignia-progreso-texto">${insignia.progresoActual}/${insignia.progresoMeta} ${insignia.progresoUnidad}</span>
        `;

    div.innerHTML = `
        <div class="insignia-icono">${insignia.icono}</div>
        <h3>${insignia.nombre}</h3>
        <p>${insignia.descripcion}</p>
        ${progresoHtml}
    `;

    return div;

}

// ===== LOGROS (HU28: mensaje si aún no existen recompensas) =====

function pintarLogros() {

    const logros = obtenerLogros();
    const lista = document.getElementById("logrosLista");
    const vacioBox = document.getElementById("logrosVacioBox");

    lista.innerHTML = "";

    if (logros.length === 0) {
        vacioBox.style.display = "flex";
        return;
    }

    vacioBox.style.display = "none";

    logros.forEach((logro) => {

        const fila = document.createElement("div");
        fila.className = "logro-fila";

        const fechaTexto = logro.fecha
            ? new Date(logro.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
            : "Fecha no registrada";

        fila.innerHTML = `
            <div class="logro-info">
                <span class="logro-nombre">${logro.nombre}</span>
                <span class="logro-fecha">${fechaTexto}</span>
            </div>
            <span class="logro-puntos">+${logro.puntos} pts</span>
        `;

        lista.appendChild(fila);

    });

}

// ===== TOASTS (HU25 error / HU27 insignia desbloqueada) =====

function mostrarToast(tipo, mensaje, icono) {

    const contenedor = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;

    toast.innerHTML = tipo === "insignia"
        ? `<span class="toast-icono">${icono || "🏅"}</span><span>${mensaje}</span>`
        : `<span class="toast-icono">⚠️</span><span>${mensaje}</span>`;

    contenedor.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 4500);

}