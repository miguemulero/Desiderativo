// notebooklm-content.js
console.log("✅ notebooklm-content.js INYECTADO", window.location.href);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📩 Mensaje recibido en notebooklm-content.js:", request.type);
  
  if (request.type === "NBLM_START") {
    console.log("🚀 Iniciando envío a NotebookLM");
    
    // Responder inmediatamente
    sendResponse({ ok: true });
    
    // Ejecutar de forma asíncrona
    enviarPromptNotebookLM(request.protocoloText, request.draftId);
  }
  
  return true;
});

async function enviarPromptNotebookLM(text, draftId) {
  console.log("🔍 Buscando chatbox en NotebookLM...");
  
  const selectors = [
    'div[contenteditable="true"]',
    'textarea[placeholder*="Ask"]',
    'textarea[placeholder*="Type"]',
    'textarea',
    'input[type="text"]'
  ];
  
  let box = null;
  let retries = 0;
  
  while (!box && retries < 10) {
    for (let sel of selectors) {
      const elements = document.querySelectorAll(sel);
      for (let elem of elements) {
        if (elem.offsetParent !== null && !elem.disabled && !elem.readOnly) {
          box = elem;
          break;
        }
      }
      if (box) break;
    }
    
    if (!box) {
      await new Promise(r => setTimeout(r, 500));
      retries++;
    }
  }
  
  if (!box) {
    alert("❌ No se encontró el chatbox de NotebookLM. ¿Seguro que la página está completamente cargada?");
    console.error("❌ No se encontró chatbox después de", retries, "intentos");
    return;
  }

  console.log("✅ Chatbox encontrado:", box.tagName, box);

  // Guarda una marca del prompt enviado para NO capturarlo después
  const promptSent = text.substring(0, 100);
  
  // Limpia y pega el texto
  if (box.tagName === "TEXTAREA" || box.tagName === "INPUT") {
    box.value = "";
    box.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise(r => setTimeout(r, 100));
    box.value = text;
    box.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (box.isContentEditable) {
    box.innerText = "";
    box.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise(r => setTimeout(r, 100));
    box.innerText = text;
    box.dispatchEvent(new Event("input", { bubbles: true }));
  }
  
  box.focus();
  await new Promise(r => setTimeout(r, 300));

  console.log("📤 Enviando prompt a NotebookLM...");
  
  // Intenta enviar con Enter
  box.dispatchEvent(new KeyboardEvent("keydown", { 
    key: "Enter", 
    code: "Enter", 
    keyCode: 13, 
    which: 13,
    bubbles: true,
    cancelable: true
  }));

  // Esperar 2 segundos antes de empezar a monitorear
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("👀 Iniciando monitoreo de respuesta...");
  iniciarMonitoreo(draftId, promptSent);
}

function iniciarMonitoreo(draftId, promptSent) {
  let lastText = "";
  let checkTicks = 0;
  let iterationCount = 0;

  const interval = setInterval(() => {
    iterationCount++;
    
    // Timeout después de 5 minutos
    if (iterationCount > 272) {
      clearInterval(interval);
      console.error("⏱️ Timeout: No se detectó 'FIN DEL INFORME' después de 5 minutos");
      alert("Timeout: NotebookLM no respondió en el tiempo esperado");
      return;
    }

    // Selectores actualizados para NotebookLM
    const blocks = document.querySelectorAll([
      'div[data-message-author-role="model"]',
      'div[class*="response"]',
      'div[class*="message"]',
      'div[class*="answer"]',
      'article',
      'section',
      '[role="article"]',
      'div.markdown-content',
      'div[class*="chat"]',
      'div[class*="conversation"]'
    ].join(','));

    if (iterationCount % 10 === 0) {
      console.log(`[Monitoreo #${iterationCount}] Bloques encontrados:`, blocks.length);
    }

    let matchBlock = null;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (!block.innerText) continue;
      
      const txt = block.innerText.trim();
      
      // Ignorar bloques que contengan el prompt original
      if (txt.includes(promptSent)) {
        continue;
      }
      
      // Buscar "FIN DEL INFORME"
      if (
        txt.toUpperCase().includes("FIN DEL INFORME") ||
        txt.toUpperCase().includes("FIN DEL ANÁLISIS")
      ) {
        matchBlock = block;
        console.log(`✅ [Monitoreo #${iterationCount}] ¡Bloque ${i} contiene "FIN DEL INFORME"!`);
        break;
      }
    }

    if (!matchBlock) {
      return;
    }

    const currentText = matchBlock.innerText.trim();
    
    // Verificar que el texto sea significativamente diferente del prompt
    if (currentText.length < 200) {
      console.log(`⚠️ [Monitoreo #${iterationCount}] Texto muy corto (${currentText.length} chars), esperando...`);
      return;
    }

    if (currentText === lastText) {
      checkTicks++;
      console.log(`⏳ [Monitoreo #${iterationCount}] Texto estable (tick ${checkTicks}/3)`);
      
      if (checkTicks >= 3) {
        clearInterval(interval);
        console.log("✅ Respuesta completa detectada. Enviando al formulario...");
        console.log("📝 Texto capturado (primeros 500 chars):", currentText.substring(0, 500));
        comunicarFinal(draftId, currentText);
      }
    } else {
      lastText = currentText;
      checkTicks = 0;
      console.log(`🔄 [Monitoreo #${iterationCount}] Texto actualizado (${currentText.length} caracteres)`);
    }
  }, 1100);
}

function comunicarFinal(draftId, text) {
  console.log("📤 Enviando reporte final a background.js");
  
  try {
    chrome.runtime.sendMessage({
      type: "NBLM_REPORT_FINAL",
      draftId: draftId,
      reportText: text
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("⚠️ No se pudo confirmar envío a background:", chrome.runtime.lastError.message);
      } else {
        console.log("✅ Mensaje enviado exitosamente a background.js");
      }
    });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
  }
}