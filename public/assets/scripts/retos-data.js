// ===== DATOS DE LOS RETOS (compartido entre retos.html y detalle-reto.html) =====

const retosData = {

    bicicleta: {
        titulo: "Usa bicicleta",
        descripcion: "Reduce emisiones utilizando la bicicleta como medio de transporte durante la semana.",
        imagen: "assets/images/usarbicicleta.png",
        dificultad: "Fácil",
        dificultadClass: "easy",
        duracion: "7 días",
        objetivo: "Usa la bicicleta 3 veces esta semana.",
        impacto: "-0.40 kg CO₂e",
        puntos: "150 puntos",
        puntosNum: 150,
        insignia: "Movilidad Verde",
        dato: "Usar bicicleta en lugar de auto en trayectos cortos reduce la contaminación del aire y mejora tu salud.",
        comoCompletar: "Usa tu bicicleta como medio de transporte en al menos 3 ocasiones durante esta semana.",
        checklist: ["Día 1: Usa tu bicicleta", "Día 2: Usa tu bicicleta", "Día 3: Usa tu bicicleta"],
        consejo: "Combina tu ruta en bicicleta con otras actividades sostenibles para maximizar tu impacto positivo.",
        progresoTotal: 3
    },

    plastico: {
        titulo: "Menos plástico",
        descripcion: "Evita plásticos de un solo uso durante 7 días.",
        imagen: "assets/images/menosplastico.png",
        dificultad: "Medio",
        dificultadClass: "medium",
        duracion: "7 días",
        objetivo: "Evita el plástico de un solo uso toda la semana.",
        impacto: "-0.55 kg CO₂e",
        puntos: "200 puntos",
        puntosNum: 200,
        insignia: "Guerrero Anti-Plástico",
        dato: "Cada año se producen más de 300 millones de toneladas de plástico, y gran parte termina en océanos.",
        comoCompletar: "Evita bolsas, botellas y empaques de plástico desechable durante los 7 días.",
        checklist: ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"],
        consejo: "Lleva siempre una botella y bolsas reutilizables para evitar tentaciones.",
        progresoTotal: 7
    },

    ducha: {
        titulo: "Duchas conscientes",
        descripcion: "Toma duchas menores de cinco minutos durante una semana.",
        imagen: "assets/images/ducha.png",
        dificultad: "Difícil",
        dificultadClass: "hard",
        duracion: "7 días",
        objetivo: "Duchas de menos de 5 minutos toda la semana.",
        impacto: "-0.30 kg CO₂e",
        puntos: "250 puntos",
        puntosNum: 250,
        insignia: "Ahorrador de Agua",
        dato: "Una ducha de 5 minutos usa hasta 3 veces menos agua que una de 15 minutos.",
        comoCompletar: "Cronometra tus duchas y mantente por debajo de los 5 minutos cada día.",
        checklist: ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"],
        consejo: "Usa un cronómetro o playlist corta para medir el tiempo sin estrés.",
        progresoTotal: 7
    },

    local: {
        titulo: "Alimentación local",
        descripcion: "Consume productos locales y de temporada esta semana.",
        imagen: "assets/images/alimentacion.png",
        dificultad: "Fácil",
        dificultadClass: "easy",
        duracion: "5 días",
        objetivo: "Compra alimentos locales 5 días esta semana.",
        impacto: "-0.25 kg CO₂e",
        puntos: "120 puntos",
        puntosNum: 120,
        insignia: "Consumidor Consciente",
        dato: "Los alimentos importados generan hasta 5 veces más emisiones por transporte que los locales.",
        comoCompletar: "Elige productos de mercados o productores locales al menos 5 días de la semana.",
        checklist: ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5"],
        consejo: "Visita ferias o mercados de tu zona, suelen tener mejores precios en productos locales.",
        progresoTotal: 5
    },

    arbol: {
        titulo: "Planta un árbol",
        descripcion: "Planta un árbol o cuida una planta durante 7 días.",
        imagen: "assets/images/plantar.png",
        dificultad: "Medio",
        dificultadClass: "medium",
        duracion: "7 días",
        objetivo: "Cuida una planta o árbol toda la semana.",
        impacto: "-0.60 kg CO₂e",
        puntos: "180 puntos",
        puntosNum: 180,
        insignia: "Guardián Verde",
        dato: "Un solo árbol puede absorber hasta 22 kg de CO₂ al año.",
        comoCompletar: "Riega y cuida tu planta o árbol diariamente durante 7 días.",
        checklist: ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"],
        consejo: "Si no tienes espacio, una maceta pequeña en tu ventana también cuenta.",
        progresoTotal: 7
    },

    papel: {
        titulo: "Oficina sin papel",
        descripcion: "Reduce el consumo de papel en tu trabajo durante una semana.",
        imagen: "assets/images/oficina.png",
        dificultad: "Difícil",
        dificultadClass: "hard",
        duracion: "7 días",
        objetivo: "Reduce el uso de papel en el trabajo toda la semana.",
        impacto: "-0.45 kg CO₂e",
        puntos: "220 puntos",
        puntosNum: 220,
        insignia: "Oficina Sostenible",
        dato: "Producir una tonelada de papel requiere alrededor de 17 árboles.",
        comoCompletar: "Digitaliza documentos y evita imprimir siempre que sea posible.",
        checklist: ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"],
        consejo: "Usa notas digitales o PDFs editables en lugar de imprimir borradores.",
        progresoTotal: 7
    }

};

// ===== HELPERS DE LOCALSTORAGE (compartidos) =====

const RETOS_STORAGE_KEY = "huellago_retos";

function obtenerProgresoRetos() {

    try {
        return JSON.parse(localStorage.getItem(RETOS_STORAGE_KEY)) || {};
    } catch {
        return {};
    }

}

function guardarProgresoRetos(data) {
    localStorage.setItem(RETOS_STORAGE_KEY, JSON.stringify(data));
}

function obtenerEstadoReto(retoId) {

    const data = obtenerProgresoRetos();

    return data[retoId] || { estado: "disponible", progreso: 0, avances: [] };

}

function actualizarEstadoReto(retoId, cambios) {

    const data = obtenerProgresoRetos();

    data[retoId] = { ...obtenerEstadoReto(retoId), ...cambios };

    guardarProgresoRetos(data);

    return data[retoId];

}

// Registra un nuevo avance (fecha + cantidad + nota) y recalcula el progreso total

function registrarAvance(retoId, reto, entrada) {

    const estadoActual = obtenerEstadoReto(retoId);

    const avances = [...(estadoActual.avances || []), entrada];

    // Más reciente primero, para el historial
    avances.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const progreso = Math.min(
        avances.reduce((sum, a) => sum + Number(a.cantidad), 0),
        reto.progresoTotal
    );

    const nuevoEstado = progreso >= reto.progresoTotal ? "completado" : "activo";

    return actualizarEstadoReto(retoId, { avances, progreso, estado: nuevoEstado });

}