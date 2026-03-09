document.addEventListener("DOMContentLoaded", () => {
  const positivasContainer = document.getElementById("positivas-container");
  const negativasContainer = document.getElementById("negativas-container");
  const statusText = document.getElementById("statusText");
  const spinner = document.getElementById("spinner");
  const analizarBtn = document.getElementById("analizar");
  const resultSection = document.getElementById("result-section");
  const resultText = document.getElementById("result-text");
  const resultPrint = document.getElementById("result-print");
  const guardarImprimirBtn = document.getElementById("guardar-imprimir");

  // ==========================================
  // CONFIGURACIÓN
  // ==========================================
  const WORKER_URL = "https://desiderativo-proxy.migue-mulero.workers.dev";
  const ACCESS_TOKEN_STORAGE_KEY = "desiderativo_access_token";

  const BIBLIOGRAFIA_FILES = [
    "fileId": "files/wsd4dpqu0915",
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

  // ==========================================
  // INSTRUCCIONES CLÍNICAS (ESQUEMA ADL) — PARA TEST DE FORMATO
  // ==========================================
  const INSTRUCCIONES_ANALISIS_ADL = `
Este es el esquema del análisis clínico integral, estructural y dinámico del Cuestionario Desiderativo, detallado según las fuentes técnicas y la integración del Algoritmo David Liberman (ADL).

I. Encuadre e Implementación
Este apartado evalúa la adecuación de la técnica a la edad y nivel educativo del sujeto.

    Implementación Estándar: Para sujetos con capacidad simbólica y operatoria consolidada (generalmente a partir de los 11-12 años).
    Forma Guiada Abreviada: Se usa si hay fallos iniciales en la primera disociación; consiste en nombrar los reinos posibles.
    Forma Guiada Extendida: En niños menores de 10 años, se abren las categorías en subcategorías (ej. animales que vuelan o nadan) para facilitar la clasificación.

II. Mecanismos Instrumentales (Funcionamiento Yoico)
Evalúan la fortaleza del Yo para resolver la tarea planteada.

    Represión Fundante y 1° Disociación Instrumental: Capacidad de aceptar el "como sí" lúdico y desidentificarse de la condición humana para reidentificarse en un símbolo.
    2° Disociación Instrumental: Capacidad de discriminar entre los aspectos valorados (+) y los rechazados (-) sin mezclarlos.
    Identificación Proyectiva: Capacidad de depositar aspectos del sí mismo en un símbolo verbal manteniendo la distancia Yo/no-Yo (evitando ecuaciones simbólicas o símbolos disgregados).
    Racionalización: Justificación lógica y formal de la elección, demostrando la adecuación del pensamiento a la realidad compartida.

III. Manejo y Tipos de Ansiedad
Analiza la respuesta emocional frente a la amenaza de "muerte" simbólica.

    Tiempos de Reacción (TR): Se evalúan shocks por acortamiento (<10") —defensa maníaca/evacuativa— o por alargamiento (>30") —mecanismo evitativo/bloqueo—.
    Cualidad de la Ansiedad:
        Persecutoria: Vivida como una agresión al Yo (culpa persecutoria).
        Depresiva: Vivida como agresión al vínculo con los objetos (culpa por la pérdida).
    Tipos de Distribución de la Ansiedad (del 1 al 10): Determina la plasticidad del Yo según la variación de los TR a lo largo del protocolo (ej. Tipo 1: Yo débil que se reorganiza; Tipo 2: Yo con fortaleza y plasticidad).

IV. Secuencia de Reinos y Fantasías de Muerte

    Secuencia de Reinos: Evalúa el instinto de conservación. Lo esperado es Animal > Vegetal > Objeto en las positivas, y el orden inverso en las negativas.
    Fantasías de Muerte: Cómo el sujeto procesa la finitud; si logra una reparación auténtica (identificación con objetos que trascienden) o sucumbe a la parálisis/aniquilación.

V. Análisis Estructural (Ello, Yo y Superyó)

    Ello: Integración de pulsiones de vida y muerte; distribución de la libido (narcisista vs. objetal) y localización de puntos de fijación (oral, anal, uretral, fálico).
    Yo: Evaluación de las funciones (realidad, síntesis, control de impulsos) y el esquema corporal proyectado.
    Superyó: Evaluación del Ideal del Yo y la conciencia moral (¿Es maduro y realista o primitivo y exigente?).

VI. Perspectiva ADL (Algoritmo David Liberman)
Este nivel profundiza en los deseos y defensas a través del lenguaje.

    Niveles de Análisis:
        Paraverbal: Ritmo, pausas y TR.
        Actos del Habla (Frases): Cómo se posiciona el sujeto al enunciar su deseo.
        Relatos (Escenas): Las historias o situaciones narradas en las racionalizaciones.
    Deseos (Erogeneidades): Determinación de la fijación predominante: LI (libido intrasomática), O1 (oral primaria), O2 (sádico-oral), A1 (sádico-anal primaria), A2 (anal secundaria), FU (fálico-uretral) o FG (fálico-genital).
    Defensas y su Estado:
        Defensas: Represión, desmentida, desestimación del afecto, formación reactiva, aislamiento, etc.
        Estado de la defensa: Evaluar si es exitosa (el afecto es tramitado), fracasada (irrumpe la angustia o el síntoma), inhibida o sublimatoria.

VII. Hipótesis Diagnóstica y Pronóstico

    Cuadros Clínicos: Diferenciación entre Estructura Neurótica (simbolización preservada), Estructura Psicótica (ecuaciones simbólicas, fracaso de disociación) o Psicopatía (seudosímbolos, identificación proyectiva inductora).
    Posición respecto al Otro: Tipo de vínculo fantaseado (dependiente, hostil, hostil, protector, etc.).
    Pronóstico: Basado en la capacidad de aprendizaje durante la prueba, la riqueza de los símbolos y la plasticidad del Yo para recuperar el vínculo.
`.trim();

  const REGLAS_SALIDA_ADL_TEST = `
MODO TEST DE FORMATO (aunque no cargue bibliografía):
- Integra el contenido del protocolo en el esquema ADL (I a VII).
- Tu salida DEBE incluir los 7 apartados I–VII (con esos títulos exactos) además de las secciones 1–9 pedidas abajo.
- Si faltan datos para algún punto, escribe literalmente: "DATOS INSUFICIENTES EN PROTOCOLO".
- No inventes datos fuera del protocolo.
`.trim();

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
    if (infoEl)
      infoEl.value =
        "padres separados con custodia compartida y alto nivel de conflicto. Tiene dos hermanos mayores que él y otro mellizo.";
    if (recuerdoEl) recuerdoEl.value = "navidades abriendo regalos con la familia";

    console.log("✓ Protocolo ACR cargado");
  }, 100);

  function createCatexiaFija(
    num,
    simbolo = "",
    tr = 0,
    justificacion = "",
    observaciones = ""
  ) {
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

  positivasContainer.appendChild(
    createCatexiaFija(
      1,
      "AGAPORNI",
      3,
      "porque puede volar, estar en el suelo, ir donde quiera... lo puede adoptar una familia",
      ""
    )
  );
  positivasContainer.appendChild(
    createCatexiaFija(
      2,
      "GIRASOL",
      6,
      "porque le doy pipas a la gente, a veces gratis, a veces no",
      ""
    )
  );
  positivasContainer.appendChild(
    createCatexiaFija(3, "CARNE", 10, "porque estaría buena y disfrutarían comiendo", "")
  );

  negativasContainer.appendChild(
    createCatexiaFija(1, "MAPACHE", 1, "porque huelen mal, me pueden tirar a la basura y matar", "")
  );
  negativasContainer.appendChild(
    createCatexiaFija(
      2,
      "UN ORDENADOR",
      4,
      "porque me usarían y cuando se acabe la batería no podría respirar",
      ""
    )
  );
  negativasContainer.appendChild(
    createCatexiaFija(
      3,
      "UNA ROSA",
      10,
      "porque me arrancarían, me quitarían las espinas y tendría mucho dolor",
      ""
    )
  );

  function readCatexias(container) {
    const items = Array.from(container.querySelectorAll(".catexia-item"));
    return items.map((item) => {
      const simbolo = item.querySelector(".simbolo")?.value?.trim() || "";
      const tr = Number(item.querySelector(".tr")?.value || 0);
      const justificacion = item.querySelector(".justificacion")?.value?.trim() || "";
      const observaciones = item.querySelector(".observaciones")?.value?.trim() || "";

      const extras = Array.from(item.querySelectorAll(".extra-response")).map((ex) => ({
        simbolo: ex.querySelector(".extra-simbolo")?.value?.trim() || "",
        tr: Number(ex.querySelector(".extra-tr")?.value || 0),
      }));

      return { simbolo, tr, justificacion, observaciones, extras };
    });
  }

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

**Comprensión de consigna:** Párrafo en prosa (sin viñetas) describiendo comprensión y posibles resistencias, citando 1 dato del protocolo.
**Indicadores de fortaleza/debilidad yoica en implementación:** Párrafo en prosa, con TR y una cita textual breve del protocolo como evidencia.
`;

    return `
${INSTRUCCIONES_ANALISIS_ADL}

${REGLAS_SALIDA_ADL_TEST}

${styleAnchor}

REGLA CRÍTICA (FUENTES):
- Basa TODO el análisis EXCLUSIVAMENTE en la bibliografía adjunta (archivos) + el protocolo.
- NO uses conocimiento general externo, ni “sentido común clínico”, ni otras fuentes implícitas.
- NO inventes autores/teoría/citas. Solo cita (Autor, año) si consta en los archivos adjuntos.
- Si algo no puede fundamentarse, escribe literalmente: "No consta en la bibliografía aportada".

OBJETIVO:
Generar un informe que reproduzca el estilo del ejemplo ACR: prosa clínica, cohesionada, con subapartados en **negrita** dentro de cada sección, conectando TR + símbolos + justificaciones + contexto.

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

- En cada sección (1 a 9) incluye subapartados en **negrita** (como en el ejemplo) y escribe en PÁRRAFOS.
- PROHIBIDO: listas con viñetas '-' o '*', excepto dentro de "CUESTIONES RELEVANTES:" (numeradas).
- EVIDENCIA OBLIGATORIA: en cada sección cita al menos 2 evidencias del protocolo (símbolo, TR, o frase literal breve).
- No inventes datos fuera del protocolo.

REQUISITOS CLAVE:
- ANSIEDAD: shocks por acortamiento (<10s) y alargamiento (>30s), sentido defensivo, y curva global si procede.
- REINOS: clasifica reino de cada símbolo y analiza secuencia/variaciones.
- ADL: 8.1 a 8.6 (erotismos LI/O1/O2/A1/A2/FU/FG, registro del lenguaje, defensas, trayectoria pulsional, articulación y síntesis).
- HIPÓTESIS ESTRUCTURAL: fundamenta PRINCIPALMENTE en defensas predominantes y su nivel; luego apoya con el resto.

BLOQUE FINAL OBLIGATORIO:
Tras la sección 9, escribe EXACTAMENTE:
CUESTIONES RELEVANTES:

Genera entre 10 y 25 ítems numerados. Cada ítem debe tener:
- una pregunta interpretativa (NO para el paciente),
- y debajo, un párrafo respondiendo (sin viñetas).
Si no consta en bibliografía: "No consta en la bibliografía aportada".

CIERRE OBLIGATORIO (exacto):
**DISCLAIMER**
${disclaimerText}
FIN DEL INFORME

PROTOCOLO A ANALIZAR (no inventes nada fuera de esto):
${protocolo}
`.trim();
  }

  function validateForm(protocolo) {
    if (!protocolo.nombre) {
      return "Completa el campo Nombre/ID.";
    }
    if (!protocolo.edad || protocolo.edad < 4 || protocolo.edad > 100) {
      return "La edad debe estar entre 4 y 100 años.";
    }
    if (!protocolo.fecha) {
      return "Selecciona una fecha.";
    }
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

    // CLAVE: copiar el mismo texto al <pre> imprimible
    if (resultPrint) resultPrint.textContent = reportText;

    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function hideResult() {
    resultText.value = "";
    if (resultPrint) resultPrint.textContent = "";
    resultSection.style.display = "none";
  }

  function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
  }

  function ensureAccessToken() {
    let token = getAccessToken();
    if (token) return token;

    token =
      window.prompt(
        "Introduce el ACCESS TOKEN para usar el análisis (se guardará en este navegador):",
        ""
      ) || "";

    token = token.trim();
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    }
    return token;
  }

  async function callGeminiWithFiles(prompt) {
    if (!WORKER_URL) {
      throw new Error("Falta configurar WORKER_URL.");
    }

    const token = ensureAccessToken();
    if (!token) {
      throw new Error("Falta ACCESS TOKEN.");
    }

    if (!Array.isArray(BIBLIOGRAFIA_FILES) || BIBLIOGRAFIA_FILES.length === 0) {
      throw new Error("No hay bibliografía cargada (BIBLIOGRAFIA_FILES está vacío).");
    }

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        prompt,
        fileIds: BIBLIOGRAFIA_FILES,
      }),
    });

    if (response.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      const errText = await response.text();
      throw new Error(`No autorizado (token incorrecto). Detalle: ${errText}`);
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error worker (${response.status}): ${errText}`);
    }

    const data = await response.json();

    if (data && typeof data.text === "string" && data.text.trim()) {
      return data.text;
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No se recibió respuesta de Gemini");
    }

    return data.candidates[0].content.parts[0].text;
  }

  analizarBtn.addEventListener("click", async () => {
    console.log("Botón Analizar clickeado");

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
      recuerdo: document.getElementById("recuerdo").value.trim(),
    };

    const validationError = validateForm(protocolo);
    if (validationError) {
      alert(validationError);
      return;
    }

    const protocoloText = buildPrompt(protocolo);

    setBusy(true);
    setStatus("Analizando protocolo para revisión profesional");
    hideResult();

    let intentos = 0;
    const maxIntentos = 3;

    async function intentarAnalisis() {
      try {
        if (intentos > 0) {
          setStatus(`Reintentando (${intentos + 1}/${maxIntentos})...`);
        }

        const reportText = await callGeminiWithFiles(protocoloText);

        setBusy(false);
        setStatus("✅ Análisis completado correctamente");
        showResult(reportText);
      } catch (error) {
        console.error(`Error en intento ${intentos + 1}:`, error);
        intentos++;

        if (intentos < maxIntentos) {
          setStatus(`Error. Reintentando en 3 segundos... (${intentos}/${maxIntentos})`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return intentarAnalisis();
        } else {
          setBusy(false);
          setStatus("Error tras 3 intentos");
          alert(
            `Error: ${error.message}\n\nSugerencias:\n1. Verifica tu conexión WiFi\n2. Recarga la página\n3. Si persiste, revisa el Worker y sus Secrets (GEMINI_API_KEY / ACCESS_TOKEN)`
          );
        }
      }
    }

    await intentarAnalisis();
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

  guardarImprimirBtn.addEventListener("click", () => {
    // Asegurar que el <pre> está sincronizado justo antes de imprimir
    if (resultPrint) resultPrint.textContent = resultText.value || "";
    window.print();
  });

  console.log("✓ App inicializada correctamente");
});
