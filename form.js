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
  // CONFIGURACIÓN - REEMPLAZA TU API KEY
  // ==========================================
  
  const GEMINI_API_KEY = "AIzaSyBxefi-yWlRMvcpRapt7fh6oLLZrxmxU-U"; // ← CAMBIA ESTO POR TU API KEY REAL
  
  // Tu bibliografía subida a Gemini
  const BIBLIOGRAFIA_FILES = [
    "files/lqljz0esix7l",  // bullying.pdf
    "files/l85o2yj4wxni",  // CASO JADE.pdf
    "files/nwradxiuqm5v",  // CASOS.pdf
    "files/oy22p4nzj63c",  // CD DIANA.pdf
    "files/xpqis5z1ghk4",  // CD Graciela Celener.pdf
    "files/26cu9xpgruab",  // CD pulsiones y defensas en patologías desvalimiento.pdf
    "files/n79vrv5skpjy",  // criterios de interpretación.pdf
    "files/fg8kfw3jq378",  // Cuadro proye - Catexias positivas y negativas.pdf
    "files/8zp3gjdxe7si",  // Cuestionario desiderativo aplicado a niños2.pdf
    "files/hakfkyc56scm",  // Cuestionario desiderativo-Sneiderman3.pdf
    "files/ki31xotjf2ep",  // Indicadores-Psicopatologicos - CD.pdf
    "files/ed3ihkklklif",  // niños latentes.pdf
    "files/g892mj0liccr",  // Ocampo Arzeno - CD.pdf
    "files/qd57w3x9nv28",  // O_questionario_desiderativo_fundamentos.pdf
    "files/9c8x2t9jjeli",  // Preconsciente y su relación con el lenguaje.pdf
    "files/hgvxtih4jluc",  // Psicodiagnostico Clinico 93-117.pdf
    "files/cuf95cny20dh",  // Sneiderman_2011-Cuestionario.pdf
    "files/bryux976g5qq",  // TEORÍA, TÉCNICA Y APLICACIÓN.pdf
    "files/jn7qt73rq3mt",  // Una contribución a la interpretación del Cuestionario Desiderativo.pdf
    "files/qqox2275732w"   // Vinculo hostil.pdf
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
        <input type="checkbox" class="cambio-check" id="cambio-${num}">
        <label for="cambio-${num}">Cambio</label>
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
        <button type="button" class="remove-btn">×</button>
      `;
      extra.querySelector(".remove-btn").addEventListener("click", () => extra.remove());
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
        text += "\n   Cambios: ";
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

    return `Analiza integralmente este protocolo sin modificar ni alterar los títulos de los epígrafes bajo ningún concepto mediante el esquema de la fuente "Análisis integral". Al finalizar el apartado VII, escribe en una línea aparte: FIN DEL INFORME. 

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

  async function callGeminiWithFiles(prompt) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "TU_API_KEY_AQUI") {
      throw new Error("Por favor, configura tu API Key de Gemini en form.js (línea 14)");
    }

    // Usar gemini-2.0-flash-exp que soporta Files API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

    // Construir referencias a tus archivos de bibliografía
    const fileParts = BIBLIOGRAFIA_FILES.map(fileId => ({
      fileData: {
        mimeType: "application/pdf",
        fileUri: `https://generativelanguage.googleapis.com/v1beta/${fileId}`
      }
    }));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            ...fileParts,
            { text: prompt }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error completo de API:", errorData);
      throw new Error(`Error de API: ${errorData.error?.message || 'Error desconocido'}`);
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
    setStatus("🤖 Analizando con tu bibliografía (20 PDFs)...");
    hideResult();

    try {
      const reportText = await callGeminiWithFiles(protocoloText);
      
      setBusy(false);
      setStatus("✓ Análisis completado");
      showResult(reportText);
      
    } catch (error) {
      console.error("Error:", error);
      setBusy(false);
      setStatus("❌ Error en el análisis");
      alert(`Error: ${error.message}\n\nVerifica tu API Key y conexión a internet.`);
    }
  });

  document.getElementById("limpiar").addEventListener("click", () => {
    positivasContainer.innerHTML = "";
    negativasContainer.innerHTML = "";
    positivasContainer.appendChild(createCatexiaFija(1));
    positivasContainer.appendChild(createCatexiaFija(2));
    positivasContainer.appendChild(createCatexiaFija(3));
    negativasContainer.appendChild(createCatexiaFija(1));
    negativasContainer.appendChild(createCatexiaFija(2));
    negativasContainer.appendChild(createCatexiaFija(3));
    document.getElementById("asociaciones").value = "";
    document.getElementById("recuerdo").value = "";
    hideResult();
    setStatus("");
    setBusy(false);
  });

  guardarImprimirBtn.addEventListener("click", () => {
    window.print();
  });

  console.log("✓ App inicializada con Gemini Files API");
  console.log("📚 Bibliografía: 20 archivos cargados");
  console.log("🤖 Modelo: gemini-2.0-flash-exp");
});
