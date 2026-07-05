// ===== DATOS DE INSIGNIAS Y NIVELES (HU25, HU26, HU27) =====
// Depende de retos-data.js (retosData, obtenerEstadoReto) y huella-data.js (obtenerDatosHuella)
//
// IMPORTANTE: este archivo asume que cada reto en `retosData` tiene un campo
// `categoria` (ej: "Transporte", "Energia", "Residuos", "Agua", "Naturaleza")
// y `puntosNum`. Si tus categorías reales tienen otros nombres, ajusta el
// array CATEGORIAS_INSIGNIAS más abajo — el resto del archivo no cambia.

// ===== NIVELES (HU26) =====

const NIVELES = [
    { nivel: 1, nombre: "Eco Iniciado", minPuntos: 0 },
    { nivel: 2, nombre: "Eco Consciente", minPuntos: 50 },
    { nivel: 3, nombre: "Eco Activo", minPuntos: 150 },
    { nivel: 4, nombre: "Eco Comprometido", minPuntos: 250 },
    { nivel: 5, nombre: "Guardián Verde", minPuntos: 350 },
    { nivel: 6, nombre: "Guardián Supremo", minPuntos: 500 },
    { nivel: 7, nombre: "Leyenda Verde", minPuntos: 1000 }
];

// ===== CATÁLOGO DE INSIGNIAS (HU27) =====
// `criterio(stats)` devuelve true/false si ya se desbloqueó.
// `progreso(stats)` devuelve {actual, meta} para pintar la barra cuando está bloqueada.

const INSIGNIAS = [
    {
        id: "eco-starter",
        nombre: "Eco Starter",
        descripcion: "Calcula tu huella por primera vez",
        icono: "🌱",
        criterio: (s) => s.huellaCalculada,
        progreso: (s) => ({ actual: s.huellaCalculada ? 1 : 0, meta: 1, unidad: "huella calculada" })
    },
    {
        id: "bici-fast",
        nombre: "Bici Fast",
        descripcion: "Usa la bicicleta 5 veces",
        icono: "🚲",
        criterio: (s) => s.completadosPorCategoria["Transporte"] >= 5,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Transporte"], 5), meta: 5, unidad: "veces" })
    },
    {
        id: "energy-saver",
        nombre: "Energy Saver",
        descripcion: "Completa retos de energía 7 veces",
        icono: "⚡",
        criterio: (s) => s.completadosPorCategoria["Energia"] >= 7,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Energia"], 7), meta: 7, unidad: "retos" })
    },
    {
        id: "reciclador",
        nombre: "Reciclador",
        descripcion: "Separa residuos 5 veces",
        icono: "♻️",
        criterio: (s) => s.completadosPorCategoria["Residuos"] >= 5,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Residuos"], 5), meta: 5, unidad: "veces" })
    },
    {
        id: "agua-consciente",
        nombre: "Agua Consciente",
        descripcion: "Reduce tu consumo de agua",
        icono: "💧",
        criterio: (s) => s.completadosPorCategoria["Agua"] >= 1,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Agua"], 1), meta: 1, unidad: "retos" })
    },
    {
        id: "naturaleza-activa",
        nombre: "Naturaleza Activa",
        descripcion: "Participa en una reunión ambiental",
        icono: "🌲",
        criterio: (s) => s.completadosPorCategoria["Naturaleza"] >= 1,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Naturaleza"], 1), meta: 1, unidad: "retos" })
    },
    {
        id: "green-hero",
        nombre: "Green Hero",
        descripcion: "Acumula 10 retos de transporte sostenible",
        icono: "🚴",
        criterio: (s) => s.completadosPorCategoria["Transporte"] >= 10,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Transporte"], 10), meta: 10, unidad: "retos" })
    },
    {
        id: "maestro-ahorro",
        nombre: "Maestro del ahorro",
        descripcion: "Completa 15 retos de energía",
        icono: "💡",
        criterio: (s) => s.completadosPorCategoria["Energia"] >= 15,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Energia"], 15), meta: 15, unidad: "retos" })
    },
    {
        id: "guardian-supremo",
        nombre: "Guardián Supremo",
        descripcion: "Alcanza 1000 eco puntos",
        icono: "🛡️",
        criterio: (s) => s.puntosTotales >= 1000,
        progreso: (s) => ({ actual: Math.min(s.puntosTotales, 1000), meta: 1000, unidad: "pts" })
    },
    {
        id: "cero-plastico",
        nombre: "Cero Plástico",
        descripcion: "Completa 10 retos de residuos",
        icono: "🚯",
        criterio: (s) => s.completadosPorCategoria["Residuos"] >= 10,
        progreso: (s) => ({ actual: Math.min(s.completadosPorCategoria["Residuos"], 10), meta: 10, unidad: "retos" })
    },
    {
        id: "embajador-verde",
        nombre: "Embajador Verde",
        descripcion: "Completa 20 retos en total",
        icono: "🌍",
        criterio: (s) => s.totalRetosCompletados >= 20,
        progreso: (s) => ({ actual: Math.min(s.totalRetosCompletados, 20), meta: 20, unidad: "retos" })
    },
    {
        id: "constancia-verde",
        nombre: "Constancia Verde",
        descripcion: "Alcanza el nivel 4 (Eco Comprometido)",
        icono: "🏆",
        criterio: (s) => s.nivelActual.nivel >= 4,
        progreso: (s) => ({ actual: Math.min(s.nivelActual.nivel, 4), meta: 4, unidad: "nivel" })
    }
];

const CATEGORIAS_INSIGNIAS = ["Transporte", "Energia", "Residuos", "Agua", "Naturaleza"];

// ===== CÁLCULO DE ESTADÍSTICAS BASE =====
// Todo lo que necesitan niveles e insignias sale de aquí. Se envuelve en
// try/catch para que un dato corrupto en retosData/huella-data no rompa
// la pantalla (HU25: "notificar si ocurre un error").

function calcularEstadisticasUsuario() {

    const completadosPorCategoria = {};
    CATEGORIAS_INSIGNIAS.forEach((cat) => (completadosPorCategoria[cat] = 0));

    let puntosTotales = 0;
    let totalRetosCompletados = 0;

    Object.keys(retosData).forEach((id) => {

        const reto = retosData[id];
        const estado = obtenerEstadoReto(id);

        if (estado.estado !== "completado") return;

        totalRetosCompletados += 1;
        puntosTotales += reto.puntosNum || 0;

        const categoria = reto.categoria;
        if (categoria && completadosPorCategoria.hasOwnProperty(categoria)) {
            completadosPorCategoria[categoria] += 1;
        }

    });

    let huellaCalculada = false;
    const datosHuella = typeof obtenerDatosHuella === "function" ? obtenerDatosHuella() : null;
    if (datosHuella && datosHuella.historial && datosHuella.historial.length > 0) {
        huellaCalculada = true;
    }

    const nivelActual = obtenerNivelInfo(puntosTotales).actual;

    return {
        puntosTotales,
        totalRetosCompletados,
        completadosPorCategoria,
        huellaCalculada,
        nivelActual
    };

}

// Wrapper seguro: si algo revienta, devuelve stats "vacías" + una bandera de error
// para que la UI muestre la notificación correspondiente sin quedar en blanco.

function obtenerEstadisticasSeguras() {

    try {

        return { stats: calcularEstadisticasUsuario(), error: null };

    } catch (err) {

        console.error("Error calculando eco puntos:", err);

        const statsVacias = {
            puntosTotales: 0,
            totalRetosCompletados: 0,
            completadosPorCategoria: {},
            huellaCalculada: false,
            nivelActual: NIVELES[0]
        };

        return { stats: statsVacias, error: "No pudimos calcular tus eco puntos en este momento. Intenta de nuevo más tarde." };

    }

}

// ===== NIVEL ACTUAL Y SIGUIENTE (HU26) =====

function obtenerNivelInfo(puntos) {

    let actual = NIVELES[0];
    let siguiente = null;

    for (let i = 0; i < NIVELES.length; i++) {

        if (puntos >= NIVELES[i].minPuntos) {
            actual = NIVELES[i];
            siguiente = NIVELES[i + 1] || null;
        }

    }

    if (!siguiente) {

        return {
            actual,
            siguiente: null,
            puntosFaltantes: 0,
            porcentaje: 100,
            esNivelMaximo: true
        };

    }

    const rango = siguiente.minPuntos - actual.minPuntos;
    const avance = puntos - actual.minPuntos;
    const porcentaje = Math.min(100, Math.round((avance / rango) * 100));

    return {
        actual,
        siguiente,
        puntosFaltantes: Math.max(0, siguiente.minPuntos - puntos),
        porcentaje,
        esNivelMaximo: false
    };

}

// ===== INSIGNIAS DESBLOQUEADAS / BLOQUEADAS (HU27) =====

function obtenerInsigniasConEstado(stats) {

    return INSIGNIAS.map((insignia) => {

        const desbloqueada = insignia.criterio(stats);
        const prog = insignia.progreso(stats);

        return {
            ...insignia,
            desbloqueada,
            progresoActual: prog.actual,
            progresoMeta: prog.meta,
            progresoUnidad: prog.unidad
        };

    });

}

// Detecta insignias nuevas comparando contra lo último guardado en localStorage.
// Devuelve la lista de insignias recién desbloqueadas en esta sesión (HU27: notificar).

function detectarInsigniasNuevas(insigniasConEstado) {

    const KEY = "huellago_insignias_vistas";
    let vistas = [];

    try {
        vistas = JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
        vistas = [];
    }

    const desbloqueadasIds = insigniasConEstado.filter(i => i.desbloqueada).map(i => i.id);
    const nuevas = insigniasConEstado.filter(i => i.desbloqueada && !vistas.includes(i.id));

    try {
        localStorage.setItem(KEY, JSON.stringify(desbloqueadasIds));
    } catch (err) {
        console.error("No se pudo guardar el estado de insignias vistas:", err);
    }

    return nuevas;

}

// ===== LOGROS / HISTORIAL (para la pestaña "Logros" del panel, HU28) =====

function obtenerLogros() {

    const logros = [];

    Object.keys(retosData).forEach((id) => {

        const reto = retosData[id];
        const estado = obtenerEstadoReto(id);

        if (estado.estado !== "completado") return;

        const avances = estado.avances || [];
        const fecha = avances.length > 0 ? avances[0].fecha : null;

        logros.push({
            nombre: reto.nombre,
            puntos: reto.puntosNum || 0,
            fecha
        });

    });

    logros.sort((a, b) => {
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        return new Date(b.fecha) - new Date(a.fecha);
    });

    return logros;

}