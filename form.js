document.addEventListener("DOMContentLoaded", () => {
  const statusText = document.getElementById("statusText");
  const spinner = document.getElementById("spinner");
  const analizarBtn = document.getElementById("analizar");
  const resultSection = document.getElementById("result-section");
  const resultText = document.getElementById("result-text");
  const resultPrint = document.getElementById("result-print");
  const guardarImprimirBtn = document.getElementById("guardar-imprimir");

  const WORKER_URL = "https://desiderativo-proxy.migue-mulero.workers.dev";
  const ACCESS_TOKEN_STORAGE_KEY = "desiderativo_access_token";

  const BIBLIOGRAFIA_FILES = [
    "files/6h0vrkhitk8w","files/q5tgwp6lc9cj","files/fqsuu6w0n8hv","files/9irbzvcqequw",
    "files/u36qfiegiw4m","files/ykokv6ny44qf","files/7ltpzc66izpr","files/8oapvjkhseq7",
    "files/fbkl6f4fsqil","files/bte9fckqi09l","files/un6o9lzjwtgp","files/7vsf3mzm5p9d",
    "files/ctv2dnvu5xve","files/egihk7p7ojbp","files/gyrx6b0451e8","files/tnabgxpdlha8",
    "files/bdk55xslkd8o"
  ];

  function setBusy(b) {
    spinner.hidden = !b;
    analizarBtn.disabled = b;
  }
  function setStatus(s) {
    statusText.textContent = s;
  }
  function showResult(text) {
    resultText.value = text;
    if (resultPrint) resultPrint.textContent = text;
    resultSection.style.display = "block";
  }

  function ensureAccessToken() {
    let token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
    if (token) return token;

    token = (window.prompt("Introduce el ACCESS TOKEN:", "") || "").trim();
    if (token) localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    return token;
  }

  async function callWorker(prompt) {
    const token = ensureAccessToken();
    if (!token) throw new Error("Falta ACCESS TOKEN");

    // ✅ aunque mandemos model, el Worker lo fuerza igual a gemini-1.5-flash
    const payload = {
      model: "gemini-1.5-flash",
      prompt,
      fileIds: BIBLIOGRAFIA_FILES,
    };

    const res = await fetch(`${WORKER_URL}?v=20260303_2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Worker ${res.status}: ${text}`);

    const data = JSON.parse(text);
    const out = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!out) throw new Error("Respuesta vacía/incompleta de Gemini");
    return out;
  }

  analizarBtn.addEventListener("click", async () => {
    try {
      setBusy(true);
      setStatus("Conectando con Gemini...");

      // aquí deberías construir tu prompt real; dejo uno mínimo para prueba
      const prompt = "Escribe 'OK' y termina.";
      const out = await callWorker(prompt);

      setStatus("✅ OK");
      showResult(out);
    } catch (e) {
      setStatus("❌ Error");
      alert(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  });

  guardarImprimirBtn?.addEventListener("click", () => window.print());
});
