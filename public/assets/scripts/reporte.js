// ===== DESCARGAR REPORTE DEL DASHBOARD (.txt) =====
// Lee directamente lo que ya esta pintado en la pantalla (stats, actividades,
// equivalencias, reto activo) y arma un archivo de texto plano para descargar.
// No depende de dashboard.js: sirve tanto si esos valores son estaticos como
// si en algun momento se vuelven dinamicos.

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("descargarReporteBtn");
    if (!btn) return;

    btn.addEventListener("click", generarYDescargarReporte);

});

function generarYDescargarReporte() {

    const lineas = [];

    lineas.push("HUELLAGO - REPORTE DE IMPACTO AMBIENTAL");
    lineas.push(`Generado el: ${new Date().toLocaleString("es-PE")}`);
    lineas.push("=".repeat(50));
    lineas.push("");

    // ----- Stats principales (Huella Total, EcoPuntos, Impacto Diario) -----

    document.querySelectorAll(".stat-card").forEach((card) => {

        const label = card.querySelector(".stat-label")?.textContent.trim();
        const value = card.querySelector(".stat-value")?.textContent.replace(/\s+/g, " ").trim();
        const badge = card.querySelector(".badge")?.textContent.trim();
        const footer = card.querySelector(".stat-footer")?.textContent.trim();

        if (!label) return;

        lineas.push(`${label}: ${value || "—"}`);
        if (badge) lineas.push(`  Estado: ${badge}`);
        if (footer) lineas.push(`  ${footer}`);
        lineas.push("");

    });

    // ----- Actividades con mayor impacto -----

    const actividades = document.querySelectorAll(".activity-list li");

    if (actividades.length > 0) {

        lineas.push("ACTIVIDADES CON MAYOR IMPACTO");
        lineas.push("-".repeat(50));

        actividades.forEach((li) => {
            const nombre = li.querySelector(".activity-info span")?.textContent.trim();
            const porcentaje = li.querySelector(".activity-percent")?.textContent.trim();
            if (nombre) lineas.push(`- ${nombre}: ${porcentaje || ""}`);
        });

        lineas.push("");

    }

    // ----- Equivalencias visuales -----

    const equivalencias = document.querySelectorAll(".equivalencia-item");

    if (equivalencias.length > 0) {

        lineas.push("EQUIVALENCIAS VISUALES");
        lineas.push("-".repeat(50));

        equivalencias.forEach((item) => {
            const numero = item.querySelector("h4")?.textContent.trim();
            const etiqueta = item.querySelector("p")?.textContent.trim();
            if (numero && etiqueta) lineas.push(`- ${etiqueta}: ${numero}`);
        });

        lineas.push("");

    }

    // ----- Reto activo -----

    const retoTitulo = document.querySelector(".reto-info h4")?.textContent.trim();

    if (retoTitulo) {

        lineas.push("RETO ACTIVO");
        lineas.push("-".repeat(50));
        lineas.push(retoTitulo);

        const retoDesc = document.querySelector(".reto-info p")?.textContent.trim();
        if (retoDesc) lineas.push(retoDesc);

        const retoProgreso = document.querySelector(".reto-progress-text")?.textContent.trim();
        if (retoProgreso) lineas.push(retoProgreso);

        lineas.push("");

    }

    const contenido = lineas.join("\n");

    descargarTxt(contenido);

}

function descargarTxt(contenido) {

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const fecha = new Date().toISOString().slice(0, 10);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `huellago-reporte-${fecha}.txt`;

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(url);

}