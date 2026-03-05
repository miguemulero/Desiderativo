import { WORKER_URL, GEMINI_MODEL, WORKER_TOKEN_STORAGE_KEY } from "./app-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const formEl = document.getElementById("desiderativo-form");
  const positivasContainer = document.getElementById("positivas-container");
  const negativasContainer = document.getElementById("negativas-container");
  const statusText = document.getElementById("statusText");
  const spinner = document.getElementById("spinner");
  const analizarBtn = document.getElementById("analizar");
  const resultSection = document.getElementById("result-section");
  const resultText = document.getElementById("result-text");
  const guardarImprimirBtn = document.getElementById("guardar-imprimir");

  function setStatus(text) {
    statusText.textContent = text || "";
  }

  function setBusy(isBusy) {
    spinner.hidden = !isBusy;
    analizarBtn.disabled = isBusy;
    setStatus(isBusy ? "Analizando..." : "");
  }

  // Autoajuste del textarea del informe (sin cambiar funcionamiento)
  function autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight + 6) + "px";
  }

  function showResult(reportText) {
    resultText.value = processText(reportText);
    autoResizeTextarea(resultText);
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function hideResult() {
    resultText.value = "";
    autoResizeTextarea(resultText);
    resultSection.style.display = "none";
  }

  function ensureAccessToken() {
    let token = localStorage.getItem(WORKER_TOKEN_STORAGE_KEY) || "";
    if (token) return token;

    token = (window.prompt("Introduce el ACCESS TOKEN del Worker:", "") || "").trim();
    if (token) localStorage.setItem(WORKER_TOKEN_STORAGE_KEY, token);
    return token;
  }

  async function callGeminiViaWorker(prompt) {
    const token = ensureAccessToken();
    if (!token) throw new Error("Falta ACCESS TOKEN del Worker.");

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token
      },
      body: JSON.stringify({ model: GEMINI_MODEL, prompt })
    });

    const data = await res.json().catch(async () => {
      const t = await res.text();
      throw new Error(`Respuesta no-JSON del Worker (${res.status}): ${t}`);
    });

    if (!res.ok) throw new Error(data?.error || `Error Worker (${res.status})`);
    if (!data?.text) throw new Error("Worker no devolvió 'text'");
    return data.text;
  }

  // ====== CATEXIAS (estructura completa v2) ======
  function createCatexiaFija(num, simbolo = "", tr = 0, justificacion = "", observaciones = "") {
    const div = document.createElement("div");
    div.className = "catexia-item";

    const uniqueId = `cambio-${num}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    div.innerHTML = `
      <div class="catexia-header">Catexia ${num}</div>

      <div class="catexia-main">
        <input class="simbolo" type="text" placeholder="Símbolo" value="${escapeAttr(simbolo)}"/>
        <input class="tr" type="number" placeholder="TR (seg)" value="${Number(tr) || 0}" min="0" step="0.01"/>
      </div>

      <div class="catexia-texts">
        <div class="field">
          <label>Justificación</label>
          <textarea class="justificacion" placeholder="Razón del símbolo...">${escapeText(justificacion)}</textarea>
        </div>

        <div class="field">
          <label>Observaciones</label>
          <textarea class="observaciones" placeholder="Notas adicionales...">${escapeText(observaciones)}</textarea>
        </div>
      </div>

      <div class="checkbox-row">
        <input type="checkbox" class="cambio-check" id="${uniqueId}">
        <label for="${uniqueId}">Cambio</label>
      </div>

      <button type="button" class="add-btn" style="display:none;">+ Añadir respuesta</button>
      <div class="extras-container"></div>
    `;

    const checkbox = div.querySelector(".cambio-check");
    const addBtn = div.querySelector(".add-btn");
    const extrasContainer = div.querySelector(".extras-container");

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        addBtn.style.display = "block";
      } else {
        addBtn.style.display = "none";
        extrasContainer.innerHTML = "";
      }
    });

    addBtn.addEventListener("click", () => {
      const extra = document.createElement("div");
      extra.className = "extra-response";
      extra.innerHTML = `
        <input type="text" placeholder="Símbolo" class="extra-simbolo"/>
        <input type="number" placeholder="TR (seg)" class="extra-tr" min="0" step="0.01"/>
        <button type="button" class="remove-btn btn btn-danger">×</button>
      `;
      extra.querySelector(".remove-btn").addEventListener("click", () => extra.remove());
      extrasContainer.appendChild(extra);
    });

    return div;
  }

  function readCatexias(container) {
    const items = Array.from(container.querySelectorAll(".catexia-item"));
    return items.map((item) => {
      const simbolo = item.querySelector(".simbolo")?.value?.trim() || "";
      const tr = Number(item.querySelector(".tr")?.value || 0);
      const justificacion = item.querySelector(".justificacion")?.value?.trim() || "";
      const observaciones = item.querySelector(".observaciones")?.value?.trim() || "";

      const extras = Array.from(item.querySelectorAll(".extra-response")).map((ex) => ({
        simbolo: ex.querySelector(".extra-simbolo")?.value?.trim() || "",
        tr: Number(ex.querySelector(".extra-tr")?.value || 0)
      }));

      return { simbolo, tr, justificacion, observaciones, extras };
    });
  }

  // ====== PRECARGA ACR ======
  function preloadACR() {
    document.getElementById("nombre").value = "protocolo ACR";
    document.getElementById("edad").value = "11";
    document.getElementById("genero").value = "masculino";
    document.getElementById("nivel_educativo").value = "primario";
    document.getElementById("fecha").value = "2026-01-20";
    document.getElementById("modalidad").value = "estandar";
    document.getElementById("informacion").value =
      "padres separados con custodia compartida y alto nivel de conflicto. Tiene dos hermanos mayores que él y otro mellizo.";
    document.getElementById("recuerdo").value =
      "navidades abriendo regalos con la familia";
  }

  function initCatexiasPrecargadasACR() {
    positivasContainer.innerHTML = "";
    negativasContainer.innerHTML = "";

    positivasContainer.appendChild(createCatexiaFija(
      1, "AGAPORNI", 3,
      "porque puede volar, estar en el suelo, ir donde quiera... lo puede adoptar una familia", ""
    ));
    positivasContainer.appendChild(createCatexiaFija(
      2, "GIRASOL", 6,
      "porque le doy pipas a la gente, a veces gratis, a veces no", ""
    ));
    positivasContainer.appendChild(createCatexiaFija(
      3, "CARNE", 10,
      "porque estaría buena y disfrutarían comiendo", ""
    ));

    negativasContainer.appendChild(createCatexiaFija(
      1, "MAPACHE", 1,
      "porque huelen mal, me pueden tirar a la basura y matar", ""
    ));
    negativasContainer.appendChild(createCatexiaFija(
      2, "UN ORDENADOR", 4,
      "porque me usarían y cuando se acabe la batería no podría respirar", ""
    ));
    negativasContainer.appendChild(createCatexiaFija(
      3, "UNA ROSA", 10,
      "porque me arrancarían, me quitarían las espinas y tendría mucho dolor", ""
    ));
  }

  // ====== PROMPT / VALIDACIÓN / FORMATEO ======
  function validateForm(protocolo) {
    if (!protocolo.nombre) return "Completa el campo Nombre/ID del protocolo.";
    if (!protocolo.edad || protocolo.edad < 4 || protocolo.edad > 100) return "La edad debe estar entre 4 y 100 años.";
    if (!protocolo.fecha) return "Selecciona una fecha.";
    return null;
  }

  function buildPrompt(p) {
    // Tabla completa con TODA la info del formulario + catexias + cambios + observaciones
    const tableRow = (sign, idx, cat) => {
      const extrasText =
        (cat.extras && cat.extras.length > 0)
          ? cat.extras
              .map((ex, i) => `${i + 1}) ${ex.simbolo || "-"} (TR: ${Number(ex.tr || 0)}s)`)
              .join(" | ")
          : "—";

      return [
        `${sign}${idx + 1}`,
        `Símbolo: ${cat.simbolo || "-"}`,
        `TR(s): ${Number(cat.tr || 0)}`,
        `Justificación: ${cat.justificacion || "-"}`,
        `Observaciones: ${cat.observaciones || "-"}`,
        `Cambios: ${extrasText}`
      ].join(" | ");
    };

    const posRows = p.positivas.map((c, i) => tableRow("+", i, c)).join("\n");
    const negRows = p.negativas.map((c, i) => tableRow("-", i, c)).join("\n");

    const resumen = [
      `Nombre/ID: ${p.nombre || "-"}`,
      `Edad: ${p.edad || "-"}`,
      `Sexo: ${p.genero || "-"}`,
      `Nivel educativo: ${p.nivel_educativo || "-"}`,
      `Fecha: ${p.fecha || "-"}`,
      `Modalidad: ${p.modalidad || "-"}`,
      "",
      "Información relevante:",
      p.informacion || "-",
      "",
      "Asociaciones espontáneas:",
      p.asociaciones || "-",
      "",
      "Recuerdo positivo:",
      p.recuerdo || "-"
    ].join("\n");

    const miniTabla = [
      "MINI TABLA RESUMEN (con clasificación de reinos a inferir por el analista):",
      "",
      "CATÉXIAS POSITIVAS (+):",
      posRows || "(sin datos)",
      "",
      "CATÉXIAS NEGATIVAS (-):",
      negRows || "(sin datos)"
    ].join("\n");

    // Instrucciones: esquema fijo, párrafos, ADL completo, reinos, VIII preguntas y respuestas.
    return `Redacta un INFORME CLÍNICO INTEGRAL del Cuestionario Desiderativo siguiendo ESTRICTAMENTE el esquema I–VIII que se indica abajo. Debes CONECTAR y ARTICULAR: (1) los datos del evaluado, (2) la información relevante, (3) las catexias positivas/negativas, (4) los TR, (5) las justificaciones, (6) las observaciones y (7) los cambios (si los hay). No inventes datos no presentes. Cuando infieras algo, indícalo como inferencia clínica.

FORMATO OBLIGATORIO:
- Empieza DIRECTAMENTE con **MINI TABLA RESUMEN** (en texto plano).
- Luego escribe los apartados **I** a **VIII** en este orden.
- Cada apartado debe llevar su título EXACTO en **negrita**.
- Dentro de cada apartado redacta en PÁRRAFOS separados (no listas largas).
- Debes clasificar tú mismo el REINO de cada símbolo (Animal/Vegetal/Objeto u “Otro/Indeterminado”) y usarlo en los apartados donde corresponda.
- Interpreta el nivel PARAVERBAL del ADL usando: (a) TR y (b) lo escrito en “Observaciones” (pausas, dudas, correcciones, titubeos, etc. si están consignadas).
- Mantén el lenguaje profesional y clínico. No hagas “diagnóstico médico definitivo”.
- Finaliza con un apartado **DISCLAIMER** (en negrita) y luego, en una nueva línea, escribe exactamente: FIN DEL INFORME.

ESQUEMA OBLIGATORIO (títulos exactos):
**I. Encuadre e Implementación**
**II. Mecanismos instrumentales**
**III. Manejo y Tipos de Ansiedad**
**IV. Secuencia de Reinos y Fantasías de Muerte**
**V. Análisis Estructural (Ello, Yo y Superyó)**
**VI. Perspectiva ADL (Algoritmo David Liberman)**
**VII. Hipótesis Diagnóstica y Pronóstico**
**VIII. Cuestiones relevantes**

PAUTAS CLÍNICAS ESPECÍFICAS:
- En III (TR): analiza shocks por acortamiento (<10s) y alargamiento (>30s), y describe la cualidad probable de la ansiedad (persecutoria/depresiva) según el contenido.
- En IV: analiza el orden esperable de reinos (positivas: Animal > Vegetal > Objeto; negativas: inverso) y qué implica si se altera.
- En VI (ADL): incluye Niveles (paraverbal, actos del habla, relatos/escenas), Deseos (erogeneidades) y Defensas + estado (exitosa/fracasada/inhibida/sublimatoria), apoyándote en el material verbal del protocolo.
- En VII: plantea hipótesis (compatibilidad) entre estructura neurótica / psicótica / perversa DESCRIBIENDO INDICADORES. Si concluyes mayor compatibilidad con “neurótica”, añade si es más compatible con una organización obsesiva o hist��rica y por qué (indicadores).
- En VIII: genera ENTRE 10 y 25 cuestiones relevantes PERSONALIZADAS (no genéricas) como preguntas clínicas profundas derivadas del material. Formato obligatorio:
  1) Pregunta…
  (Párrafo de respuesta)
  2) Pregunta…
  (Párrafo de respuesta)
  etc.

${miniTabla}

DATOS Y CONTEXTO:
${resumen}

**DISCLAIMER**
Los resultados aquí expuestos no deben considerarse bajo ningún concepto como un diagnóstico médico definitivo de forma aislada y deben ser supervisados por un profesional
FIN DEL INFORME`;
  }

  function processText(rawText) {
    let processed = String(rawText || "");

    // Si el modelo incluyera cosas antes de la mini tabla, recortamos a ella.
    const startIndex = processed.search(/MINI\s+TABLA\s+RESUMEN/i);
    if (startIndex > 0) processed = processed.substring(startIndex);

    // Mantener recorte por FIN DEL INFORME si aparece
    const finIndex = processed.search(/FIN DEL INFORME/i);
    if (finIndex > -1) processed = processed.substring(0, finIndex);

    processed = processed.trim();
    return processed;
  }

  function escapeAttr(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function escapeText(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // ===== INIT =====
  preloadACR();
  initCatexiasPrecargadasACR();
  autoResizeTextarea(resultText);

  // ===== EVENTOS =====
  analizarBtn.addEventListener("click", async () => {
    const protocolo = {
      nombre: document.getElementById("nombre").value.trim(),
      edad: Number(document.getElementById("edad").value),
      genero: document.getElementById("genero").value,
      nivel_educativo: document.getElementById("nivel_educativo").value,
      fecha: document.getElementById("fecha").value,
      modalidad: document.getElementById("modalidad").value,
      informacion: document.getElementById("informacion").value.trim(),
      positivas: readCatexias(positivasContainer),
      negativas: readCatexias(negativasContainer),
      asociaciones: document.getElementById("asociaciones").value.trim(),
      recuerdo: document.getElementById("recuerdo").value.trim()
    };

    const validationError = validateForm(protocolo);
    if (validationError) return alert(validationError);

    const prompt = buildPrompt(protocolo);

    setBusy(true);
    hideResult();

    try {
      const reportText = await callGeminiViaWorker(prompt);
      showResult(reportText);
    } catch (e) {
      alert(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  });

  document.getElementById("limpiar").addEventListener("click", () => {
    formEl.reset();
    preloadACR();
    initCatexiasPrecargadasACR();
    hideResult();
    setStatus("");
  });

  guardarImprimirBtn.addEventListener("click", () => window.print());

  window.addEventListener("resize", () => autoResizeTextarea(resultText));
});
