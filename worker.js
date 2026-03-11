export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Access-Token",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = request.headers.get("X-Access-Token");
    if (!token || token !== env.ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname || "/";

    // Rutas soportadas: /analyze y / (root)
    if (pathname !== "/" && pathname !== "/analyze") {
      return new Response(JSON.stringify({ error: `Unknown route: ${pathname}. Use POST /analyze` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Reglas estrictas (igual que antes) ---
    const TITULOS_OBLIGATORIOS = [
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

    const strictInstruction = `
Eres un asistente de análisis clínico/psicodinámico. REGLAS OBLIGATORIAS:

1) Usa EXCLUSIVAMENTE la bibliografía adjunta (archivos proporcionados). Prohibido usar conocimiento externo.
2) Si una afirmación no está explícitamente sustentada en la bibliografía adjunta, escribe exactamente: "NO CONSTA EN LA BIBLIOGRAFÍA".
3) Todo punto relevante debe incluir cita explícita al final del párrafo con el formato: [fuente: <fileId>].
   - Puedes citar múltiples fuentes: [fuente: files/abc, files/def]
4) Debes seguir la estructura del informe solicitada por el usuario.
5) Los títulos del informe deben estar EXACTAMENTE en **negrita** cuando aparezcan, y solo usar títulos de esta lista:
${TITULOS_OBLIGATORIOS.map((t) => `- ${t}`).join("\n")}

FORMATO:
- Devuelve el informe en Markdown.
- Cada sección comienza con el título en negrita en su propia línea: **TÍTULO**
- No inventes bibliografía ni autores. No cites nada fuera de las fuentes adjuntas.
`.trim();

    const extractTextFromGemini = (geminiJson) => {
      return (
        geminiJson?.candidates?.[0]?.content?.parts
          ?.map((p) => p?.text)
          ?.filter(Boolean)
          ?.join("\n") || ""
      );
    };

    try {
      const body = await request.json();
      const { model: rawModel, prompt, files } = body;

      if (!prompt) {
        return new Response(JSON.stringify({ error: "Missing prompt" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Bibliografía obligatoria: ahora viene YA resuelta desde el frontend
      if (!Array.isArray(files) || files.length === 0) {
        return new Response(JSON.stringify({
          error: "Missing files (bibliografía obligatoria)",
          hint: "El frontend debe enviar { prompt, files:[{fileId,fileUri,mimeType}] }",
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let model = rawModel || "gemini-2.5-flash";
      if (typeof model === "string" && model.startsWith("models/")) model = model.slice("models/".length);
      if (model === "gemini-2.0-flash" || model === "gemini-2.0-flash-001") model = "gemini-2.5-flash";

      // Construir parts (prompt primero, luego bibliografía)
      const fileParts = files.map((f) => {
        const fileUri = f?.fileUri;
        const mimeType = f?.mimeType || "application/pdf";
        if (!fileUri || typeof fileUri !== "string") throw new Error("Invalid files[].fileUri");
        return { fileData: { mimeType, fileUri } };
      });

      const parts = [{ text: prompt }, ...fileParts];

      const geminiRequest = {
        systemInstruction: { parts: [{ text: strictInstruction }] },
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.25,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 16384,
        },
      };

      const geminiUrl =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiResp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiRequest),
      });

      const outText = await geminiResp.text();

      if (!geminiResp.ok) {
        return new Response(JSON.stringify({ error: `Gemini error (${geminiResp.status}): ${outText}` }), {
          status: geminiResp.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let geminiJson;
      try {
        geminiJson = JSON.parse(outText);
      } catch {
        return new Response(JSON.stringify({ error: "Gemini returned non-JSON", raw: outText }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const text = extractTextFromGemini(geminiJson);
      if (!text) {
        return new Response(JSON.stringify({ error: "Empty response from Gemini", raw: geminiJson }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: `Worker error: ${e?.message || String(e)}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
