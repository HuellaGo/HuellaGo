/* ============================================================
   PERFIL.JS
   Logica simulada (sin backend) para:
   - mi-perfil.html   (HU45 vista, HU49 logout)
   - editar-perfil.html (HU45 edicion)
   - ajustes.html     (HU47 notificaciones, HU48 privacidad)
   Todo se guarda en localStorage bajo la key STORAGE_KEY.
   ============================================================ */

const STORAGE_KEY = "huellago_profile";

const DEFAULT_PROFILE = {
    nombre: "Mateo",
    apellido: "Pérez",
    fechaNacimiento: "1998-05-12",
    ubicacion: "Lima, Perú",
    intereses: ["reciclaje", "movilidad"],
    correo: "mateo@gmail.com",
    nivelNombre: "Eco Iniciado",
    nivel: 1,
    ecoPuntos: 1250,
    huellaActual: 2.45,
    notificaciones: true,
    privacidad: "publico",
    idioma: "es",
    tema: "claro",
    unidades: "metric"
};

/* ---------- Helpers de almacenamiento ---------- */

function getProfile() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
            return { ...DEFAULT_PROFILE };
        }
        return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch (e) {
        console.error("Error leyendo perfil:", e);
        return { ...DEFAULT_PROFILE };
    }
}

function saveProfile(partial) {
    try {
        const current = getProfile();
        const updated = { ...current, ...partial };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error("Error guardando perfil:", e);
        showToast("No se pudo guardar. Intenta nuevamente.", true);
        return null;
    }
}

/* ---------- Toast ---------- */

function showToast(message, isError) {
    let toast = document.getElementById("appToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "appToast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle("error", !!isError);
    toast.classList.add("visible");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove("visible"), 2600);
}

/* ---------- Logout (HU49) ---------- */

function handleLogout() {
    try {
        localStorage.removeItem("huellago_session");
        window.location.href = "login.html";
    } catch (e) {
        showToast("Ocurrió un error al cerrar sesión. Intenta de nuevo.", true);
    }
}

/* ============================================================
   MI-PERFIL.HTML
   ============================================================ */

function initMiPerfil() {
    const profile = getProfile();

    const nameEl = document.getElementById("profileName");
    const subtitleEl = document.getElementById("profileSubtitle");
    const ecoPuntosEl = document.getElementById("profileEcoPuntos");
    const huellaEl = document.getElementById("profileHuella");

    if (nameEl) nameEl.textContent = `${profile.nombre} ${profile.apellido}`;
    if (subtitleEl) {
        subtitleEl.innerHTML = `${profile.nivelNombre} | <span class="level-highlight">nivel ${profile.nivel}</span>`;
    }
    if (ecoPuntosEl) ecoPuntosEl.textContent = profile.ecoPuntos;
    if (huellaEl) huellaEl.textContent = `${profile.huellaActual} t CO2e`;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

    // El hamburger no abre un sidebar aca (esta vista es standalone por diseño).
    // Lo mandamos de vuelta al dashboard. Cambia el destino si prefieres otra cosa.
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }

    const ayudaBtn = document.getElementById("ayudaSoporteBtn");
    if (ayudaBtn) {
        ayudaBtn.addEventListener("click", () => {
            showToast("Ayuda y soporte: próximamente disponible.");
        });
    }
}

/* ============================================================
   EDITAR-PERFIL.HTML
   ============================================================ */

function initEditarPerfil() {
    const profile = getProfile();

    const nombreInput = document.getElementById("inputNombre");
    const apellidoInput = document.getElementById("inputApellido");
    const fechaInput = document.getElementById("inputFecha");
    const ubicacionInput = document.getElementById("inputUbicacion");

    if (nombreInput) nombreInput.value = profile.nombre;
    if (apellidoInput) apellidoInput.value = profile.apellido;
    if (fechaInput) fechaInput.value = profile.fechaNacimiento;
    if (ubicacionInput) ubicacionInput.value = profile.ubicacion;

    // Chips de intereses
    const chips = document.querySelectorAll(".chip[data-interest]");
    chips.forEach((chip) => {
        const key = chip.getAttribute("data-interest");
        chip.classList.toggle("active", profile.intereses.includes(key));
        chip.addEventListener("click", () => {
            chip.classList.toggle("active");
        });
    });

    const form = document.getElementById("editarPerfilForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateEditarPerfilForm()) {
                const selectedInterests = Array.from(
                    document.querySelectorAll(".chip.active[data-interest]")
                ).map((c) => c.getAttribute("data-interest"));

                saveProfile({
                    nombre: nombreInput.value.trim(),
                    apellido: apellidoInput.value.trim(),
                    fechaNacimiento: fechaInput.value,
                    ubicacion: ubicacionInput.value.trim(),
                    intereses: selectedInterests
                });

                document.getElementById("editForm").style.display = "none";
                document.getElementById("confirmationView").classList.add("visible");
            }
        });
    }
}

function validateEditarPerfilForm() {
    let valid = true;

    valid = validateRequiredField("inputNombre", "Ingresa tu nombre.") && valid;
    valid = validateRequiredField("inputApellido", "Ingresa tu apellido.") && valid;
    valid = validateRequiredField("inputUbicacion", "Ingresa tu ubicación.") && valid;

    const fechaInput = document.getElementById("inputFecha");
    const fechaGroup = fechaInput.closest(".form-group");
    if (!fechaInput.value) {
        fechaGroup.classList.add("has-error");
        valid = false;
    } else {
        const fecha = new Date(fechaInput.value);
        const hoy = new Date();
        if (fecha > hoy) {
            fechaGroup.classList.add("has-error");
            fechaGroup.querySelector(".field-error").textContent =
                "La fecha no puede ser futura.";
            valid = false;
        } else {
            fechaGroup.classList.remove("has-error");
        }
    }

    return valid;
}

function validateRequiredField(inputId, message) {
    const input = document.getElementById(inputId);
    const group = input.closest(".form-group");
    if (!input.value.trim()) {
        group.classList.add("has-error");
        const errorEl = group.querySelector(".field-error");
        if (errorEl) errorEl.textContent = message;
        return false;
    }
    group.classList.remove("has-error");
    return true;
}

/* ============================================================
   AJUSTES.HTML
   ============================================================ */

const IDIOMA_OPTIONS = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" }
];

const TEMA_OPTIONS = [
    { value: "claro", label: "Claro" },
    { value: "oscuro", label: "Oscuro" }
];

const UNIDADES_OPTIONS = [
    { value: "metric", label: "km/h, kg" },
    { value: "imperial", label: "mph, lb" }
];

const PRIVACIDAD_OPTIONS = [
    { value: "publico", label: "Público", desc: "Tu perfil y ranking son visibles para todos." },
    { value: "amigos", label: "Solo amigos", desc: "Solo tus contactos ven tu actividad." },
    { value: "privado", label: "Privado", desc: "No apareces en el ranking público." }
];

function initAjustes() {
    const profile = getProfile();

    document.getElementById("correoValue").textContent = profile.correo;
    document.getElementById("idiomaValue").textContent =
        IDIOMA_OPTIONS.find((o) => o.value === profile.idioma).label;
    document.getElementById("temaValue").textContent =
        TEMA_OPTIONS.find((o) => o.value === profile.tema).label;
    document.getElementById("unidadesValue").textContent =
        UNIDADES_OPTIONS.find((o) => o.value === profile.unidades).label;
    document.getElementById("notifStatusText").textContent = profile.notificaciones
        ? "Activadas"
        : "Desactivadas";

    const notifToggle = document.getElementById("notifToggle");
    notifToggle.checked = profile.notificaciones;
    notifToggle.addEventListener("change", () => {
        const updated = saveProfile({ notificaciones: notifToggle.checked });
        if (updated) {
            document.getElementById("notifStatusText").textContent = updated.notificaciones
                ? "Activadas"
                : "Desactivadas";
            showToast(
                updated.notificaciones
                    ? "Notificaciones activadas."
                    : "Notificaciones desactivadas."
            );
        }
    });

    document.getElementById("editarInfoRow").addEventListener("click", () => {
        window.location.href = "editar-perfil.html";
    });

    document.getElementById("privacidadRow").addEventListener("click", () => {
        openSelectModal({
            title: "Privacidad",
            options: PRIVACIDAD_OPTIONS,
            currentValue: getProfile().privacidad,
            onSelect: (value) => {
                saveProfile({ privacidad: value });
                showToast("Configuración de privacidad guardada.");
            }
        });
    });

    document.getElementById("idiomaRow").addEventListener("click", () => {
        openSelectModal({
            title: "Idioma",
            options: IDIOMA_OPTIONS,
            currentValue: getProfile().idioma,
            onSelect: (value) => {
                saveProfile({ idioma: value });
                document.getElementById("idiomaValue").textContent =
                    IDIOMA_OPTIONS.find((o) => o.value === value).label;
                showToast("Idioma actualizado.");
            }
        });
    });

    document.getElementById("temaRow").addEventListener("click", () => {
        openSelectModal({
            title: "Tema",
            options: TEMA_OPTIONS,
            currentValue: getProfile().tema,
            onSelect: (value) => {
                saveProfile({ tema: value });
                document.getElementById("temaValue").textContent =
                    TEMA_OPTIONS.find((o) => o.value === value).label;
                showToast("Tema actualizado.");
            }
        });
    });

    document.getElementById("unidadesRow").addEventListener("click", () => {
        openSelectModal({
            title: "Unidades de medida",
            options: UNIDADES_OPTIONS,
            currentValue: getProfile().unidades,
            onSelect: (value) => {
                saveProfile({ unidades: value });
                document.getElementById("unidadesValue").textContent =
                    UNIDADES_OPTIONS.find((o) => o.value === value).label;
                showToast("Unidades actualizadas.");
            }
        });
    });

    document.getElementById("cambiarPasswordRow").addEventListener("click", openPasswordModal);
    document.getElementById("eliminarCuentaRow").addEventListener("click", openDeleteAccountModal);
    document.getElementById("correoRow").addEventListener("click", openEmailModal);

    document.getElementById("modalOverlay").addEventListener("click", (e) => {
        if (e.target.id === "modalOverlay") closeModal();
    });
}

function getModalRoot() {
    return document.getElementById("modalOverlay");
}

function closeModal() {
    const overlay = getModalRoot();
    overlay.classList.remove("visible");
    overlay.innerHTML = "";
}

function openSelectModal({ title, options, currentValue, onSelect }) {
    const overlay = getModalRoot();
    const optionsHtml = options
        .map(
            (opt) => `
        <div class="modal-option ${opt.value === currentValue ? "selected" : ""}" data-value="${opt.value}">
            <div>
                <div>${opt.label}</div>
                ${opt.desc ? `<div style="font-size:12px;color:var(--color-text-light);margin-top:2px;">${opt.desc}</div>` : ""}
            </div>
            <span class="radio-dot"></span>
        </div>`
        )
        .join("");

    overlay.innerHTML = `
        <div class="modal-sheet">
            <h3>${title}</h3>
            ${optionsHtml}
        </div>`;
    overlay.classList.add("visible");

    overlay.querySelectorAll(".modal-option").forEach((el) => {
        el.addEventListener("click", () => {
            onSelect(el.getAttribute("data-value"));
            closeModal();
        });
    });
}

function openPasswordModal() {
    const overlay = getModalRoot();
    overlay.innerHTML = `
        <div class="modal-sheet">
            <h3>Cambiar contraseña</h3>
            <div class="modal-field">
                <input type="password" id="pwCurrent" placeholder="Contraseña actual">
            </div>
            <div class="modal-field">
                <input type="password" id="pwNew" placeholder="Nueva contraseña">
            </div>
            <div class="modal-field">
                <input type="password" id="pwConfirm" placeholder="Confirmar nueva contraseña">
            </div>
            <div class="field-error-modal" id="pwError">Las contraseñas deben coincidir y tener al menos 6 caracteres.</div>
            <div class="modal-actions">
                <button class="modal-btn secondary" id="pwCancel">Cancelar</button>
                <button class="modal-btn primary" id="pwSave">Guardar</button>
            </div>
        </div>`;
    overlay.classList.add("visible");

    document.getElementById("pwCancel").addEventListener("click", closeModal);
    document.getElementById("pwSave").addEventListener("click", () => {
        const current = document.getElementById("pwCurrent").value;
        const nueva = document.getElementById("pwNew").value;
        const confirm = document.getElementById("pwConfirm").value;
        const error = document.getElementById("pwError");

        if (!current || nueva.length < 6 || nueva !== confirm) {
            error.classList.add("visible");
            return;
        }
        closeModal();
        showToast("Contraseña actualizada correctamente.");
    });
}

function openEmailModal() {
    const overlay = getModalRoot();
    const profile = getProfile();
    overlay.innerHTML = `
        <div class="modal-sheet">
            <h3>Correo electrónico</h3>
            <div class="modal-field">
                <input type="email" id="emailInput" value="${profile.correo}">
            </div>
            <div class="field-error-modal" id="emailError">Ingresa un correo válido.</div>
            <div class="modal-actions">
                <button class="modal-btn secondary" id="emailCancel">Cancelar</button>
                <button class="modal-btn primary" id="emailSave">Guardar</button>
            </div>
        </div>`;
    overlay.classList.add("visible");

    document.getElementById("emailCancel").addEventListener("click", closeModal);
    document.getElementById("emailSave").addEventListener("click", () => {
        const value = document.getElementById("emailInput").value.trim();
        const error = document.getElementById("emailError");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            error.classList.add("visible");
            return;
        }
        saveProfile({ correo: value });
        document.getElementById("correoValue").textContent = value;
        closeModal();
        showToast("Correo actualizado.");
    });
}

function openDeleteAccountModal() {
    const overlay = getModalRoot();
    overlay.innerHTML = `
        <div class="modal-sheet">
            <h3>Eliminar cuenta</h3>
            <p style="font-size:13px;color:var(--color-text-light);margin:0 0 18px;">
                Esta acción es permanente. Se borrarán tus datos, EcoPuntos e historial. ¿Deseas continuar?
            </p>
            <div class="modal-actions">
                <button class="modal-btn secondary" id="deleteCancel">Cancelar</button>
                <button class="modal-btn danger" id="deleteConfirm">Eliminar cuenta</button>
            </div>
        </div>`;
    overlay.classList.add("visible");

    document.getElementById("deleteCancel").addEventListener("click", closeModal);
    document.getElementById("deleteConfirm").addEventListener("click", () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem("huellago_session");
            window.location.href = "login.html";
        } catch (e) {
            showToast("No se pudo eliminar la cuenta. Intenta de nuevo.", true);
        }
    });
}

/* ---------- Bootstrap por pagina ---------- */

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "mi-perfil") initMiPerfil();
    if (document.body.dataset.page === "editar-perfil") initEditarPerfil();
    if (document.body.dataset.page === "ajustes") initAjustes();
});