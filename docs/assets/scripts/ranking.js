document.addEventListener("DOMContentLoaded", () => {

    // ===== RANKING (HU41) =====
    // Nota: toda la logica de sidebar / logout / perfil / hamburger ya vive en
    // components.js (marcarPaginaActiva, initSidebarToggle, initProfileMenu, initLogout).
    // Aqui solo se queda lo que es especifico de esta pagina.

    document.querySelectorAll(".filter-btn").forEach((btn) => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".filter-btn").forEach((b) => {
                b.classList.remove("active-filter");
                b.setAttribute("aria-pressed", "false");
            });

            btn.classList.add("active-filter");
            btn.setAttribute("aria-pressed", "true");

            pintarRanking(btn.getAttribute("data-periodo"));

        });

    });

    pintarRanking("semanal");

    // ===== COMPARACIÓN DE HUELLA (HU42) =====

    pintarComparacion();

});

// ===== RENDER RANKING =====

function pintarRanking(periodo) {

    const lista = obtenerRankingPeriodo(periodo);
    const infoBox = document.getElementById("rankingInfoBox");
    const grid = document.getElementById("rankingGrid");

    // HU41: si casi nadie tiene puntos todavía, avisamos

    const totalConPuntos = lista.filter(u => u.puntos > 0).length;

    if (totalConPuntos < 2) {

        infoBox.style.display = "flex";
        document.getElementById("rankingInfoTexto").textContent =
            "Todavía no hay suficientes datos para mostrar un ranking completo. ¡Completa retos para empezar a sumar puntos!";

    } else {

        infoBox.style.display = "none";

    }

    grid.style.display = "grid";

    pintarPodio(lista);
    pintarTabla(lista);
    pintarPosicion(lista);

}

function pintarPodio(lista) {

    const contenedor = document.getElementById("podiumContainer");
    const top3 = lista.slice(0, 3);

    const orden = [1, 0, 2]; // segundo, primero, tercero (para el efecto de podio)
    const clases = ["second-place", "winner", "third-place"];
    const iconos = ["assets/images/top2.png", "assets/images/top1.png", "assets/images/top3.png"];

    contenedor.innerHTML = "";

    orden.forEach((indice, i) => {

        const usuario = top3[indice];
        if (!usuario) return;

        const div = document.createElement("div");
        div.className = `podium-item ${clases[i]}`;

        div.innerHTML = `
            <img src="${iconos[i]}" alt="" class="podium-icon ${i === 1 ? "podium-icon-winner" : ""}">
            <h3>${usuario.nombre}</h3>
            <span>${formatearPuntos(usuario.puntos)} pts</span>
            ${i === 1 ? `<div class="winner-badge">🏆 Líder del periodo</div>` : ""}
        `;

        contenedor.appendChild(div);

    });

}

function pintarTabla(lista) {

    const tbody = document.getElementById("rankingTableBody");
    tbody.innerHTML = "";

    lista.forEach((usuario) => {

        const tr = document.createElement("tr");

        if (usuario.esUsuarioActual) tr.classList.add("user-row");

        tr.innerHTML = `
            <td>${usuario.posicion}</td>
            <td class="institution-cell">
                <img src="assets/icons/user.png" alt="" class="institution-icon">
                <span>${usuario.nombre}${usuario.esUsuarioActual ? " (tú)" : ""}</span>
            </td>
            <td>${formatearPuntos(usuario.puntos)} pts</td>
        `;

        tbody.appendChild(tr);

    });

}

function pintarPosicion(lista) {

    const usuario = lista.find(u => u.esUsuarioActual);

    // Guarda de seguridad: si por algún motivo el usuario actual no está
    // en la lista, no reventamos el resto del render.
    if (!usuario) return;

    document.getElementById("position-number").textContent = `#${usuario.posicion}`;
    document.getElementById("position-total").textContent = `de ${lista.length} participantes`;

    const mensaje = document.getElementById("position-mensaje");

    if (usuario.puntos === 0) {
        mensaje.textContent = "Todavía no tienes puntos en este periodo. ¡Completa un reto para empezar!";
    } else if (usuario.posicion === 1) {
        mensaje.textContent = "¡Vas primero! Sigue así.";
    } else {
        mensaje.textContent = "¡Sigue así, puedes subir más!";
    }

}

function formatearPuntos(numero) {
    return numero.toLocaleString("es-PE");
}

// ===== RENDER COMPARACIÓN (HU42) =====

function pintarComparacion() {

    const comparacion = obtenerComparacionHuella();

    const contenido = document.getElementById("comparacionContenido");
    const infoBox = document.getElementById("comparacionInfoBox");

    if (!comparacion.tieneDatos) {

        contenido.style.display = "none";
        infoBox.style.display = "flex";
        return;

    }

    contenido.style.display = "block";
    infoBox.style.display = "none";

    const maximo = Math.max(comparacion.huellaUsuario, comparacion.promedioComunidad, 0.1);

    document.getElementById("barraUsuario").style.width =
        `${(comparacion.huellaUsuario / maximo) * 100}%`;

    document.getElementById("barraPromedio").style.width =
        `${(comparacion.promedioComunidad / maximo) * 100}%`;

    document.getElementById("valorUsuario").textContent = `${comparacion.huellaUsuario} kg`;
    document.getElementById("valorPromedio").textContent = `${comparacion.promedioComunidad} kg`;

    const mensaje = document.getElementById("comparacionMensaje");
    const diferencia = Math.abs(comparacion.diferenciaPct);

    if (comparacion.diferenciaPct === 0) {

        mensaje.textContent = "Tu huella está exactamente en el promedio de la comunidad.";
        mensaje.className = "comparacion-mensaje";

    } else if (comparacion.diferenciaPct < 0) {

        mensaje.textContent = `¡Vas muy bien! Tu huella es ${diferencia}% menor que el promedio de la comunidad.`;
        mensaje.className = "comparacion-mensaje positivo";

    } else {

        mensaje.textContent = `Tu huella es ${diferencia}% mayor que el promedio de la comunidad. Revisa tus recomendaciones para mejorar.`;
        mensaje.className = "comparacion-mensaje negativo";

    }

}