document.addEventListener("DOMContentLoaded", () => {
  const positivasContainer = document.getElementById("positivas-container");
  const negativasContainer = document.getElementById("negativas-container");
  const statusText = document.getElementById("statusText");
  const spinner = document.getElementById("spinner");
  const analizarBtn = document.getElementById("analizar");
  const resultSection = document.getElementById("result-section");
  const resultText = document.getElementById("result-text");
  const guardarImprimirBtn = document.getElementById("guardar-imprimir");

  // ==========================================
  // CONFIGURACIÓN (v3-pwa) - USAR WORKER (NO API KEY EN FRONT)
  // ==========================================

  const WORKER_URL = "https://desiderativo-proxy.migue-mulero.workers.dev";
  const ACCESS_TOKEN_STORAGE_KEY = "desiderativo_access_token";

  // Tu bibliografía subida (ids). El Worker se encarga de pasarlos correctamente a Gemini.
  const BIBLIOGRAFIA_FILES = [
    "files/lqljz0esix7l",
    "files/l85o2yj4wxni",
    "files/nwradxiuqm5v",
    "files/oy22p4nzj63c",
    "files/xpqis5z1ghk4",
    "files/26cu9xpgruab",
    "files/n79vrv5skpjy",
    "files/fg8kfw3jq378",
    "files/8zp3gjdxe7si",
    "files/hakfkyc56scm",
    "files/ki31xotjf2ep",
    "files/ed3ihkklklif",
    "files/g892mj0liccr",
    "files/qd57w3x9nv28",
    "files/9c8x2t9jjeli",
    "files/hgvxtih4jluc",
    "files/cuf95cny20dh",
    "files/bryux976g5qq",
    "files/jn7qt73rq3mt",
    "files/qqox2275732w"
  ];

  // ==========================================

  setTimeout(() => {
    const nombreEl = document.getElementById("nombre");
    const edadEl = document.getElementById("edad");
    const generoEl = document.getElementById("genero");
    const nivelEl = document.getElementById("nivel_educativo");
    const fechaEl = document.getElementById("fecha");
    const modalidadEl = document.getElementById("modalidad");
    const infoEl = document.getElementById("informacion");
    const recuerdoEl = document.getElementById("recuerdo");

    if (nombreEl) nombreEl.value = "protocolo ACR";
    if (edadEl) edadEl.value = "11";
    if (generoEl) generoEl.value = "masculino";
    if (nivelEl) nivelEl.value = "primario";
    if (fechaEl) fechaEl.value = "2026-01-20";
    if (modalidadEl) modalidadEl.value = "estandar";
    if (infoEl) infoEl.value = "padres separados con custodia compartida y alto nivel de conflicto. Tiene dos hermanos mayores que él y otro mellizo.";
    if (recuerdoEl) recuerdoEl.value = "navidades abriendo regalos con la familia";

    console.log("✓ Protocolo ACR cargado");
  }, 100);

  function createCatexiaFija(num, simbolo = "", tr = 0, justificacion = "", observaciones = "") {
    const div = document.createElement("div");
    div.className = "catexia-item";
    const uniqueId = `cambio-${num}-${Date.now()}`;

    div.innerHTML = `
      <div class="catexia-header">Catexia ${num}</div>
      <div class="catexia-main">
        <input class="simbolo" type="text" placeholder="Símbolo" value="${simbolo}"/>
        <input class="tr" type="number" placeholder="TR (seg)" value="${tr}" min="0" step="0.01"/>
      </div>
      <div class="catexia-texts">
        <div class="field">
          <label>Justificación</label>
          <textarea class="justificacion" placeholder="Razón del símbolo...">${justificacion}</textarea>
        </div>
        <div class="field">
          <label>Observaciones</label>
          <textarea class="observaciones" placeholder="Notas adicionales...">${observaciones}</textarea>
        </div>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" class="cambio-check" id="${uniqueId}">
        <label for="${uniqueId}">Cambio de símbolo</label>
      </div>
      <button type="button" class="add-btn" style="display:none;">+ Añadir símbolo descartado</button>
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
        <input type="text" placeholder="Símbolo descartado" class="extra-simbolo"/>
        <input type="number" placeholder="TR (seg)" class="extra-tr" min="0" step="0.01"/>
        <button type="button" class="remove-btn" title="Eliminar">×</button>
      `;

      extra.querySelector(".remove-btn").addEventListener("click", () => {
        extra.remove();
        if (extrasContainer.children.length === 0) {
          checkbox.checked = false;
          addBtn.style.display = "none";
        }
      });

      extrasContainer.appendChild(extra);
    });

    return div;
  }

  positivasContainer.appendChild(createCatexiaFija(1, "AGAPORNI", 3, "porque puede volar, estar en el suelo, ir donde quiera... lo puede adoptar una familia", ""));
  positivasContainer.appendChild(createCatexiaFija(2, "GIRASOL", 6, "porque le doy pipas a la gente, a veces gratis, a veces no", ""));
  positivasContainer.appendChild(createCatexiaFija(3, "CARNE", 10, "porque estaría buena y disfrutarían comiendo", ""));

  negativasContainer.appendChild(createCatexiaFija(1, "MAPACHE", 1, "porque huelen mal, me pueden tirar a la basura y matar", ""));
  negativasContainer.appendChild(createCatexiaFija(2, "UN ORDENADOR", 4, "porque me usarían y cuando se acabe la batería no podría respirar", ""));
  negativasContainer.appendChild(createCatexiaFija(3, "UNA ROSA", 10, "porque me arrancarían, me quitarían las espinas y tendría mucho dolor", ""));

  function readCatexias(container) {
    const items = Array.from(container.querySelectorAll(".catexia-item"));
    return items.map(item => {
      const simbolo = item.querySelector(".simbolo")?.value?.trim() || "";
      const tr = Number(item.querySelector(".tr")?.value || 0);
      const justificacion = item.querySelector(".justificacion")?.value?.trim() || "";
      const observaciones = item.querySelector(".observaciones")?.value?.trim() || "";

      const extras = Array.from(item.querySelectorAll(".extra-response")).map(ex => ({
        simbolo: ex.querySelector(".extra-simbolo")?.value?.trim() || "",
        tr: Number(ex.querySelector(".extra-tr")?.value || 0)
      }));

      return { simbolo, tr, justificacion, observaciones, extras };
    });
  }

  function buildPrompt(p) {
    const formatCatexia = (cat, idx) => {
      let text = `${idx + 1}. Símbolo: ${cat.simbolo} | TR(s): ${cat.tr}\n   Justificación: ${cat.justificacion}\n   Observaciones: ${cat.observaciones}`;
      if (cat.extras && cat.extras.length > 0) {
        text += "\n   Cambios de símbolo:";
        cat.extras.forEach((ex, i) => {
          text += `\n      ${i + 1}. Símbolo descartado: ${ex.simbolo} | TR(s): ${ex.tr}`;
        });
      }
      return text;
    };

    const listPos = p.positivas.map((c, i) => formatCatexia(c, i)).join("\n\n");
    const listNeg = p.negativas.map((c, i) => formatCatexia(c, i)).join("\n\n");

    const protocolo = [
      "Edad: " + p.edad,
      "Sexo: " + p.genero,
      "Nivel educativo: " + p.nivel_educativo,
      "Fecha: " + p.fecha,
      "Modalidad: " + p.modalidad,
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

    return `INSTRUCCIONES INTEGRALES PARA ANÁLISIS DEL CUESTIONARIO DESIDERATIVO

(…tu prompt largo igual que lo tienes…)

PROTOCOLO A ANALIZAR:
Nombre/ID: ${p.nombre}

${protocolo}`;
  }

  function validateForm(protocolo) {
    if (!protocolo.nombre) return "Completa el campo Nombre/ID.";
    if (!protocolo.edad || protocolo.edad < 4 || protocolo.edad > 100) return "La edad debe estar entre 4 y 100 años.";
    if (!protocolo.fecha) return "Selecciona una fecha.";
    return null;
  }

  function setBusy(isBusy) {
    spinner.hidden = !isBusy;
    analizarBtn.disabled = isBusy;
  }

  function setStatus(message) {
    statusText.textContent = message;
  }

  function showResult(reportText) {
    resultText.value = reportText;
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function hideResult() {
    resultText.value = "";
    resultSection.style.display = "none";
  }

  function ensureAccessToken() {
    let token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
    if (token) return token;
    token = (window.prompt("Introduce el ACCESS TOKEN:", "") || "").trim();
    if (token) localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    return token;
  }

  // ✅ ESTA es la corrección del “error de conexión”:
  // llamar al Worker (evita CORS y problemas de fileUri en el navegador)
  async function callGeminiWithFiles(prompt) {
    const token = ensureAccessToken();
    if (!token) throw new Error("Falta ACCESS TOKEN.");

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token
      },
      body: JSON.stringify({
        // modelo disponible en tu cuenta
        model: "gemini-2.5-flash",
        prompt,
        fileIds: BIBLIOGRAFIA_FILES
      })
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Worker ${res.status}: ${text}`);

    const data = JSON.parse(text);
    const out = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!out) throw new Error("Respuesta vacía/incompleta de Gemini");
    return out;
  }

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

    const protocoloText = buildPrompt(protocolo);

    setBusy(true);
    setStatus("🤖 Analizando protocolo con bibliografía...");
    hideResult();

    try {
      const reportText = await callGeminiWithFiles(protocoloText);
      setStatus("✅ Análisis completado correctamente");
      showResult(reportText);
    } catch (e) {
      setStatus("❌ Error");
      alert(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  });

  document.getElementById("limpiar").addEventListener("click", () => {
    document.getElementById("nombre").value = "";
    document.getElementById("edad").value = "";
    document.getElementById("genero").value = "";
    document.getElementById("nivel_educativo").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("modalidad").value = "estandar";
    document.getElementById("informacion").value = "";
    document.getElementById("asociaciones").value = "";
    document.getElementById("recuerdo").value = "";

    positivasContainer.innerHTML = "";
    negativasContainer.innerHTML = "";
    positivasContainer.appendChild(createCatexiaFija(1));
    positivasContainer.appendChild(createCatexiaFija(2));
    positivasContainer.appendChild(createCatexiaFija(3));
    negativasContainer.appendChild(createCatexiaFija(1));
    negativasContainer.appendChild(createCatexiaFija(2));
    negativasContainer.appendChild(createCatexiaFija(3));

    hideResult();
    setStatus("");
    setBusy(false);
  });

  guardarImprimirBtn.addEventListener("click", () => window.print());
});
