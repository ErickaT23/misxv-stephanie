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

// Link directo (puede ser el corto o el largo)
// ===== RSVP: Google Forms por cantidad de pases + prellenado =====

// Entries (según tu ejemplo)
const GF_ENTRY_NOMBRE = "entry.1297710131";

// OJO: este entry de "pases" lo usaré para 2–4.
// Si en alguno cambia, me mandas 1 link prellenado de ese form y lo ajusto.
const GF_ENTRY_PASES = "entry.2016105650";

// Links por pases (los tuyos)
const GF_FORMS_BY_PASES = {
  4: "https://docs.google.com/forms/d/e/1FAIpQLSdp8KgXI6UHHrjGGlTQ_jLQxvxEl_U1MjeUNjXDKnCXOG3_dw/viewform?usp=dialog",
  3: "https://docs.google.com/forms/d/e/1FAIpQLSdRfwy5IN985d3tE0TrBjmiCUrkDyX9kUSfibu1T7vdxSloqg/viewform?usp=dialog",
  2: "https://docs.google.com/forms/d/e/1FAIpQLSdv7Dd2_bcTU0-szvszKq1l7GOB5E5Sn1_90dQkH8tpQtxt9A/viewform?usp=dialog",
  1: "https://docs.google.com/forms/d/e/1FAIpQLScGmoYGsXDcgiEd9ckIt__ywFH0tRPeYcrx2M8-EMNSp5kSHw/viewform?usp=pp_url"
};

// Helper: convertir dialog → pp_url (más estable para prefill)
function normalizeFormUrl(url) {
  if (!url) return url;
  return url.replace("usp=dialog", "usp=pp_url");
}

function confirmarAsistencia() {
  const invitado = window.__invitadoActual || {};
  const nombre = (invitado.nombre || "").trim();
  const pases = Number.isFinite(invitado.pases) ? invitado.pases : 1;

  // Si no hay nombre (por ejemplo id inexistente), abre el form de 1 pase sin prefill
  const baseRaw = GF_FORMS_BY_PASES[pases] || GF_FORMS_BY_PASES[1];
  const base = normalizeFormUrl(baseRaw);

  const params = new URLSearchParams();

  // Prefill: nombre (si existe)
  if (nombre) params.set(GF_ENTRY_NOMBRE, nombre);

  // Prefill: pases solo para 2–4 (porque tu form de 1 pase no lo trae en el ejemplo)
  if (pases >= 2 && pases <= 4) {
    params.set(GF_ENTRY_PASES, String(pases));
  }

  const urlFinal = params.toString()
    ? `${base}&${params.toString()}`
    : base;

  window.open(urlFinal, "_blank", "noopener");
}



  
      
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
    b.style.setProperty("--bf-dur", `${rand(4.5, 7)}s`);

    b.style.left = `${rand(5, 95)}vw`;
    b.style.top = `${rand(60, 100)}vh`;

    layer.appendChild(b);

    setTimeout(() => b.remove(), 8000);
  }
// Aparición inicial MUY sutil
for(let i = 0; i < 4; i++){
  setTimeout(butterfly, i * 600);
}

// Flujo constante LENTO y elegante
setInterval(() => {
  butterfly();
}, 3000);

// Oleadas MÍNIMAS al hacer scroll
let ticking = false;
window.addEventListener("scroll", () => {
  if(ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    butterfly();
    ticking = false;
  });
});
})();
