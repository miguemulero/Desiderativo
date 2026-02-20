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
  // CONFIGURACIÓN
  // ==========================================

  // URL de tu Cloudflare Worker (proxy)
  const WORKER_URL = "https://desiderativo-proxy.migue-mulero.workers.dev";

  // Nombre de clave donde se guarda el token en el navegador (no se sube a GitHub)
  const ACCESS_TOKEN_STORAGE_KEY = "desiderativo_access_token";

  // Tu bibliografía subida a Gemini
  const BIBLIOGRAFIA_FILES = [
    "files/6h0vrkhitk8w",  // bullying.pdf
    "files/q5tgwp6lc9cj",  // CASO JADE.pdf
    "files/fqsuu6w0n8hv",  // CD DIANA.pdf
    "files/9irbzvcqequw",  // CD Graciela Celener.pdf
    "files/u36qfiegiw4m",  // CD pulsiones y defensas en patologías desvalimiento.pdf
    "files/ykokv6ny44qf",  // criterios de interpretación.pdf
    "files/7ltpzc66izpr",  // Cuestionario desiderativo aplicado a niños2.pdf
    "files/8oapvjkhseq7",  // Cuestionario desiderativo-Sneiderman3.pdf
    "files/fbkl6f4fsqil",  // Indicadores-Psicopatologicos - CD.pdf
    "files/bte9fckqi09l",  // niños latentes.pdf
    "files/un6o9lzjwtgp",  // Ocampo Arzeno - CD.pdf
    "files/7vsf3mzm5p9d",  // O_questionario_desiderativo_fundamentos.pdf
    "files/ctv2dnvu5xve",  // Preconsciente y su relación con el lenguaje.pdf
    "files/egihk7p7ojbp",  // Sneiderman_2011-Cuestionario.pdf
    "files/gyrx6b0451e8",  // TEORÍA, TÉCNICA Y APLICACIÓN.pdf
    "files/tnabgxpdlha8",  // Una contribución a la interpretación del Cuestionario Desiderativo.pdf
    "files/bdk55xslkd8o",  // Vinculo hostil.pdf
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

    // Mostrar/ocultar botón al marcar checkbox
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        addBtn.style.display = "block";
      } else {
        addBtn.style.display = "none";
        extrasContainer.innerHTML = "";
      }
    });

    // Añadir símbolo descartado
    addBtn.addEventListener("click", () => {
      const extra = document.createElement("div");
      extra.className = "extra-response";
      extra.innerHTML = `
        <input type="text" placeholder="Símbolo descartado" class="extra-simbolo"/>
        <input type="number" placeholder="TR (seg)" class="extra-tr" min="0" step="0.01"/>
        <button type="button" class="remove-btn" title="Eliminar">×</button>
      `;

      // Botón eliminar
      extra.querySelector(".remove-btn").addEventListener("click", () => {
        extra.remove();
        // Si no quedan extras, desmarcar checkbox
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

Usa EXCLUSIVAMENTE las fuentes del Cuestionario/Test Desiderativo cargadas (Ocampo, Arzeno, Grassano, Celener, Maladesky, manuales y artículos afines).

NO inventes teoría ni nomenclaturas nuevas. Si algo no se fundamenta en las fuentes, indícalo como hipótesis clínica y márcalo como tal.

Trabaja siempre a partir del protocolo que te daré: símbolos, racionalizaciones, tiempos de reacción, implementaciones, conducta observada.

Tu tarea es realizar un análisis clínico INTEGRAL del Cuestionario Desiderativo, con el MÁXIMO nivel de profundidad y rigor posible, abarcando TODAS las variables clásicas de la técnica.

Explicita SIEMPRE:
- Los datos del protocolo que tomas
- El concepto teórico que aplicas (citando autor y fuente)
- La inferencia clínica que extraes

ESTRUCTURA DEL INFORME:

1. IMPLEMENTACIÓN Y ENCUADRE
- Cómo se administró: forma estándar/guiada, aclaraciones, cambios, resistencias
- Comprensión de consigna: "muerte como humano", función metafórica
- Indicadores de fortaleza/debilidad yoica en implementación

2. MECANISMOS INSTRUMENTALES
- Primera disociación: capacidad de convertirse en símbolo
- Segunda disociación: discriminación positivo/negativo
- Identificación al símbolo: distancia vs ecuación simbólica
- Racionalización: coherencia, idealización/peyorización, clichés

3. ANSIEDAD (análisis integral según Ocampo y otros autores)
- Catexia por catexia: tipo e intensidad (persecutoria/depresiva)
- Tiempos de reacción y shocks: relación con defensas
- Curva global: clasificación tipos 1-6 de Ocampo, evolución
- Capacidad de reconocer, tolerar, transformar y simbolizar ansiedad

4. REINOS Y FANTASÍAS DE MUERTE
- Secuencia de reinos: orden y variaciones (Animal-Vegetal-Objeto)
- Significado de elecciones: fortaleza/debilidad, esquema corporal
- Fantasías de muerte: aniquilación vs permanencia/legado/reparación

5. ANÁLISIS ESTRUCTURAL: ELLO - YO - SUPERYÓ
- Ello: pulsiones predominantes, grado de ligadura simbólica
- Yo: fortaleza, juicio de realidad, flexibilidad, función sintetizadora
- Superyó/Ideal del Yo: exigencias, culpa, perfeccionismo

6. POSICIÓN RESPECTO DEL OTRO
- Tipo de vínculos: cuidado, sometimiento, dominio, dependencia
- Lugar del sujeto: útil, víctima, perseguidor, protector
- Articulación con ansiedad y Superyó

7. DEFENSAS Y RECURSOS
- Defensas predominantes: represión, negación, proyección, etc.
- Eficacia: momentos de tramitación vs fracaso
- Recursos yoicos: insight, humor, simbolización, reparación

8. PERSPECTIVA ADL (Algoritmo David Liberman)
8.1. Identificación de erotismos por catexias (oral primario/secundario, anal primario/secundario, fálico-uretral, fálico-genital)
8.2. Registro del lenguaje: narrativo, descriptivo, argumentativo, modal
8.3. Defensas según ADL y eficacia
8.4. Trayectoria pulsional a lo largo del protocolo
8.5. Articulación ADL con Yo, Superyó y posición frente al Otro
8.6. Síntesis ADL: aporte al diagnóstico y pronóstico

9. HIPÓTESIS DIAGNÓSTICA Y PRONÓSTICO
- Hipótesis estructural fundamentada en todos los ejes
- Pronóstico: fortaleza yoica, flexibilidad defensiva, capacidad de simbolización

Al finalizar, escribe: "FIN DEL INFORME"

═══════════════════════════════════════════════════════════

PROTOCOLO A ANALIZAR:
Nombre/ID: ${p.nombre}

${protocolo}`;
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
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function hideResult() {
    resultText.value = "";
    resultSection.style.display = "none";
  }

  function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
  }

  function ensureAccessToken() {
    let token = getAccessToken();
    if (token) return token;

    token = window.prompt(
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
      throw new Error("Falta ACCESS TOKEN. (Si te equivocaste, recarga la página e inténtalo de nuevo).");
    }

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        prompt,
        fileIds: BIBLIOGRAFIA_FILES
      })
    });

    // Si el token es incorrecto, permitimos reintentarlo fácilmente
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
      recuerdo: document.getElementById("recuerdo").value.trim()
    };

    const validationError = validateForm(protocolo);
    if (validationError) {
      alert(validationError);
      return;
    }

    const protocoloText = buildPrompt(protocolo);

    setBusy(true);
    setStatus("🤖 Analizando protocolo con 20 PDFs de bibliografía...");
    hideResult();

    let intentos = 0;
    const maxIntentos = 3;

    async function intentarAnalisis() {
      try {
        if (intentos > 0) {
          setStatus(`🔄 Reintentando (${intentos + 1}/${maxIntentos})...`);
        }

        const reportText = await callGeminiWithFiles(protocoloText);

        setBusy(false);
        setStatus("✅ Análisis completado correctamente");
        showResult(reportText);

      } catch (error) {
        console.error(`Error en intento ${intentos + 1}:`, error);
        intentos++;

        if (intentos < maxIntentos) {
          setStatus(`⚠️ Error. Reintentando en 3 segundos... (${intentos}/${maxIntentos})`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          return intentarAnalisis();
        } else {
          setBusy(false);
          setStatus("❌ Error tras 3 intentos");
          alert(`Error: ${error.message}\n\nSugerencias:\n1. Verifica tu conexión WiFi\n2. Recarga la página\n3. Si persiste, revisa el Worker y sus Secrets (GEMINI_API_KEY / ACCESS_TOKEN)`);
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
    window.print();
  });

  console.log("✓ App inicializada correctamente");
  console.log("📚 Bibliografía: archivos PDF configurados");
  console.log("🤖 Modelo: gemini-2.5-flash (vía Cloudflare Worker)");
});
