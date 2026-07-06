// ===== MOTOR DE RECOMENDACIONES (basado en reglas sobre los hábitos guardados) =====
// Depende de huella-data.js (calcularSubtotales, obtenerDatosHuella)

const RECOMENDACIONES_STORAGE_KEY = "huellago_recomendaciones";

// ----- REGLAS: siempre genera una recomendación por categoría, con distinto nivel según el hábito -----

function generarRecomendaciones() {

    const data = obtenerDatosHuella();

    if (!data || !data.habitos) return [];

    const habitos = data.habitos;
    const subtotales = calcularSubtotales(habitos);
    const recomendaciones = [];

    // ===== TRANSPORTE =====

    const medio = habitos.transporte?.medio;

    if (medio === "Auto" || medio === "Moto") {

        recomendaciones.push({
            id: "transporte-cambiar-medio",
            categoria: "Transporte",
            titulo: "Cambia a bicicleta o transporte público",
            descripcion: `Usas ${medio.toLowerCase()} como medio principal. Cambiarlo por bicicleta o bus en trayectos cortos puede reducir bastante tu huella.`,
            impactoKg: redondear(subtotales.transporte * 0.5),
            explicacion: `Tu transporte genera aproximadamente ${subtotales.transporte.toFixed(2)} kg CO₂e a la semana. Reemplazar ${medio.toLowerCase()} por bicicleta o transporte público en al menos la mitad de tus trayectos podría reducir esa cifra hasta en un 50%.`,
            retoRelacionado: "bicicleta"
        });

    } else if (medio === "Bus") {

        recomendaciones.push({
            id: "transporte-mas-bici",
            categoria: "Transporte",
            titulo: "Usa bicicleta en trayectos cortos",
            descripcion: "Ya usas transporte público, pero podrías reemplazar algunos viajes cortos por bicicleta.",
            impactoKg: redondear(subtotales.transporte * 0.3),
            explicacion: "Reemplazar algunos viajes en bus por bicicleta en distancias cortas puede reducir hasta un 30% las emisiones asociadas a tu transporte semanal.",
            retoRelacionado: "bicicleta"
        });

    } else {

        // Bicicleta o Caminando: ya es un buen hábito, igual sugerimos sumar algo más

        recomendaciones.push({
            id: "transporte-mantener",
            categoria: "Transporte",
            titulo: "Sigue así con tu transporte sostenible",
            descripcion: "Ya usas un medio de transporte de bajo impacto. Anímate a sumar más días a la semana o motivar a alguien más a hacerlo.",
            impactoKg: redondear(Math.max(subtotales.transporte, 0.3) * 0.15),
            explicacion: "Tu transporte ya tiene un impacto muy bajo. Aumentar tu constancia semanal o invitar a otras personas a sumarse puede seguir generando un impacto positivo.",
            retoRelacionado: "bicicleta"
        });

    }

    // ===== ENERGÍA =====

    const fuente = habitos.energia?.fuente;

    if (fuente === "Electricidad") {

        recomendaciones.push({
            id: "energia-eficiencia",
            categoria: "Energía",
            titulo: "Reduce el consumo eléctrico en horas pico",
            descripcion: "Desconecta electrodomésticos que no uses y aprovecha la luz natural durante el día.",
            impactoKg: redondear(subtotales.energia * 0.25),
            explicacion: `Tu energía representa ${subtotales.energia.toFixed(2)} kg CO₂e semanales. Pequeños cambios (apagar dispositivos en standby, usar luz natural) pueden reducir ese consumo hasta en un 25%.`,
            retoRelacionado: "arbol"
        });

    } else if (fuente === "Gas") {

        recomendaciones.push({
            id: "energia-gas",
            categoria: "Energía",
            titulo: "Optimiza el uso de gas en casa",
            descripcion: "Revisa fugas y evita dejar encendidas fuentes de calor sin usar.",
            impactoKg: redondear(subtotales.energia * 0.15),
            explicacion: "El uso de gas también genera emisiones. Mantenimiento regular y buenos hábitos de uso pueden reducir tu consumo hasta en un 15%.",
            retoRelacionado: "arbol"
        });

    } else {

        // Solar: ya es una fuente limpia, igual sugerimos compensar

        recomendaciones.push({
            id: "energia-compensar",
            categoria: "Energía",
            titulo: "Compensa tu huella energética plantando árboles",
            descripcion: "Ya usas energía solar. Puedes ir un paso más allá compensando el resto de tu huella.",
            impactoKg: redondear(Math.max(subtotales.energia, 0.3) * 0.1),
            explicacion: "Usar energía solar ya reduce muchísimo tu impacto. Sumar acciones de reforestación puede ayudar a compensar el resto de tu huella total.",
            retoRelacionado: "arbol"
        });

    }

    // ===== ALIMENTACIÓN =====

    const dieta = habitos.alimentacion?.tipo;

    if (dieta === "Mixta") {

        recomendaciones.push({
            id: "alimentacion-vegetariana",
            categoria: "Alimentación",
            titulo: "Suma más comidas vegetarianas",
            descripcion: "Prueba reemplazar 2-3 comidas con carne por opciones vegetarianas esta semana.",
            impactoKg: redondear(subtotales.alimentacion * 0.4),
            explicacion: "La producción de carne genera más emisiones que las opciones vegetales. Reducir tu consumo de carne unos días a la semana puede bajar hasta un 40% el impacto de tu alimentación.",
            retoRelacionado: "local"
        });

    } else if (dieta === "Vegetariana") {

        recomendaciones.push({
            id: "alimentacion-vegana",
            categoria: "Alimentación",
            titulo: "Prueba días veganos",
            descripcion: "Ya eres vegetariano, ¡prueba algunos días completamente veganos!",
            impactoKg: redondear(subtotales.alimentacion * 0.2),
            explicacion: "Reducir el consumo de lácteos y huevos algunos días puede seguir bajando tu huella alimentaria.",
            retoRelacionado: "local"
        });

    } else {

        // Vegana: ya es la opción de menor impacto, igual sugerimos consumo local

        recomendaciones.push({
            id: "alimentacion-local",
            categoria: "Alimentación",
            titulo: "Prioriza alimentos locales y de temporada",
            descripcion: "Tu dieta ya tiene bajo impacto. Elegir productos locales reduce aún más las emisiones por transporte.",
            impactoKg: redondear(Math.max(subtotales.alimentacion, 0.3) * 0.1),
            explicacion: "Los alimentos importados generan más emisiones por transporte que los locales. Priorizar mercados o productores cercanos puede seguir bajando tu huella.",
            retoRelacionado: "local"
        });

    }

    // ===== RESIDUOS: PLÁSTICO =====

    const plasticos = habitos.residuos?.plasticos;

    if (plasticos === "Alto") {

        recomendaciones.push({
            id: "residuos-plastico-alto",
            categoria: "Residuos",
            titulo: "Reduce el uso de plásticos de un solo uso",
            descripcion: "Lleva bolsas y botellas reutilizables para reducir tu consumo de plástico.",
            impactoKg: redondear(subtotales.residuos * 0.4),
            explicacion: "Tu uso de plástico está en nivel alto. Reducirlo puede disminuir notablemente las emisiones asociadas a residuos.",
            retoRelacionado: "plastico"
        });

    } else if (plasticos === "Medio") {

        recomendaciones.push({
            id: "residuos-plastico-medio",
            categoria: "Residuos",
            titulo: "Sigue reduciendo el plástico de un solo uso",
            descripcion: "Vas por buen camino, pero todavía puedes reducir más el uso de plástico desechable.",
            impactoKg: redondear(subtotales.residuos * 0.25),
            explicacion: "Tu uso de plástico está en nivel medio. Bajarlo a nivel bajo puede seguir reduciendo el impacto de esta categoría.",
            retoRelacionado: "plastico"
        });

    } else {

        recomendaciones.push({
            id: "residuos-plastico-bajo",
            categoria: "Residuos",
            titulo: "Mantén tu bajo uso de plástico",
            descripcion: "Ya usas poco plástico de un solo uso. Comparte el hábito con tu familia o amigos.",
            impactoKg: redondear(Math.max(subtotales.residuos, 0.3) * 0.1),
            explicacion: "Tu uso de plástico ya es bajo. Motivar a otras personas cercanas a hacer lo mismo multiplica el impacto positivo.",
            retoRelacionado: "plastico"
        });

    }

    // ===== RESIDUOS: RECICLAJE =====

    if (habitos.residuos?.reciclas === false) {

        recomendaciones.push({
            id: "residuos-reciclar",
            categoria: "Residuos",
            titulo: "Empieza a reciclar en casa",
            descripcion: "Separar tus residuos reciclables reduce tu huella de forma constante cada semana.",
            impactoKg: redondear(subtotales.residuos * 0.3),
            explicacion: "Actualmente no reciclas. Comenzar a separar tus residuos puede reducir hasta un 30% el impacto de esta categoría.",
            retoRelacionado: "papel"
        });

    } else {

        recomendaciones.push({
            id: "residuos-reciclar-mas",
            categoria: "Residuos",
            titulo: "Reduce también el papel que usas",
            descripcion: "Ya reciclas en casa. Ahora prueba a reducir el consumo de papel en tu trabajo o estudios.",
            impactoKg: redondear(Math.max(subtotales.residuos, 0.3) * 0.15),
            explicacion: "Reciclar es un gran hábito. Digitalizar documentos y evitar imprimir innecesariamente puede sumar una reducción extra.",
            retoRelacionado: "papel"
        });

    }

    return recomendaciones.filter(r => r.impactoKg > 0);

}

function redondear(valor) {
    return Math.round(valor * 100) / 100;
}

// ----- ESTADO (localStorage): pendiente / realizada / convertida -----
// Se resetea automáticamente cuando cambian los hábitos (HU37)

function obtenerEstadoRecomendaciones() {

    try {
        return JSON.parse(localStorage.getItem(RECOMENDACIONES_STORAGE_KEY)) || { habitosHash: null, estados: {} };
    } catch {
        return { habitosHash: null, estados: {} };
    }

}

function guardarEstadoRecomendaciones(data) {
    localStorage.setItem(RECOMENDACIONES_STORAGE_KEY, JSON.stringify(data));
}

function hashHabitos(habitos) {
    return JSON.stringify(habitos);
}

// Devuelve las recomendaciones actuales ya combinadas con su estado guardado.
// Si detecta que los hábitos cambiaron desde la última vez, reinicia solo las pendientes.

function obtenerRecomendaciones() {

    const data = obtenerDatosHuella();

    if (!data || !data.habitos) return [];

    const recomendacionesBase = generarRecomendaciones();
    const estadoData = obtenerEstadoRecomendaciones();
    const hashActual = hashHabitos(data.habitos);

    if (estadoData.habitosHash && estadoData.habitosHash !== hashActual) {

        // Los hábitos cambiaron: las pendientes se recalculan desde cero.
        // El historial de "realizadas/convertidas" anteriores se conserva.

        Object.keys(estadoData.estados).forEach((id) => {
            if (estadoData.estados[id].estado === "pendiente") {
                delete estadoData.estados[id];
            }
        });

    }

    estadoData.habitosHash = hashActual;
    guardarEstadoRecomendaciones(estadoData);

    return recomendacionesBase.map((r) => {

        const guardado = estadoData.estados[r.id];

        return {
            ...r,
            estado: guardado?.estado || "pendiente",
            fecha: guardado?.fecha || null
        };

    });

}

// Marca una recomendación como realizada, guardando snapshot para el historial

function marcarRecomendacionRealizada(recomendacion) {

    const estadoData = obtenerEstadoRecomendaciones();

    estadoData.estados[recomendacion.id] = {
        estado: "realizada",
        fecha: new Date().toISOString(),
        snapshot: {
            titulo: recomendacion.titulo,
            categoria: recomendacion.categoria,
            impactoKg: recomendacion.impactoKg
        }
    };

    guardarEstadoRecomendaciones(estadoData);

}

// Marca una recomendación como convertida en reto

function marcarRecomendacionConvertida(recomendacion) {

    const estadoData = obtenerEstadoRecomendaciones();

    estadoData.estados[recomendacion.id] = {
        estado: "convertida",
        fecha: new Date().toISOString(),
        snapshot: {
            titulo: recomendacion.titulo,
            categoria: recomendacion.categoria,
            impactoKg: recomendacion.impactoKg,
            retoRelacionado: recomendacion.retoRelacionado
        }
    };

    guardarEstadoRecomendaciones(estadoData);

}

// Historial completo (realizadas + convertidas), más recientes primero

function obtenerHistorialRecomendaciones() {

    const estadoData = obtenerEstadoRecomendaciones();

    return Object.entries(estadoData.estados)
        .filter(([, valor]) => valor.estado === "realizada" || valor.estado === "convertida")
        .map(([id, valor]) => ({ id, ...valor }))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

}