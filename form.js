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
  // (El resto de tu código: createCatexiaFija, readCatexias, buildPrompt, etc. queda igual)
  // ==========================================

  function setBusy(isBusy) {
    spinner.hidden = !isBusy;
    analizarBtn.disabled = isBusy;
  }

  function setStatus(message) {
    statusText.textContent = message;
  }

  function showResult(reportText) {
    resultText.value = reportText;
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
    if (!WORKER_URL) throw new Error("Falta configurar WORKER_URL.");

    const token = ensureAccessToken();
    if (!token) throw new Error("Falta ACCESS TOKEN.");

    // ✅ Modelo REAL disponible en tu proyecto (según ListModels)
    const model = "gemini-2.5-flash";

    try {
      console.log("Enviando solicitud a:", WORKER_URL);
      console.log("Modelo enviado:", model);

      const response = await fetch(`${WORKER_URL}?v=20260303_3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": token
        },
        body: JSON.stringify({
          model,
          prompt,
          fileIds: BIBLIOGRAFIA_FILES
        })
      });

      console.log("Respuesta del Worker:", response.status);

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
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Respuesta de Gemini incompleta/vacía");
      return text;
    } catch (error) {
      console.error("Error en callGeminiWithFiles:", error);
      throw new Error(`Error al conectar con Gemini: ${error.message}`);
    }
  }

  // ==========================================
  // IMPORTANTE: aquí deberías mantener tu handler real.
  // No puedo reconstruir todo tu form.js sin el resto del archivo,
  // así que pega SOLO este callGeminiWithFiles en tu form.js actual.
  // ==========================================

  // EJEMPLO: deja tu listener original tal cual. (No lo reescribo aquí).
});
