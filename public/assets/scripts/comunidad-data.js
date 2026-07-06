// ===== DATOS DE COMUNIDAD (HU43, HU44) =====

const COMUNIDAD_STORAGE_KEY = "huellago_comunidad";
const COMUNIDAD_INTRO_KEY = "huellago_comunidad_intro_vista";

// Retos colectivos simulados (no hay backend para agregarlos de verdad entre usuarios reales)

const RETOS_COLECTIVOS = [
    {
        id: "colectivo-bici-1000",
        titulo: "1000 km en bicicleta este mes",
        descripcion: "Entre toda la comunidad, sumemos 1000 km recorridos en bicicleta durante el mes.",
        metaTotal: 1000,
        avanceActual: 640,
        unidad: "km",
        participantes: 128
    },
    {
        id: "colectivo-plastico-500",
        titulo: "500 retos anti-plástico completados",
        descripcion: "Meta comunitaria: 500 personas completando el reto 'Menos plástico' este mes.",
        metaTotal: 500,
        avanceActual: 312,
        unidad: "retos",
        participantes: 312
    }
];

// ----- ESTADO EN LOCALSTORAGE -----

function obtenerDatosComunidad() {

    try {
        return JSON.parse(localStorage.getItem(COMUNIDAD_STORAGE_KEY)) || { actividad: [] };
    } catch {
        return { actividad: [] };
    }

}

function guardarDatosComunidad(data) {
    localStorage.setItem(COMUNIDAD_STORAGE_KEY, JSON.stringify(data));
}

// Registra una actividad del usuario en el feed comunitario (se llama al completar o compartir un reto)

function registrarActividadComunidad(texto) {

    const data = obtenerDatosComunidad();

    data.actividad.unshift({
        texto,
        fecha: new Date().toISOString()
    });

    data.actividad = data.actividad.slice(0, 20); // solo guardamos las últimas 20

    guardarDatosComunidad(data);

}

// Feed combinado: actividad real del usuario + algo de actividad simulada de la comunidad

const ACTIVIDAD_SIMULADA = [
    { texto: "Valentina Ríos completó el reto \"Oficina sin papel\"", fecha: null },
    { texto: "Carlos Medina se unió al reto colectivo \"1000 km en bicicleta\"", fecha: null },
    { texto: "Ana Torres alcanzó el nivel Eco Héroe", fecha: null }
];

function obtenerFeedComunidad() {

    const real = obtenerDatosComunidad().actividad;

    // Intercalamos lo simulado con lo real del usuario, real primero (más relevante para él)

    return [...real, ...ACTIVIDAD_SIMULADA];

}

function esPrimeraVezEnComunidad() {
    return localStorage.getItem(COMUNIDAD_INTRO_KEY) !== "true";
}

function marcarIntroComunidadVista() {
    localStorage.setItem(COMUNIDAD_INTRO_KEY, "true");
}