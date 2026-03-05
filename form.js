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
    // Mantener Analizando...
    setStatus(isBusy ? "Analizando..." : "");
  }

  // ✅ Autoajuste del textarea al contenido (no afecta a la lógica del análisis)
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

  function validateForm(protocolo) {
    if (!protocolo.nombre) return "Completa el campo Nombre/ID del protocolo.";
    if (!protocolo.edad || protocolo.edad < 4 || protocolo.edad > 100) return "La edad debe estar entre 4 y 100 años.";
    if (!protocolo.fecha) return "Selecciona una fecha.";
    return null;
  }

  function buildPrompt(p) {
    const formatCatexia = (cat, idx) => {
      let text =
        `${idx + 1}. Símbolo: ${cat.simbolo} | TR(s): ${cat.tr}\n` +
        `   Justificación: ${cat.justificacion}\n` +
        `   Observaciones: ${cat.observaciones}`;
      if (cat.extras && cat.extras.length > 0) {
        text += "\n   Cambios:";
        cat.extras.forEach((ex, i) => {
          text += `\n      ${i + 1}. ${ex.simbolo} | TR(s): ${ex.tr}`;
        });
      }
      return text;
    };

    const listPos = p.positivas.map((c, i) => formatCatexia(c, i)).join("\n\n");
    const listNeg = p.negativas.map((c, i) => formatCatexia(c, i)).join("\n\n");

    const protocolo = [
      "Edad: " + p.edad,
      "Sexo: " + (p.genero || "-"),
      "Nivel educativo: " + (p.nivel_educativo || "-"),
      "Fecha: " + p.fecha,
      "Modalidad: " + (p.modalidad || "-"),
      "",
      "CATEXIAS POSITIVAS:",
      listPos,
      "",
      "CATEXIAS NEGATIVAS:",
      listNeg,
      "",
      "Asociaciones:",
      p.asociaciones || "-",
      "",
      "Recuerdo positivo:",
      p.recuerdo || "-",
      "",
      "Información relevante:",
      p.informacion || "-"
    ].join("\n");

    return `Analiza este protocolo con la fuente "Análisis integral". MANTÉN EXACTAMENTE los títulos de los epígrafes de la fuente sin modificarlos. Comienza DIRECTAMENTE con "**I. Encuadre e Implementación**". Títulos en **negrita**. NO incluyas citas ni referencias. NO incluyas "(funcionamiento yoico)" en el texto. Finaliza con "**DISCLAIMER**" seguido de: "Los resultados aquí expuestos no deben considerarse bajo ningún concepto como un diagnóstico médico definitivo de forma aislada y deben ser supervisados por un profesional" y luego en una nueva línea escribe exactamente "FIN DEL INFORME".

PROTOCOLO:
${p.nombre}

${protocolo}`;
  }

  function processText(rawText) {
    let processed = String(rawText || "");
    const startIndex = processed.search(/I\.\s+Encuadre e Implementación/i);
    if (startIndex > 0) processed = processed.substring(startIndex);
    processed = processed.replace(/\s*\(funcionamiento yoico\)/gi, "");
    processed = processed.replace(/\s*\(Funcionamiento Yoico\)/g, "");
    const finIndex = processed.search(/FIN DEL INFORME/i);
    if (finIndex > -1) processed = processed.substring(0, finIndex);
    return processed.trim();
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

  // Si cambia el ancho, recalcular altura (wrap)
  window.addEventListener("resize", () => autoResizeTextarea(resultText));
});
