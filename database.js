// database.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// ✅ TU CONFIG NUEVA
const firebaseConfig = {
  apiKey: "AIzaSyDY0yp1f338AH1AJJ730-RnxUHHgJv0ZQE",
  authDomain: "buenos-deseos-nathalieycarlos.firebaseapp.com",
  databaseURL: "https://buenos-deseos-nathalieycarlos-default-rtdb.firebaseio.com",
  projectId: "buenos-deseos-nathalieycarlos",
  storageBucket: "buenos-deseos-nathalieycarlos.firebasestorage.app",
  messagingSenderId: "521381757208",
  appId: "1:521381757208:web:d721d41283fc88e722de6d",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// -----------------------------
// 1) Guardar deseo (global)
// -----------------------------
window.guardarDeseo = function (nombre, mensaje) {
  return push(ref(db, "buenos-deseos/"), {
    nombre,
    mensaje,
    timestamp: new Date().toISOString(),
  });
};

// -----------------------------
// 2) Leer / Ocultar deseos (global)
// -----------------------------
window.toggleWishes = function () {
  const wishesDiv = document.getElementById("wishes-container");
  const btn = document.getElementById("toggle-wishes-btn");

  if (!wishesDiv) return;

  // Si está visible → ocultar
  if (wishesDiv.classList.contains("visible")) {
    wishesDiv.classList.remove("visible");
    wishesDiv.classList.add("hidden");
    if (btn) btn.textContent = "Leer buenos deseos";
    return;
  }

  // Si ya cargó antes, solo mostrar
  if (wishesDiv.dataset.loaded === "true") {
    wishesDiv.classList.remove("hidden");
    wishesDiv.classList.add("visible");
    if (btn) btn.textContent = "Ocultar buenos deseos";
    return;
  }

  // Primera carga: escuchar Firebase y renderizar lista
  onValue(ref(db, "buenos-deseos/"), (snapshot) => {
    const render = () => {
      wishesDiv.innerHTML = "";

      // Guardamos en array para ordenar por más reciente
      const list = [];
      snapshot.forEach((childSnapshot) => {
        list.push(childSnapshot.val());
      });

      // Orden: más nuevo → más viejo (si hay timestamp)
      list.sort((a, b) => {
        const ta = new Date(a.timestamp || 0).getTime();
        const tb = new Date(b.timestamp || 0).getTime();
        return tb - ta;
      });

      // Pintar en HTML
      list.forEach((wish) => {
        const wishElement = document.createElement("p");
        wishElement.innerHTML = `<strong>${wish.nombre}:</strong> ${wish.mensaje}`;
        wishesDiv.appendChild(wishElement);
      });

      wishesDiv.dataset.loaded = "true";
      wishesDiv.classList.remove("hidden");
      wishesDiv.classList.add("visible");
      if (btn) btn.textContent = "Ocultar buenos deseos";
    };

    // requestIdleCallback (con fallback)
    if ("requestIdleCallback" in window) {
      requestIdleCallback(render);
    } else {
      setTimeout(render, 0);
    }
  });
};
