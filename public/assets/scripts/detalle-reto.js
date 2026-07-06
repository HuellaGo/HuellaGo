let retoIdActual = null;
let retoActual = null;

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const retoId = params.get("id");
    const reto = retosData[retoId];

    if (!reto) {
        window.location.href = "retos.html";
        return;
    }

    retoIdActual = retoId;
    retoActual = reto;

    const estadoActual = obtenerEstadoReto(retoId);

    pintarInfoReto(reto);
    pintarProgreso(reto, estadoActual);
    pintarHistorial(estadoActual);
    manejarVista(estadoActual, reto);

    document.getElementById("btnCancelar").addEventListener("click", () => {
        window.location.href = "retos.html";
    });

    document.getElementById("btnComenzar").addEventListener("click", () => {

        const nuevoEstado = actualizarEstadoReto(retoId, { estado: "activo" });

        manejarVista(nuevoEstado, reto);
        pintarProgreso(reto, nuevoEstado);
        pintarHistorial(nuevoEstado);

    });

    // ----- MODAL: Registrar avance -----

    document.getElementById("btnRegistrarAvance").addEventListener("click", abrirModalAvance);
    document.getElementById("btnCerrarModal").addEventListener("click", cerrarModalAvance);
    document.getElementById("btnCancelarAvance").addEventListener("click", cerrarModalAvance);

    document.getElementById("modalAvance").addEventListener("click", (e) => {
        if (e.target.id === "modalAvance") cerrarModalAvance();
    });

    document.getElementById("btnMenos").addEventListener("click", () => cambiarCantidad(-1));
    document.getElementById("btnMas").addEventListener("click", () => cambiarCantidad(1));

    document.getElementById("btnGuardarAvance").addEventListener("click", guardarAvance);

});

function pintarInfoReto(reto) {

    document.getElementById("retoImagen").src = reto.imagen;

    const badge = document.getElementById("retoDificultadBadge");
    badge.textContent = reto.dificultad;
    badge.className = `difficulty ${reto.dificultadClass}`;

    document.getElementById("retoPuntosBadge").innerHTML =
        `+${reto.puntosNum} <img src="assets/icons/hoja.png" alt="">`;

    document.getElementById("retoTitulo").textContent = reto.titulo;
    document.getElementById("retoDescripcion").textContent = reto.descripcion;

    document.getElementById("retoDificultadTexto").textContent = reto.dificultad;
    document.getElementById("retoDuracion").textContent = reto.duracion;
    document.getElementById("retoObjetivo").textContent = reto.objetivo;
    document.getElementById("retoImpacto").textContent = reto.impacto;
    document.getElementById("retoPuntosTexto").textContent = reto.puntos;
    document.getElementById("retoInsignia").textContent = reto.insignia;

    document.getElementById("retoDato").textContent = reto.dato;
    document.getElementById("retoComoCompletar").textContent = reto.comoCompletar;
    document.getElementById("retoConsejo").textContent = reto.consejo;

    document.getElementById("modalAvancePregunta").textContent =
        `¿Cuántas veces completaste "${reto.titulo}" hoy?`;

}

function pintarProgreso(reto, estado) {

    const pct = Math.round((estado.progreso / reto.progresoTotal) * 100);

    document.getElementById("retoProgresoNum").textContent = `${estado.progreso} / ${reto.progresoTotal}`;
    document.getElementById("retoProgresoFill").style.width = `${pct}%`;
    document.getElementById("retoProgresoPct").textContent = `${pct}%`;

}

function pintarHistorial(estado) {

    const lista = document.getElementById("historialAvances");
    const avances = estado.avances || [];

    lista.innerHTML = "";

    if (avances.length === 0) {

        const vacio = document.createElement("li");
        vacio.className = "historial-vacio";
        vacio.textContent = "Todavía no registras ningún avance.";
        lista.appendChild(vacio);
        return;

    }

    avances.forEach((avance) => {

        const li = document.createElement("li");
        li.className = "historial-item";

        const fechaFormateada = formatearFecha(avance.fecha);

        li.innerHTML = `
            <div class="historial-item-info">
                <span class="historial-fecha">${fechaFormateada}</span>
                ${avance.nota ? `<span class="historial-nota">${escaparHTML(avance.nota)}</span>` : ""}
            </div>
            <span class="historial-cantidad">${avance.cantidad} ${avance.cantidad === 1 ? "vez" : "veces"}</span>
        `;

        lista.appendChild(li);

    });

}

function manejarVista(estado, reto) {

    const infoBox = document.getElementById("infoBoxSinIniciar");
    const btnComenzar = document.getElementById("btnComenzar");
    const btnRegistrarAvance = document.getElementById("btnRegistrarAvance");

    if (estado.estado === "disponible") {

        infoBox.style.display = "flex";
        btnComenzar.style.display = "flex";
        btnRegistrarAvance.style.display = "none";

    } else if (estado.estado === "activo") {

        infoBox.style.display = "none";
        btnComenzar.style.display = "none";
        btnRegistrarAvance.style.display = "inline-flex";

    } else if (estado.estado === "completado") {

        mostrarRecompensa(reto);

    }

}

function mostrarRecompensa(reto) {

    document.getElementById("vistaReto").style.display = "none";

    const vistaRecompensa = document.getElementById("vistaRecompensa");
    vistaRecompensa.classList.add("show");

    document.getElementById("recompensaTitulo").textContent =
        `Completaste "${reto.titulo}" y contribuiste a un planeta más sostenible.`;

    document.getElementById("recompensaPuntos").textContent = `+${reto.puntosNum}`;
    document.getElementById("recompensaInsignia").textContent = reto.insignia;
    document.getElementById("recompensaImpacto").textContent = reto.impacto;

}

// ===== MODAL: REGISTRAR AVANCE =====

function abrirModalAvance() {

    document.getElementById("cantidadValor").textContent = "1";

    const inputFecha = document.getElementById("inputFecha");
    inputFecha.value = new Date().toISOString().split("T")[0];

    document.getElementById("inputNota").value = "";

    document.getElementById("modalAvance").classList.add("show");

}

function cerrarModalAvance() {
    document.getElementById("modalAvance").classList.remove("show");
}

function cambiarCantidad(delta) {

    const span = document.getElementById("cantidadValor");
    let valor = parseInt(span.textContent, 10) + delta;

    valor = Math.max(1, valor);

    span.textContent = valor;

}

function guardarAvance() {

    const cantidad = parseInt(document.getElementById("cantidadValor").textContent, 10);
    const fecha = document.getElementById("inputFecha").value;
    const nota = document.getElementById("inputNota").value.trim();

    if (!fecha) {
        alert("Por favor selecciona una fecha.");
        return;
    }

    const entrada = { fecha, cantidad, nota };

    const nuevoEstado = registrarAvance(retoIdActual, retoActual, entrada);

    cerrarModalAvance();

    pintarProgreso(retoActual, nuevoEstado);
    pintarHistorial(nuevoEstado);
    manejarVista(nuevoEstado, retoActual);

}

// ===== HELPERS =====

function formatearFecha(fechaStr) {

    const [anio, mes, dia] = fechaStr.split("-");
    return `${dia}/${mes}/${anio}`;

}

function escaparHTML(str) {

    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;

}