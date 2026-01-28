// Función para abrir la invitación (sobre) y reproducir la música
function abrirInvitacion() {
    // Obtener el sobre y la invitación
    const envelope = document.getElementById('envelope');
    const invitacion = document.getElementById('invitacion');
    
    // Añadir clase para animar la apertura del sobre
    envelope.classList.add('open');

    // Mostrar la invitación después de la animación
    setTimeout(() => {
        envelope.style.display = 'none';
        invitacion.style.display = 'block';
        initMusicAutoplay();
    }, 1000); // Ajustar tiempo para esperar la animación de apertura del sobre
}

// Asignar el evento de clic al sello para abrir el sobre
document.addEventListener('DOMContentLoaded', function() {
    const seal = document.getElementById('seal');
    if (seal) {
        seal.addEventListener('click', abrirInvitacion);
    }

    // Iniciar el contador y cargar los datos del invitado al cargar la página
    iniciarContador();
    cargarDatosInvitado();
});

// Función para obtener datos de invitados (sin inputs)
// Carga datos de invitado desde invitados.json según ?id=123
async function cargarDatosInvitado() {
    const params = new URLSearchParams(window.location.search);
    const invitadoId = params.get('id');
    if (!invitadoId) {
      console.warn('ID de invitado no encontrado en el enlace.');
      return;
    }
  
    try {
      // Ajusta la ruta si tu index no está en la raíz
      const res = await fetch('invitados.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
  
      const invitados = await res.json();
      const invitado = invitados[invitadoId] || null;
  
      const nombreEl = document.getElementById('nombreInvitado');
      const pasesEl  = document.getElementById('cantidadPases');
  
      // Nombre (ocultar si no hay)
      if (invitado?.nombre && invitado.nombre.toLowerCase() !== 'sin nombre') {
        nombreEl.innerText = invitado.nombre;
        nombreEl.style.display = '';
      } else {
        nombreEl.style.display = 'none';
      }
  
      // Pases (ocultar si no hay número)
      if (Number.isFinite(invitado?.pases)) {
        pasesEl.innerText = `Pases: ${invitado.pases}`;
        pasesEl.style.display = '';
      } else {
        pasesEl.style.display = 'none';
      }
  
      // Guarda en memoria por si lo necesitas en otras funciones
      window.__invitadoActual = invitado;
    } catch (e) {
      console.error('No se pudo cargar invitados.json', e);
    }
  }
  

// Función para iniciar el contador de la fecha del evento
function iniciarContador() {
    const eventoFecha = new Date("March 07, 2026 20:00:00").getTime();

    setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = eventoFecha - ahora;

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        document.getElementById("dias").innerText = dias;
        document.getElementById("horas").innerText = horas;
        document.getElementById("minutos").innerText = minutos;
        document.getElementById("segundos").innerText = segundos;
    }, 1000);
}

// Función para abrir el lightbox solo al hacer clic en una imagen de la galería
function changePhoto(element) {
    const mainPhotoModal = document.getElementById('main-photo-modal');

    // Establecer la imagen del modal como la imagen seleccionada
    mainPhotoModal.src = element.src;

    // Mostrar el modal
    openModal();
}

// Función para mostrar el modal
function openModal() {
    const modal = document.getElementById('photo-modal');
    modal.style.display = 'flex'; // Usar 'flex' para centrar la imagen en pantalla
}

// Función para cerrar el modal
function closeModal(event) {
    // Cerrar el modal solo si el clic no fue en la imagen
    if (event.target.id === 'photo-modal' || event.target.className === 'close') {
        const modal = document.getElementById('photo-modal');
        modal.style.display = 'none';
    }
}

    // Fade-in effect cuando los elementos se hacen visibles al hacer scroll
    document.addEventListener("DOMContentLoaded", function() {
        const elementsToFade = document.querySelectorAll('.fade-in-element');

        const observerOptions = {
            threshold: 0.5, // El porcentaje del elemento que debe ser visible antes de activar la animación
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Deja de observar una vez que la animación se activa
                }
            });
        }, observerOptions);

        elementsToFade.forEach(element => {
            observer.observe(element);
        });
    });


//RSVP
/************************************************************
 * RSVP ENDPOINT CONFIG (Two Design)
 ************************************************************/

// Producción (Netlify / dominio)
const PROD_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbx8vhjrvVl0Os1zAOGKotKTvKG0QrKOZutWHpbX_KtQY9goGc2iQzVxJBTjKBvk8Az_/exec";

// Local (solo si necesitas evitar CORS en localhost)
// Si no lo necesitas, puedes dejarlo vacío ""
const LOCAL_ENDPOINT = "";

/**
 * Selección automática de endpoint
 */
const RSVP_ENDPOINT =
  (location.hostname.includes("127.0.0.1") || location.hostname.includes("localhost"))
    ? (LOCAL_ENDPOINT || PROD_ENDPOINT)
    : PROD_ENDPOINT;

/************************************************************
 * Cargar invitado desde invitados.json usando ?id=
 ************************************************************/
function getGuestIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("id");
  if (!raw) return null;
  return String(raw).trim();
}

async function loadInvitadoActual() {
  const id = getGuestIdFromUrl();
  if (!id) return null;

  const res = await fetch("invitados.json", { cache: "no-store" });
  const data = await res.json();

  const invitado = data[id];
  if (!invitado) return null;

  // Convención Two Design
  window.__invitadoActual = { id, ...invitado }; // { id, nombre, pases }
  return window.__invitadoActual;
}

/************************************************************
 * HELPERS UI
 ************************************************************/
const $ = (sel) => document.querySelector(sel);

function showMsg(el, text, type = "ok") {
  el.textContent = text;
  el.className = `rsvp-msg ${type === "ok" ? "ok" : "err"}`;
  el.style.display = "block";
}

function hideMsg(el) {
  el.style.display = "none";
  el.textContent = "";
  el.className = "rsvp-msg";
}

function openRsvpModal() {
  const backdrop = $("#rsvpBackdrop");

  backdrop.style.display = "flex";
  backdrop.setAttribute("aria-hidden", "false");

  // Pequeño delay para permitir animación
  setTimeout(() => {
    backdrop.classList.add("show");
  }, 120); // ⏱️ 120ms (natural, elegante)
}


function closeRsvpModal() {
  const backdrop = $("#rsvpBackdrop");

  backdrop.classList.remove("show");
  backdrop.setAttribute("aria-hidden", "true");

  // Espera a que termine la animación antes de ocultar
  setTimeout(() => {
    backdrop.style.display = "none";
  }, 250);
}


/************************************************************
 * API
 ************************************************************/
async function apiCheckAlreadyConfirmed(guestId) {
  if (!RSVP_ENDPOINT) return false;

  const url = `${RSVP_ENDPOINT}?guestId=${encodeURIComponent(guestId)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.alreadyConfirmed === true;
}

async function apiSendRSVP(payload) {
  if (!RSVP_ENDPOINT) {
    return { ok: false, message: "RSVP_ENDPOINT no configurado." };
  }

  // Envío compatible con Apps Script (form-urlencoded)
  const body = new URLSearchParams();
  body.set("guestId", payload.guestId);
  body.set("nombre", payload.nombre);
  body.set("pases", String(payload.pases));
  body.set("respuesta", payload.respuesta);

  const res = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: body.toString(),
  });

  return await res.json();
}

/************************************************************
 * INIT
 ************************************************************/
document.addEventListener("DOMContentLoaded", async () => {
  const invitado = await loadInvitadoActual();

  const btnConfirmar = $("#btnConfirmarRsvp");
  const msgRsvp = $("#msgRsvp");

  // Validación invitado
  if (!invitado) {
    btnConfirmar.disabled = true;
    showMsg(msgRsvp, "Invitación no válida. No se encontró el invitado.", "err");
    return;
  }

  // Precarga modal
  $("#rsvpNombre").value = invitado.nombre || "";
  $("#rsvpPases").value = String(invitado.pases ?? "");

  // Cerrar modal
  $("#btnRsvpClose").addEventListener("click", () => {
    hideMsg($("#rsvpMsgModal"));
    closeRsvpModal();
  });

  $("#rsvpBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "rsvpBackdrop") {
      hideMsg($("#rsvpMsgModal"));
      closeRsvpModal();
    }
  });

  // Verificación inicial (ya confirmó)
  try {
    const already = await apiCheckAlreadyConfirmed(invitado.id);
    if (already) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = "Confirmación enviada ✔";
      showMsg(msgRsvp, "Gracias, ya has enviado tu confirmación.", "ok");
      return;
    }
  } catch {
    showMsg(msgRsvp, "No se pudo verificar la confirmación. Intenta más tarde.", "err");
  }

  // Click Confirmar
  btnConfirmar.addEventListener("click", async () => {
    hideMsg(msgRsvp);
    hideMsg($("#rsvpMsgModal"));
  
    // 👉 Abrimos el modal CASI inmediato
    openRsvpModal();
  
    try {
      const already = await apiCheckAlreadyConfirmed(invitado.id);
  
      if (already) {
        // Si ya confirmó, mostramos mensaje y bloqueamos
        const msgModal = $("#rsvpMsgModal");
  
        showMsg(
          msgModal,
          "Gracias, ya has enviado tu confirmación.",
          "ok"
        );
  
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = "Confirmación enviada ✔";
  
        // Cerramos el modal tras breve tiempo
        setTimeout(() => closeRsvpModal(), 1500);
      }
  
      // Si NO ha confirmado, no hacemos nada:
      // los botones ya están visibles
  
    } catch (e) {
      showMsg(
        $("#rsvpMsgModal"),
        "No se pudo verificar la confirmación. Intenta nuevamente.",
        "err"
      );
    }
  });
  

// Envío RSVP (mensaje inmediato + cierre rápido)
async function confirmar(respuesta) {
  const btnSi = $("#btnRsvpSi");
  const btnNo = $("#btnRsvpNo");
  const msgModal = $("#rsvpMsgModal");

  // Mensajes finales
  const msgSi =
    "Gracias por confirmar tu asistencia y hacer este día aún más especial.";
  const msgNo =
    "Lamentamos que no puedas acompañarnos en esta ocasión, pero agradecemos tu respuesta.";

  // ✅ Feedback inmediato
  hideMsg(msgModal);
  showMsg(msgModal, respuesta === "SI" ? msgSi : msgNo, "ok");

  // ✅ Bloqueo inmediato en UI
  btnSi.disabled = true;
  btnNo.disabled = true;

  btnConfirmar.disabled = true;
  btnConfirmar.textContent = "Confirmación enviada ✔";
  showMsg(msgRsvp, "Gracias, ya has enviado tu confirmación.", "ok");

  try {
    const payload = {
      guestId: String(invitado.id),
      nombre: invitado.nombre,
      pases: Number(invitado.pases) || 1,
      respuesta, // "SI" o "NO"
    };

    const data = await apiSendRSVP(payload);

    // Si el backend dice "ya confirmado", mostramos ese mensaje y cerramos rápido
    if (data?.code === "ALREADY_CONFIRMED") {
      showMsg(msgModal, "Gracias, ya has enviado tu confirmación.", "ok");
      setTimeout(() => closeRsvpModal(), 900);
      return;
    }

    // Si backend devuelve error (poco común), avisamos y permitimos reintento
    if (!data?.ok) {
      showMsg(msgModal, data?.message || "No se pudo guardar la confirmación.", "err");

      // Re-habilitar para reintento
      btnSi.disabled = false;
      btnNo.disabled = false;

      btnConfirmar.disabled = false;
      btnConfirmar.textContent = "Confirmar";
      return;
    }

    // ✅ Si todo ok: cerramos rápido (no 5s)
    setTimeout(() => closeRsvpModal(), 800);

  } catch {
    showMsg(msgModal, "Error enviando confirmación. Intenta nuevamente.", "err");

    // Re-habilitar para reintento
    btnSi.disabled = false;
    btnNo.disabled = false;

    btnConfirmar.disabled = false;
    btnConfirmar.textContent = "Confirmar";
  }
}


  $("#btnRsvpSi").addEventListener("click", () => confirmar("SI"));
  $("#btnRsvpNo").addEventListener("click", () => confirmar("NO"));
});



  
      
//Funcion para abrir waze o maps
//iglesia
// Iglesia
function elegirAplicacion() {
  const enlaceWaze = 'https://maps.app.goo.gl/FqSRJai6oJUxN7Hx9';
  window.open(enlaceWaze, '_blank');
}

// Fiesta
function elegirAplicacionOtraDireccion() {
  const enlaceWaze = 'https://maps.app.goo.gl/h2PKqkyEWd8ahDa8A';
  window.open(enlaceWaze, '_blank');
}

document.addEventListener('DOMContentLoaded', function () {
  // Enviar mensaje
  document.getElementById('submit-wish').addEventListener('click', function () {
    const nombre = document.getElementById('wish-name').value.trim();
    const mensaje = document.getElementById('wish-message').value.trim();

    if (!nombre || !mensaje) {
      alert('Por favor, completa ambos campos.');
      return;
    }

    window.guardarDeseo(nombre, mensaje)
      .then(() => {
        alert('¡Gracias por enviar tu deseo a Daniela! 💖');
        document.getElementById('wish-name').value = '';
        document.getElementById('wish-message').value = '';
      })
      .catch((error) => {
        console.error('Error al guardar el deseo:', error);
        alert('Hubo un problema al enviar tu mensaje.');
      });
  });
});

// --- Música: autoplay al abrir, play/pause, loop, progreso ---
let musicInitialized = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function initMusicAutoplay() {
  if (musicInitialized) return;
  musicInitialized = true;

  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle");
  const icon = btn?.querySelector("i");
  const progress = document.getElementById("music-progress");
  const currentEl = document.getElementById("music-current");
  const durationEl = document.getElementById("music-duration");

  if (!audio || !btn || !progress || !currentEl || !durationEl) return;

  // Set duration when metadata loads
  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  // Update progress while playing
  audio.addEventListener("timeupdate", () => {
    currentEl.textContent = formatTime(audio.currentTime);
    if (audio.duration) {
      progress.value = String((audio.currentTime / audio.duration) * 100);
    }
  });

  // Seek
  progress.addEventListener("input", () => {
    if (!audio.duration) return;
    const pct = Number(progress.value) / 100;
    audio.currentTime = pct * audio.duration;
  });

  // Play/Pause toggle
  btn.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        if (icon) icon.className = "fas fa-pause";
        btn.setAttribute("aria-label", "Pausar música");
      } else {
        audio.pause();
        if (icon) icon.className = "fas fa-play";
        btn.setAttribute("aria-label", "Reproducir música");
      }
    } catch (e) {
      console.warn("No se pudo reproducir audio:", e);
    }
  });

  // Autoplay (como viene desde click del seal, suele funcionar)
  audio.play()
    .then(() => {
      if (icon) icon.className = "fas fa-pause";
      btn.setAttribute("aria-label", "Pausar música");
    })
    .catch((e) => {
      // Si el navegador bloquea algo, quedará listo para que el usuario presione Play
      console.warn("Autoplay bloqueado, requiere interacción extra:", e);
      if (icon) icon.className = "fas fa-play";
      btn.setAttribute("aria-label", "Reproducir música");
    });
}
function agregarAlCalendario() {
  const title = encodeURIComponent("Mis XV Stephanie Alessandra González Calito");

  // Guatemala GMT-6
  const start = "20260307T170000";
  const end   = "20260307T235900";

  const details = encodeURIComponent(
    "Te esperamos para celebrar los XV años de Stephanie Alessandra González Calito."
  );

  const location = encodeURIComponent(
    "Ciudad de Guatemala, Guatemala"
  );

  const calendarUrl =
    `https://www.google.com/calendar/render?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${start}/${end}` +
    `&details=${details}` +
    `&location=${location}` +
    `&ctz=America/Guatemala`;

  window.open(calendarUrl, "_blank");
}
// --- Galería Lightbox ---
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxImg || !closeBtn) return;

  // Abrir al hacer click en cualquier imagen de la galería
  document.querySelectorAll(".galeria-grid img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // evita scroll atrás
    });
  });

  // Cerrar (botón X)
  function cerrarLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", cerrarLightbox);

  // Cerrar clic fuera de la imagen
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) cerrarLightbox();
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      cerrarLightbox();
    }
  });
});

  
// ===== MARIPOSITAS MÁGICAS =====
(function magicButterflies(){
  const layer = document.getElementById("sparkles-layer");
  if (!layer) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) return;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function butterfly(){
    const b = document.createElement("div");
    b.className = "magic-butterfly";

    b.style.setProperty("--bf-size", `${rand(14, 26)}px`);
    b.style.setProperty("--bf-dur", `${rand(3.2, 5)}s`);

    b.style.left = `${rand(5, 95)}vw`;
    b.style.top = `${rand(60, 100)}vh`;

    layer.appendChild(b);

    setTimeout(() => b.remove(), 8000);
  }
// Aparición inicial MUY sutil
for(let i = 0; i < 12; i++){
  setTimeout(butterfly, i * 260);
}

// Flujo constante LENTO y elegante
// Oleadas: cada ciclo aparecen 3–4 mariposas
setInterval(() => {
  const burst = Math.random() < 0.5 ? 3 : 4; // 3 o 4 mariposas
  for (let i = 0; i < burst; i++) {
    setTimeout(butterfly, i * 180); // espacito para que no salgan pegadas
  }
}, 3200);
})();
