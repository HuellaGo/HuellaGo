// ===== DATOS Y CÁLCULO DE HUELLA (compartido: mi-huella, recalcular_huella, actualizar-habitos) =====

const HUELLA_STORAGE_KEY = "huellago_huella";

// ----- FACTORES DE EMISIÓN (aproximados, con fines de demo/prototipo) -----
// Puedes ajustar estos números libremente, son solo para que el cálculo sea consistente.

const FACTOR_TRANSPORTE = {
    "Bicicleta": 0,
    "Caminando": 0,
    "Bus": 0.05,
    "Auto": 0.12,
    "Moto": 0.08
};

const FACTOR_ENERGIA_VIVIENDA = {
    "Casa": 1.2,
    "Departamento": 0.8,
    "Apartamento": 0.8
};

const FACTOR_ENERGIA_FUENTE = {
    "Electricidad": 1,
    "Gas": 0.85,
    "Solar": 0.25
};

const FACTOR_ALIMENTACION = {
    "Vegana": 0.3,
    "Vegetariana": 0.5,
    "Mixta": 1,
    "Omnívora": 1
};

const FACTOR_PLASTICOS = {
    "Bajo": 0.2,
    "Medio": 0.5,
    "Alto": 0.9
};

// Calcula el aporte de cada categoría por separado (útil para "principal fuente de emisiones")

function calcularSubtotales(habitos) {

    const t = (habitos && habitos.transporte) || {};
    const e = (habitos && habitos.energia) || {};
    const a = (habitos && habitos.alimentacion) || {};
    const r = (habitos && habitos.residuos) || {};

    const transporte = (FACTOR_TRANSPORTE[t.medio] ?? 0.08) * (Number(t.kmSemana) || 0);

    const energiaBase = FACTOR_ENERGIA_VIVIENDA[e.vivienda] ?? 1;
    const energiaFuente = FACTOR_ENERGIA_FUENTE[e.fuente] ?? 1;
    const personas = Math.max(1, Number(e.personas) || 1);
    const energia = energiaBase * energiaFuente * (1 + (personas - 1) * 0.25);

    const alimentacion = (FACTOR_ALIMENTACION[a.tipo] ?? 1) * 2;

    const plasticoFactor = FACTOR_PLASTICOS[r.plasticos] ?? 0.5;
    const residuos = plasticoFactor * (r.reciclas ? 0.7 : 1) * 2;

    return { transporte, energia, alimentacion, residuos };

}

// Devuelve el total en kg CO2e, redondeado a 2 decimales

function calcularHuella(habitos) {

    const { transporte, energia, alimentacion, residuos } = calcularSubtotales(habitos);
    const total = transporte + energia + alimentacion + residuos;

    return Math.round(total * 100) / 100;

}

// Devuelve { nombre, porcentaje } de la categoría que más emite

function obtenerPrincipalFuente(habitos) {

    const subtotales = calcularSubtotales(habitos);
    const total = Object.values(subtotales).reduce((s, v) => s + v, 0) || 1;

    const nombres = {
        transporte: "Transporte",
        energia: "Energía",
        alimentacion: "Alimentación",
        residuos: "Residuos"
    };

    const [key, valor] = Object.entries(subtotales).sort((a, b) => b[1] - a[1])[0];

    return {
        nombre: nombres[key],
        porcentaje: Math.round((valor / total) * 100)
    };

}

function obtenerNivelHuella(kg) {

    if (kg < 2) return "Bajo";
    if (kg < 4) return "Moderado";
    return "Alto";

}

// Sugerencia simple según la categoría que más emite

function obtenerRecomendacionPrincipal(habitos) {

    const { nombre } = obtenerPrincipalFuente(habitos);

    const mensajes = {
        "Transporte": "Si usas bicicleta o transporte público dos veces más por semana podrías reducir tu huella notablemente.",
        "Energía": "Reducir el uso de electrodomésticos en horas pico o cambiar a fuentes más limpias puede bajar tu huella.",
        "Alimentación": "Aumentar tus comidas vegetarianas durante la semana puede reducir tu huella de forma significativa.",
        "Residuos": "Reducir el uso de plásticos de un solo uso y reciclar más puede bajar tu huella considerablemente."
    };

    return mensajes[nombre] || "Sigue registrando tus hábitos para recibir recomendaciones personalizadas.";

}

// ----- LOCALSTORAGE -----

function obtenerDatosHuella() {

    try {
        return JSON.parse(localStorage.getItem(HUELLA_STORAGE_KEY)) || null;
    } catch {
        return null;
    }

}

function guardarDatosHuella(data) {
    localStorage.setItem(HUELLA_STORAGE_KEY, JSON.stringify(data));
}

// Guarda una nueva medición: recalcula el total y lo agrega al historial.
// Se usa tanto al terminar el wizard de "Recalcular huella" como al guardar en "Actualizar hábitos".

function guardarMedicion(habitos) {

    const data = obtenerDatosHuella() || { habitos: null, historial: [] };

    const kg = calcularHuella(habitos);
    const anterior = data.historial[0]?.valor;

    const cambioPct = anterior
        ? Math.round(((kg - anterior) / anterior) * 100)
        : 0;

    const entrada = {
        fecha: new Date().toISOString(),
        valor: kg,
        cambioPct
    };

    data.historial.unshift(entrada);
    data.habitos = habitos;

    guardarDatosHuella(data);

    return data;

}

function formatearFechaLarga(isoString) {

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const fecha = new Date(isoString);

    return `${fecha.getDate()} ${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;

}