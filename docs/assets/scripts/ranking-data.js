// ===== DATOS DEL RANKING (HU41, HU42) =====
// Depende de retos-data.js (retosData, obtenerEstadoReto) y huella-data.js (obtenerDatosHuella)

// Usuarios simulados por periodo (no hay backend, así que la "comunidad" es data mock).
// El usuario real se inserta y se ordena junto a ellos según sus EcoPuntos reales.

const RANKING_SIMULADO = {

    semanal: [
        { nombre: "Valentina Ríos", puntos: 620 },
        { nombre: "Carlos Medina", puntos: 480 },
        { nombre: "Ana Torres", puntos: 390 },
        { nombre: "Diego Salas", puntos: 210 },
        { nombre: "Lucía Fernández", puntos: 150 }
    ],

    mensual: [
        { nombre: "Valentina Ríos", puntos: 2450 },
        { nombre: "Carlos Medina", puntos: 1980 },
        { nombre: "Ana Torres", puntos: 1600 },
        { nombre: "Diego Salas", puntos: 1120 },
        { nombre: "Lucía Fernández", puntos: 840 }
    ],

    anual: [
        { nombre: "Valentina Ríos", puntos: 12550 },
        { nombre: "Carlos Medina", puntos: 10230 },
        { nombre: "Ana Torres", puntos: 8000 },
        { nombre: "Diego Salas", puntos: 6400 },
        { nombre: "Lucía Fernández", puntos: 5200 }
    ]

};

// Promedio de huella semanal de la comunidad (mock, en kg CO2e/semana)

const PROMEDIO_HUELLA_COMUNIDAD = 3.2;

const DIAS_POR_PERIODO = {
    semanal: 7,
    mensual: 30,
    anual: 365
};

// Calcula los EcoPuntos reales del usuario en un periodo, según cuándo completó cada reto
// (usa la fecha del último avance registrado como fecha de finalización)

function calcularEcoPuntosUsuario(periodo) {

    const dias = DIAS_POR_PERIODO[periodo] ?? 365;
    const ahora = new Date();

    let total = 0;

    Object.keys(retosData).forEach((id) => {

        const estado = obtenerEstadoReto(id);

        if (estado.estado !== "completado") return;

        const avances = estado.avances || [];

        if (avances.length === 0) {

            // Reto completado sin historial de avances (datos viejos / migrados).
            // Al no saber cuándo se completó, solo lo contamos en el periodo
            // anual para no inflar artificialmente el ranking semanal o mensual.
            if (periodo === "anual") {
                total += retosData[id].puntosNum;
            }

            return;

        }

        const fechaCompletado = new Date(avances[0].fecha); // avances[0] = más reciente
        const diffDias = (ahora - fechaCompletado) / (1000 * 60 * 60 * 24);

        if (diffDias <= dias) {
            total += retosData[id].puntosNum;
        }

    });

    return total;

}

// Devuelve el ranking completo de un periodo, con el usuario insertado y ordenado

function obtenerRankingPeriodo(periodo) {

    const puntosUsuario = calcularEcoPuntosUsuario(periodo);

    const lista = [
        ...RANKING_SIMULADO[periodo].map((u) => ({ ...u, esUsuarioActual: false })),
        { nombre: "Tú", puntos: puntosUsuario, esUsuarioActual: true }
    ];

    lista.sort((a, b) => b.puntos - a.puntos);

    return lista.map((u, index) => ({ ...u, posicion: index + 1 }));

}

// Comparación de huella del usuario contra el promedio de la comunidad (HU42)

function obtenerComparacionHuella() {

    const data = obtenerDatosHuella();

    if (!data || !data.historial || data.historial.length === 0) {

        return { tieneDatos: false };

    }

    const huellaUsuario = data.historial[0].valor;
    const diferenciaPct = Math.round(
        ((huellaUsuario - PROMEDIO_HUELLA_COMUNIDAD) / PROMEDIO_HUELLA_COMUNIDAD) * 100
    );

    return {
        tieneDatos: true,
        huellaUsuario,
        promedioComunidad: PROMEDIO_HUELLA_COMUNIDAD,
        diferenciaPct
    };

}