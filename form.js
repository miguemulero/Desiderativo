import { WORKER_URL, GEMINI_MODEL, WORKER_TOKEN_STORAGE_KEY } from "./app-config.js";

// Bibliografía YA RESUELTA (de tu uploaded_files.json)
const BIBLIOGRAFIA_RESOLVED = [
  { fileId: "files/t549z7ht66rm", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/t549z7ht66rm", mimeType: "application/pdf" },
  { fileId: "files/gz8k0126y7a6", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/gz8k0126y7a6", mimeType: "application/pdf" },
  { fileId: "files/6dz48r8mndei", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/6dz48r8mndei", mimeType: "application/pdf" },
  { fileId: "files/nba7pztpxuk8", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/nba7pztpxuk8", mimeType: "application/pdf" },
  { fileId: "files/p8shplqsvq1t", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/p8shplqsvq1t", mimeType: "application/pdf" },
  { fileId: "files/rdfk0g1urj0r", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/rdfk0g1urj0r", mimeType: "application/pdf" },
  { fileId: "files/liz8ph5ykm35", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/liz8ph5ykm35", mimeType: "application/pdf" },
  { fileId: "files/ypdqo00ppn1r", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/ypdqo00ppn1r", mimeType: "application/pdf" },
  { fileId: "files/72lrsd488auc", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/72lrsd488auc", mimeType: "application/pdf" },
  { fileId: "files/9hvqjysd8kxb", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/9hvqjysd8kxb", mimeType: "application/pdf" },
  { fileId: "files/mp0wuzb0evk5", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/mp0wuzb0evk5", mimeType: "application/pdf" },
  { fileId: "files/nhv9ph457tqb", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/nhv9ph457tqb", mimeType: "application/pdf" },
  { fileId: "files/z1uoz10z6ko1", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/z1uoz10z6ko1", mimeType: "application/pdf" },
  { fileId: "files/d156wf8hj48z", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/d156wf8hj48z", mimeType: "application/pdf" },
  { fileId: "files/kiz4re1qjgyn", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/kiz4re1qjgyn", mimeType: "application/pdf" },
  { fileId: "files/sfbzceroane5", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/sfbzceroane5", mimeType: "application/pdf" },
  { fileId: "files/ta94jpwif7oo", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/ta94jpwif7oo", mimeType: "application/pdf" },
  { fileId: "files/hcnloscsx6ao", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/hcnloscsx6ao", mimeType: "application/pdf" },
  { fileId: "files/zhumdhpz8owu", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/zhumdhpz8owu", mimeType: "application/pdf" },
  { fileId: "files/p36r6dwr72i2", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/p36r6dwr72i2", mimeType: "application/pdf" },
  { fileId: "files/rwg8lz7qt0t0", fileUri: "https://generativelanguage.googleapis.com/v1beta/files/rwg8lz7qt0t0", mimeType: "application/pdf" },
];

const TITULOS_PERMITIDOS = [
  "I. Encuadre e Implementación",
  "II. Mecanismos Instrumentales",
  "II. Mecanismos Instrumentales.",
  "1. Represión Fundante y 1° Disociación Instrumental",
  "1. Represión Fundante y 1º Disociación Instrumental",
  "Represión Fundante y Primera Disociación Instrumental",
  "Represión Fundante y Primera Disociación Instrumental.",
  "2. 2° Disociación Instrumental",
  "2. 2º Disociación Instrumental",
  "Segunda Disociación Instrumental",
  "Segunda Disociación Instrumental.",
  "3. Identificación Proyectiva",
  "Identificación Proyectiva",
  "4. Racionalización",
  "Racionalización",
  "III. Manejo y Tipos de Ansiedad",
  "III. Manejo y Tipos de Ansiedad.",
  "IV. Secuencia de Reinos y Fantasías de Muerte",
  "Fantasías de Muerte",
  "V. Análisis Estructural (Ello, Yo y Superyó)",
  "VI. Perspectiva ADL",
  "VII. Hipótesis Diagnóstica y Pronóstico",
  "DISCLAIMER",
];

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

  // Barra de progreso (indeterminada)
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.innerHTML = `<div class="progress-bar__fill"></div>`;
  progressBar.hidden = true;
  const statusContainer = document.querySelector(".status-container");
  if (statusContainer) statusContainer.appendChild(progressBar);

  function setStatus(text) {
    statusText.textContent = text || "";
  }

  function setBusy(isBusy) {
    spinner.hidden = !isBusy;
    analizarBtn.disabled = isBusy;
    if (isBusy) {
      setStatus("Analizando");
      progressBar.hidden = false;
    } else {
      setStatus("");
      progressBar.hidden = true;
    }
  }

  function autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = "auto";
    // eslint-disable-next-line no-unused-expressions
    textarea.offsetHeight;
    textarea.style.height = (textarea.scrollHeight + 8) + "px";
  }

  function showResult(reportText) {
    resultText.value = processText(reportText);
    autoResizeTextarea(resultText);
    requestAnimationFrame(() => autoResizeTextarea(resultText));
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

  function wrapPromptForStrictBibliography(promptBase) {
    return `
REGLAS CRÍTICAS (OBLIGATORIO):
- Basarte EXCLUSIVAMENTE en la bibliografía adjunta.
- Si algo no consta en la bibliografía, escribe EXACTAMENTE: "NO CONSTA EN LA BIBLIOGRAFÍA".
- Cada afirmación relevante debe terminar con cita en este formato: [fuente: <fileId>]
- El informe debe estar en Markdown.
- Los títulos que uses deben estar en **negrita** y deben pertenecer a la siguiente lista (no inventes otros títulos):
${TITULOS_PERMITIDOS.map((t) => `- ${t}`).join("\n")}

=== INSTRUCCIÓN PRINCIPAL ===
${promptBase}
`.trim();
  }

  async function callGeminiViaWorker(prompt) {
    const token = ensureAccessToken();
    if (!token) throw new Error("Falta ACCESS TOKEN del Worker.");

    // IMPORTANTE: aquí mandamos "files" ya resuelto, sin /resolve.
    const res = await fetch(`${String(WORKER_URL).replace(/\/+$/, "")}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token
      },
      body: JSON.stringify({ model: GEMINI_MODEL, prompt, files: BIBLIOGRAFIA_RESOLVED })
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

  function validateForm(protocolo) {
    if (!protocolo.nombre) return "Completa el campo Nombre/ID del protocolo.";
    if (!protocolo.edad || protocolo.edad < 4 || protocolo.edad > 100) return "La edad debe estar entre 4 y 100 años.";
    if (!protocolo.fecha) return "Selecciona una fecha.";
    return null;
  }

  function buildPrompt(p) {
    const makeCatexiaBlock = (cat, idx, sign) => {
      const extras =
        (cat.extras && cat.extras.length > 0)
          ? cat.extras.map((ex, i) => `- Cambio ${i + 1}: ${ex.simbolo || "-"} (TR: ${Number(ex.tr || 0)}s)`).join("\n")
          : "- Cambios: —";

      return [
        `${sign}${idx + 1}) Símbolo: ${cat.simbolo || "-"}`,
        `TR(s): ${Number(cat.tr || 0)}`,
        `Justificación: ${cat.justificacion || "-"}`,
        `Observaciones: ${cat.observaciones || "-"}`,
        extras
      ].join("\n");
    };

    const pos = (p.positivas || []).map((c, i) => makeCatexiaBlock(c, i, "+")).join("\n\n");
    const neg = (p.negativas || []).map((c, i) => makeCatexiaBlock(c, i, "-")).join("\n\n");

    const header = [
      "**INFORME DE ANÁLISIS DEL CUESTIONARIO DESIDERATIVO**",
      `**Nombre/ID:** ${p.nombre || "-"}`,
      `**Edad:** ${p.edad || "-"}`,
      `**Sexo:** ${p.genero || "-"}`,
      `**Nivel educativo:** ${p.nivel_educativo || "-"}`,
      `**Fecha:** ${p.fecha || "-"}`,
      `**Modalidad:** ${p.modalidad || "-"}`,
      ""
    ].join("\n");

    const protocolo = [
      "PROTOCOLO (material para análisis):",
      "",
      "CATÉXIAS POSITIVAS:",
      pos || "(sin datos)",
      "",
      "CATÉXIAS NEGATIVAS:",
      neg || "(sin datos)",
      "",
      "Asociaciones espontáneas:",
      p.asociaciones || "-",
      "",
      "Recuerdo positivo:",
      p.recuerdo || "-",
      "",
      "Información contextual relevante:",
      p.informacion || "-"
    ].join("\n");

    const disclaimerText = "Los resultados aquí expuestos no deben considerarse bajo ningún concepto como un diagnóstico clínico definitivo de forma aislada y deben ser supervisados por un profesional";

    return `${header}
${protocolo}

**DISCLAIMER**
${disclaimerText}
FIN DEL INFORME`;
  }

  function processText(rawText) {
    let processed = String(rawText || "");
    const startIndex = processed.search(/\*\*INFORME DE ANÁLISIS DEL CUESTIONARIO DESIDERATIVO\*\*/i);
    if (startIndex > 0) processed = processed.substring(startIndex);

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

  // INIT
  preloadACR();
  initCatexiasPrecargadasACR();
  autoResizeTextarea(resultText);

  // EVENTOS
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

    const promptBase = buildPrompt(protocolo);
    const prompt = wrapPromptForStrictBibliography(promptBase);

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
