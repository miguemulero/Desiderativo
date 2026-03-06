// URL pública del Worker (workers.dev o dominio custom)
export const WORKER_URL = "https://desiderativo-proxy.migue-mulero.workers.dev";

// Modelo fijado
export const GEMINI_MODEL = "gemini-2.5-flash";

// LocalStorage key del token
export const WORKER_TOKEN_STORAGE_KEY = "desiderativo_worker_access_token";

// Bibliografía (Gemini Files API fileIds) para adjuntar SIEMPRE al análisis.
// OJO: si quitas o cambias estos IDs en Gemini, el Worker fallará al resolverlos.
export const BIBLIOGRAFIA_FILES = [
  "files/sx8z883fd448",  // ANaLISIS_DE_LAS_RESPUESTAS_AL_CUESTIONAR.pdf
  "files/7w1gyfqjkp72",  // bullying.pdf
  "files/hrxrdmhp49hv",  // CASO JADE.pdf
  "files/0qgcgnydvcc8",  // CASOS.pdf
  "files/hwqelyy1l2ba",  // CD DIANA.pdf
  "files/8ngmft44byvr",  // CD Graciela Celener.pdf
  "files/1rsi50nq8clu",  // CD pulsiones y defensas en patologías desvalimiento.pdf
  "files/gl7ay2skq13f",  // criterios de interpretación.pdf
  "files/iv30eav88tni",  // Cuadro proye - Catexias positivas y negativas.pdf
  "files/u2mmmc39z9dg",  // Cuestionario desiderativo aplicado a niños2.pdf
  "files/iddnbkcevyww",  // Cuestionario desiderativo-Sneiderman3.pdf
  "files/fgqxehf8xx55",  // Indicadores-Psicopatologicos - CD.pdf
  "files/4abrxt47sqxg",  // niños latentes.pdf
  "files/iau8g20l0mdc",  // Ocampo Arzeno - CD.pdf
  "files/lknb4hybbw6a",  // O_questionario_desiderativo_fundamentos.pdf
  "files/rjl1r8pux2mm",  // Preconsciente y su relación con el lenguaje.pdf
  "files/swbkkonmnvip",  // Psicodiagnostico Clinico 93-117.pdf
  "files/gvh0x372su95",  // Sneiderman_2011-Cuestionario.pdf
  "files/7ce8utmwh0jq",  // TEORÍA, TÉCNICA Y APLICACIÓN.pdf
  "files/jsu5rk4g3gvw",  // Una contribución a la interpretación del Cuestionario Desiderativo.pdf
  "files/f12bscbw3ysu",  // Vinculo hostil.pdf
];
