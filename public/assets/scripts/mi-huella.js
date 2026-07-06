document.addEventListener("DOMContentLoaded", () => {

    pintarMiHuella();

    // ACTUALIZAR HÁBITOS

    const updateHabitsBtn = document.getElementById("updateHabitsBtn");

    updateHabitsBtn?.addEventListener("click", () => {
        window.location.href = "actualizar-habitos.html";
    });

    // RECALCULAR HUELLA

    const recalculateBtn = document.getElementById("recalculateBtn");
    const recalculateSmallBtn = document.getElementById("recalculateSmallBtn");

    function goToOnboarding() {
        window.location.href = "recalcular_huella.html";
    }

    recalculateBtn?.addEventListener("click", goToOnboarding);
    recalculateSmallBtn?.addEventListener("click", goToOnboarding);

});

function pintarMiHuella() {

    const data = obtenerDatosHuella();

    const sinMedicion = document.getElementById("sinMedicionCard");
    const contenido = document.getElementById("huellaContenido");

    // Si el usuario todavía no ha hecho ninguna medición

    if (!data || !data.historial || data.historial.length === 0) {

        if (sinMedicion) sinMedicion.style.display = "flex";
        if (contenido) contenido.style.display = "none";

        return;

    }

    if (sinMedicion) sinMedicion.style.display = "none";
    if (contenido) contenido.style.display = "block";

    const ultima = data.historial[0];
    const nivel = obtenerNivelHuella(ultima.valor);

    // RESUMEN

    document.getElementById("huellaValor").textContent = ultima.valor;
    document.getElementById("huellaNivel").textContent = `Nivel ${nivel}`;
    document.getElementById("huellaFecha").textContent =
        `Actualizado el ${formatearFechaLarga(ultima.fecha)}`;

    // HISTORIAL

    const tbody = document.getElementById("historialBody");
    tbody.innerHTML = "";

    data.historial.forEach((medicion) => {

        const tr = document.createElement("tr");

        const cambioTexto = medicion.cambioPct === 0
            ? "—"
            : `${medicion.cambioPct > 0 ? "↑" : "↓"} ${Math.abs(medicion.cambioPct)}%`;

        const cambioClase = medicion.cambioPct > 0 ? "red-text" : "green-text";

        tr.innerHTML = `
            <td>${formatearFechaLarga(medicion.fecha)}</td>
            <td>${medicion.valor} kg</td>
            <td class="${cambioClase}">${cambioTexto}</td>
        `;

        tbody.appendChild(tr);

    });

    // INSIGHTS

    if (data.habitos) {

        const principal = obtenerPrincipalFuente(data.habitos);

        document.getElementById("insightFuente").textContent = principal.nombre;
        document.getElementById("insightFuenteTexto").textContent =
            `Representa el ${principal.porcentaje}% de tu huella total.`;

        document.getElementById("insightRecomendacion").textContent =
            obtenerRecomendacionPrincipal(data.habitos);

    }

}