document.addEventListener("DOMContentLoaded", () => {
  const positivasContainer = document.getElementById("positivas-container");
  const negativasContainer = document.getElementById("negativas-container");
  const statusText = document.getElementById("statusText");
  const spinner = document.getElementById("spinner");
  const analizarBtn = document.getElementById("analizar");
  const limpiarBtn = document.getElementById("limpiar");
  const resultSection = document.getElementById("result-section");
  const resultText = document.getElementById("result-text");
  const guardarImprimirBtn = document.getElementById("guardar-imprimir");

  // ========= CONFIG =========
  const WORKER_URL = "https://desiderativo-proxy.migue-mulero.workers.dev";
  const ACCESS_TOKEN_STORAGE_KEY = "desiderativo_access_token";

  // Pega aquí los fileIds válidos: "files/..."
  const BIBLIOGRAFIA_FILES = [
    //    "fileId": "files/wsd4dpqu0915",
      "fileId": "files/jrdon4rz8pl9",
      "fileId": "files/u8idv98iefwy",
      "fileId": "files/l8147ymu4bv4",
      "fileId": "files/yt6fwxwb8b22",
      "fileId": "files/5faj6dpyrw46",
      "fileId": "files/m8p1ukasexv2",
      "fileId": "files/rvu2ta74ibd5",
      "fileId": "files/8uvxi4aoos2f",
      "fileId": "files/3yazxmiktsnk",
      "fileId": "files/obvszki5yfvg",
      "fileId": "files/octw6e79ydld",
      "fileId": "files/q67v0mpvtzrn",
      "fileId": "files/b1jkg2r87ru7",
      "fileId": "files/1jh9xs4w2n50",
      "fileId": "files/3it225iwkey2",
      "fileId": "files/z5aru2ozop9k",
      "fileId": "files/zm0iyz8zwldy",
      "fileId": "files/3c216nwlmv3u",
      "fileId": "files/ek8k1ef3d4h9",
      "fileId": "files/kkwwdhpgzwjw",
];
  ];

  // ========= Helpers UI =========
  function setBusy(isBusy) {
    if (spinner) spinner.hidden = !isBusy;
    if (analizarBtn) analizarBtn.disabled = isBusy;
    if (limpiarBtn) limpiarBtn.disabled = isBusy;
  }

  function setStatus(message) {
    if (statusText) statusText.textContent = message || "";
  }

  function showResult(text) {
    if (resultText) resultText.value = text || "";
    if (resultSection) {
      resultSection.style.display = "block";
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function hideResult() {
    if (resultText) resultText.value = "";
    if (resultSection) resultSection.style.display = "none";
  }

  // ========= Access token =========
  function getAccessToken() {
    try {
      return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }

  function ensureAccessToken() {
    let token = getAccessToken();
    if (token) return token;

    token = (window.prompt(
      "Introduce el ACCESS TOKEN para usar el análisis (se guardará en este navegador):",
      ""
    ) || "").trim();

    if (token) {
      try {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
      } catch {
        // ignore
      }
    }
    return token;
  }

  // ========= Catexias UI =========
  function escapeHtmlText(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function escapeHtmlAttr(s) {
    return escapeHtmlText(s).replaceAll('"', "&quot;");
  }

  function createCatexiaFija(num, simbolo = "", tr = "", justificacion = "", observaciones = "") {
    const div = document.createElement("div");
    div.className = "catexia-item";

    const uniqueId = `cambio-${num}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

    div.innerHTML = `
      <div class="catexia-header">Catexia ${num}</div>

      <div class="catexia-main">
        <input class="simbolo" type="text" placeholder="Símbolo" value="${escapeHtmlAttr(simbolo)}"/>
        <input class="tr" type="number" placeholder="TR (seg)" value="${escapeHtmlAttr(tr)}" min="0" step="0.01"/>
      </div>

      <div class="catexia-texts">
        <div class="field">
          <label>Justificación</label>
          <textarea class="justificacion" placeholder="Razón del símbolo...">${escapeHtmlText(justificacion)}</textarea>
        </div>
        <div class="field">
          <label>Observaciones</label>
          <textarea class="observaciones" placeholder="Notas adicionales...">${escapeHtmlText(observaciones)}</textarea>
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

  function ensureCatexiasRendered() {
    if (!positivasContainer || !negativasContainer) return;

    // Siempre renderiza 3 y 3 (vacías) si no hay nada
    if (positivasContainer.children.length === 0) {
      positivasContainer.appendChild(createCatexiaFija(1));
      positivasContainer.appendChild(createCatexiaFija(2));
      positivasContainer.appendChild(createCatexiaFija(3));
    }

    if (negativasContainer.children.length === 0) {
      negativasContainer.appendChild(createCatexiaFija(1));
      negativasContainer.appendChild(createCatexiaFija(2));
      negativasContainer.appendChild(createCatexiaFija(3));
    }
  }

  function readCatexias(container) {
    const items = Array.from(container.querySelectorAll(".catexia-item"));
    return items.map((item) => {
      const simbolo = (item.querySelector(".simbolo")?.value || "").trim();
      const tr = Number(item.querySelector(".tr")?.value || 0);
      const justificacion = (item.querySelector(".justificacion")?.value || "").trim();
      const observaciones = (item.querySelector(".observaciones")?.value || "").trim();

      const extras = Array.from(item.querySelectorAll(".extra-response")).map((ex) => ({
        simbolo: (ex.querySelector(".extra-simbolo")?.value || "").trim(),
        tr: Number(ex.querySelector(".extra-tr")?.value || 0),
      }));

      return { simbolo, tr, justificacion, observaciones, extras };
    });
  }

  // ========= Prompt =========
  function buildPrompt(p) {
    const formatCatexia = (cat, idx) => {
      let text =
        `${idx + 1}. Símbolo: ${cat.simbolo || "-"} | TR(s): ${Number(cat.tr || 0)}\n` +
        `   Justificación: ${cat.justificacion || "-"}\n` +
        `   Observaciones: ${cat.observaciones || "-"}`;

      if (cat.extras && cat.extras.length > 0) {
        text += "\n   Cambios de símbolo:";
        cat.extras.forEach((ex, i) => {
          text += `\n      ${i + 1}. Símbolo descartado: ${ex.simbolo || "-"} | TR(s): ${Number(ex.tr || 0)}`;
        });
      }
      return text;
    };

    const listPos = (p.positivas || []).map((c, i) => formatCatexia(c, i)).join("\n\n");
    const listNeg = (p.negativas || []).map((c, i) => formatCatexia(c, i)).join("\n\n");

    const protocolo = [
      `**Nombre/ID:** ${p.nombre || "-"}`,
      `**Edad:** ${p.edad || "-"}`,
      `**Sexo:** ${p.genero || "-"}`,
      `**Nivel educativo:** ${p.nivel_educativo || "-"}`,
      `**Fecha:** ${p.fecha || "-"}`,
      `**Modalidad:** ${p.modalidad || "-"}`,
      "",
      "CATÉXIAS POSITIVAS:",
      listPos || "(sin datos)",
      "",
      "CATÉXIAS NEGATIVAS:",
      listNeg || "(sin datos)",
      "",
      "Asociaciones espontáneas:",
      p.asociaciones || "-",
      "",
      "Recuerdo positivo:",
      p.recuerdo || "-",
      "",
      "Información contextual relevante:",
      p.informacion || "-",
    ].join("\n");

    const disclaimerText =
      "Los resultados aquí expuestos no deben considerarse bajo ningún concepto como un diagnóstico clínico definitivo de forma aislada y deben ser supervisados por un profesional";

    const styleAnchor = `
EJEMPLO DE ESTILO (SOLO FORMATO, NO COPIAR CONTENIDO):
**1. IMPLEMENTACIÓN Y ENCUADRE**
Párrafo introductorio breve conectando modalidad y TR global.
`;

    return `
${styleAnchor}

REGLA CRÍTICA (FUENTES):
- Basa TODO el análisis EXCLUSIVAMENTE en la bibliografía adjunta (archivos) + el protocolo.
- NO uses conocimiento general externo, ni “sentido común clínico”, ni otras fuentes implícitas.
- NO inventes autores/teoría/citas. Solo cita (Autor, año) si consta en los archivos adjuntos.
- Si algo no puede fundamentarse, escribe literalmente: "No consta en la bibliografía aportada".

OBJETIVO:
Generar un informe en prosa clínica cohesionada, con subapartados en **negrita**.

REGLAS DE SALIDA (MUY ESTRICTAS):
- Empieza EXACTAMENTE con:
**INFORME DE ANÁLISIS DEL CUESTIONARIO DESIDERATIVO**
**Nombre/ID:** ...
**Edad:** ...
**Sexo:** ...
**Nivel educativo:** ...
**Fecha:** ...
**Modalidad:** ...

- Luego escribe SOLO las secciones 1 a 9 con estos títulos EXACTOS (en negrita):
**1. IMPLEMENTACIÓN Y ENCUADRE**
**2. MECANISMOS INSTRUMENTALES**
**3. ANSIEDAD**
**4. REINOS Y FANTASÍAS DE MUERTE**
**5. ANÁLISIS ESTRUCTURAL: ELLO - YO – SUPERYÓ**
**6. POSICIÓN RESPECTO DEL OTRO**
**7. DEFENSAS Y RECURSOS**
**8. PERSPECTIVA ADL (Algoritmo David Liberman)**
**9. HIPÓTESIS DIAGNÓSTICA Y PRONÓSTICO**

- En cada sección incluye subapartados en **negrita** y escribe en PÁRRAFOS.

BLOQUE FINAL OBLIGATORIO:
Tras la sección 9, escribe EXACTAMENTE:
CUESTIONES RELEVANTES:

CIERRE OBLIGATORIO (exacto):
**DISCLAIMER**
${disclaimerText}
FIN DEL INFORME

PROTOCOLO A ANALIZAR:
${protocolo}
`.trim();
  }

  function validateForm(protocolo) {
    if (!protocolo.nombre) return "Completa el campo Nombre/ID.";
    if (!protocolo.edad || protocolo.edad < 4 || protocolo.edad > 100) return "La edad debe estar entre 4 y 100 años.";
    if (!protocolo.fecha) return "Selecciona una fecha.";
    return null;
  }

  // ========= Worker call =========
  async function callGeminiWithFiles(prompt) {
    if (!WORKER_URL) throw new Error("Falta configurar WORKER_URL.");

    const token = ensureAccessToken();
    if (!token) throw new Error("Falta ACCESS TOKEN.");

    if (!Array.isArray(BIBLIOGRAFIA_FILES) || BIBLIOGRAFIA_FILES.length === 0) {
      throw new Error("No hay bibliografía cargada (BIBLIOGRAFIA_FILES está vacío).");
    }

    const fileIds = BIBLIOGRAFIA_FILES
      .map((x) => String(x || "").trim())
      .filter((x) => x.startsWith("files/"));

    if (fileIds.length === 0) throw new Error("No hay fileIds válidos (deben empezar por 'files/').");

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        prompt,
        fileIds,
      }),
    });

    if (response.status === 401) {
      try {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      } catch {}
      const errText = await response.text();
      throw new Error(`No autorizado (token incorrecto). Detalle: ${errText}`);
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error worker (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (data && typeof data.text === "string" && data.text.trim()) return data.text;

    const t = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof t === "string" && t.trim()) return t;

    throw new Error("Respuesta vacía del Worker.");
  }

  // ========= Init =========
  ensureCatexiasRendered();

  // ========= Events =========
  if (analizarBtn) {
    analizarBtn.addEventListener("click", async () => {
      const protocolo = {
        nombre: (document.getElementById("nombre")?.value || "").trim(),
        edad: Number(document.getElementById("edad")?.value || 0),
        genero: document.getElementById("genero")?.value || "",
        nivel_educativo: document.getElementById("nivel_educativo")?.value || "",
        fecha: document.getElementById("fecha")?.value || "",
        modalidad: document.getElementById("modalidad")?.value || "estandar",
        informacion: (document.getElementById("informacion")?.value || "").trim(),
        positivas: readCatexias(positivasContainer),
        negativas: readCatexias(negativasContainer),
        asociaciones: (document.getElementById("asociaciones")?.value || "").trim(),
        recuerdo: (document.getElementById("recuerdo")?.value || "").trim(),
      };

      const validationError = validateForm(protocolo);
      if (validationError) {
        window.alert(validationError);
        return;
      }

      setBusy(true);
      hideResult();
      setStatus("Analizando protocolo para revisión profesional...");

      const prompt = buildPrompt(protocolo);

      const maxIntentos = 3;
      for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
          if (intento > 1) setStatus(`Reintentando (${intento}/${maxIntentos})...`);
          const reportText = await callGeminiWithFiles(prompt);
          setBusy(false);
          setStatus("Análisis completado correctamente.");
          showResult(reportText);
          return;
        } catch (err) {
          if (intento === maxIntentos) {
            setBusy(false);
            setStatus("Error tras 3 intentos.");
            window.alert(
              `Error: ${err?.message || String(err)}\n\n` +
              `Sugerencias:\n` +
              `1) Verifica que BIBLIOGRAFIA_FILES contiene SOLO IDs nuevos y válidos (files/...).\n` +
              `2) Verifica tu ACCESS TOKEN.\n` +
              `3) Revisa los logs del Worker.`
            );
            return;
          }
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    });
  }

  if (limpiarBtn) {
    limpiarBtn.addEventListener("click", () => {
      const setVal = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.value = v;
      };

      setVal("nombre", "");
      setVal("edad", "");
      setVal("genero", "");
      setVal("nivel_educativo", "");
      setVal("fecha", "");
      setVal("modalidad", "estandar");
      setVal("informacion", "");
      setVal("asociaciones", "");
      setVal("recuerdo", "");

      if (positivasContainer) {
        positivasContainer.innerHTML = "";
        positivasContainer.appendChild(createCatexiaFija(1));
        positivasContainer.appendChild(createCatexiaFija(2));
        positivasContainer.appendChild(createCatexiaFija(3));
      }

      if (negativasContainer) {
        negativasContainer.innerHTML = "";
        negativasContainer.appendChild(createCatexiaFija(1));
        negativasContainer.appendChild(createCatexiaFija(2));
        negativasContainer.appendChild(createCatexiaFija(3));
      }

      hideResult();
      setStatus("");
      setBusy(false);
    });
  }

  if (guardarImprimirBtn) {
    guardarImprimirBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (!positivasContainer || !negativasContainer || !analizarBtn) {
    setStatus("Error: faltan elementos del DOM (revisa IDs en index.html).");
  }
});
