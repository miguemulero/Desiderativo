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
    "files/6h0vrkhitk8w",
    "files/q5tgwp6lc9cj",
    "files/fqsuu6w0n8hv",
    "files/9irbzvcqequw",
    "files/u36qfiegiw4m",
    "files/ykokv6ny44qf",
    "files/7ltpzc66izpr",
    "files/8oapvjkhseq7",
    "files/fbkl6f4fsqil",
    "files/bte9fckqi09l",
    "files/un6o9lzjwtgp",
    "files/7vsf3mzm5p9d",
    "files/ctv2dnvu5xve",
    "files/egihk7p7ojbp",
    "files/gyrx6b0451e8",
    "files/tnabgxpdlha8",
    "files/bdk55xslkd8o"
  ];

  // ==========================================

  document.getElementById("nombre").value = "protocolo ACR";
  document.getElementById("edad").value = "11";
  document.getElementById("genero").value = "masculino";
  document.getElementById("nivel_educativo").value = "primario";
  document.getElementById("fecha").value = "2026-01-20";
  document.getElementById("modalidad").value = "estandar";
  document.getElementById("informacion").value = "padres separados con custodia compartida y alto nivel de conflicto. Tiene dos hermanos mayores que él y otro mellizo.";

  function createCatexiaFija(num, simbolo = "", tr = 0, justificacion = "", observaciones = "") {
    const div = document.createElement("div");
    div.className = "catexia-item";
    const uniqueId = `cambio-${num}-${Date.now()}`;

    div.innerHTML = `
      <div class="catexia-header">Catexia ${num}</div>
      <div class="catexia-main">
        <input type="text" placeholder="Símbolo" class="simbolo" value="${simbolo}"/>
        <input type="number" placeholder="TR (seg)" class="tr" value="${tr}" min="0" step="0.01"/>
      </div>
      <div class="catexia-texts">
        <div class="field">
          <label>Justificación</label>
          <textarea class="justificacion" placeholder="¿Por qué?">${justificacion}</textarea>
        </div>
        <div class="field">
          <label>Observaciones</label>
          <textarea class="observaciones" placeholder="Observaciones...">${observaciones}</textarea>
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

  function buildPrompt(p, selectedAnalysis) {
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

    let instrucciones = `INSTRUCCIONES PARA ANÁLISIS DEL CUESTIONARIO DESIDERATIVO

Usa EXCLUSIVAMENTE las fuentes del Cuestionario/Test Desiderativo cargadas (Ocampo, Arzeno, Grassano, Celener, Maladesky, manuales y artículos afines).

NO inventes teoría ni nomenclaturas nuevas. Si algo no se fundamenta en las fuentes, indícalo como hipótesis clínica y márcalo como tal.

Trabaja siempre a partir del protocolo que te daré: símbolos, racionalizaciones, tiempos de reacción, implementaciones, conducta observada.

Tu tarea es realizar un análisis clínico del Cuestionario Desiderativo con el máximo nivel de profundidad y rigor posible en los aspectos solicitados.

Explicita SIEMPRE:
- Los datos del protocolo que tomas
- El concepto teórico que aplicas (citando autor y fuente)
- La inferencia clínica que extraes

ESTRUCTURA DEL INFORME:
`;

    if (selectedAnalysis.encuadre) {
      instrucciones += `
1. IMPLEMENTACIÓN Y ENCUADRE
- Cómo se administró: forma estándar/guiada, aclaraciones, cambios, resistencias
- Comprensión de consigna: "muerte como humano", función metafórica
- Indicadores de fortaleza/debilidad yoica en implementación
`;
    }

    if (selectedAnalysis.mecanismos) {
      instrucciones += `
2. MECANISMOS INSTRUMENTALES
- Primera disociación: capacidad de convertirse en símbolo
- Segunda disociación: discriminación positivo/negativo
- Identificación al símbolo: distancia vs ecuación simbólica
- Racionalización: coherencia, idealización/peyorización, clichés
`;
    }

    if (selectedAnalysis.ansiedad) {
      instrucciones += `
3. ANSIEDAD (análisis integral según Ocampo y otros autores)
- Catexia por catexia: tipo e intensidad (persecutoria/depresiva)
- Tiempos de reacción y shocks: relación con defensas
- Curva global: clasificación tipos 1-6 de Ocampo, evolución
- Capacidad de reconocer, tolerar, transformar y simbolizar ansiedad
`;
    }

    if (selectedAnalysis.reinos) {
      instrucciones += `
4. REINOS Y FANTASÍAS DE MUERTE
- Secuencia de reinos: orden y variaciones (Animal-Vegetal-Objeto)
- Significado de elecciones: fortaleza/debilidad, esquema corporal
- Fantasías de muerte: aniquilación vs permanencia/legado/reparación
`;
    }

    if (selectedAnalysis.estructural) {
      instrucciones += `
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
`;
    }

    if (selectedAnalysis.adl) {
      instrucciones += `
8. PERSPECTIVA ADL (Algoritmo David Liberman)
8.1. Identificación de erotismos por catexias (oral primario/secundario, anal primario/secundario, fálico-uretral, fálico-genital)
8.2. Registro del lenguaje: narrativo, descriptivo, argumentativo, modal
8.3. Defensas según ADL y eficacia
8.4. Trayectoria pulsional a lo largo del protocolo
8.5. Articulación ADL con Yo, Superyó y posición frente al Otro
8.6. Síntesis ADL: aporte al diagnóstico y pronóstico
`;
    }

    if (selectedAnalysis.hipotesis) {
      instrucciones += `
9. HIPÓTESIS DIAGNÓSTICA Y PRONÓSTICO
- Hipótesis estructural fundamentada en los ejes seleccionados
- Pronóstico: fortaleza yoica, flexibilidad defensiva, capacidad de simbolización
`;
    }

    instrucciones += `
Al finalizar, escribe: "FIN DEL INFORME"

═══════════════════════════════════════════════════════════

PROTOCOLO A ANALIZAR:
Nombre/ID: ${p.nombre}

${protocolo}`;

    return instrucciones;
  }

  function validateForm(protocolo) {
    if (!protocolo.nombre) return "Completa el campo Nombre/ID.";
    if (!protocolo.edad || protocolo.edad < 4 || protocolo.edad > 100) return "La edad debe estar entre 4 y 100 años.";
    if (!protocolo.fecha) return "Selecciona una fecha.";
    return null;
  }

  async function callGeminiWithFiles(prompt) {
    if (!WORKER_URL) throw new Error("Falta configurar WORKER_URL.");

    const token = ensureAccessToken();
    if (!token) throw new Error("Falta ACCESS TOKEN.");

    try {
      console.log("Enviando solicitud a:", WORKER_URL);

      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": token
        },
        body: JSON.stringify({
          // ✅ ÚNICO CAMBIO FUNCIONAL: modelo disponible según tu ListModels
          model: "gemini-2.5-flash",
          prompt,
          fileIds: BIBLIOGRAFIA_FILES
        })
      });

      console.log("Respuesta del Worker:", response.status, response.statusText);

      if (response.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        const errText = await response.text();
        throw new Error(`No autorizado - Token incorrecto. ${errText}`);
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error del Worker (${response.status}): ${errText}`);
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No se recibió respuesta de Gemini");
      }

      if (!data.candidates[0].content || !data.candidates[0].content.parts[0]) {
        throw new Error("Respuesta de Gemini incompleta");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error en callGeminiWithFiles:", error);
      throw new Error(`Error al conectar con Gemini: ${error.message}`);
    }
  }

  // ======= TU CÓDIGO ORIGINAL DE EVENTOS (sin cambios) =======
  // Nota: aquí no puedo reconstruir tu archivo real al 100% si en tu repo
  // tiene más handlers. Si tu form.js real incluye más código debajo,
  // mantenlo y solo sustituye la función callGeminiWithFiles por esta versión.

  analizarBtn.addEventListener("click", async () => {
    // Este bloque depende de tu form.js real. Mantén el tuyo.
    // Si ya lo tienes, NO lo reemplaces; solo cambia el modelo en callGeminiWithFiles.
  });

  guardarImprimirBtn?.addEventListener("click", () => window.print());
});
