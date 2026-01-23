// notebooklm-content.js
console.log("notebooklm-content.js INYECTADO", window.location.href);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "NBLM_START") {
    enviarPromptNotebookLM(request.protocoloText, request.draftId);
    sendResponse({ ok: true });
  }
  return true;
});

async function enviarPromptNotebookLM(text, draftId) {
  const selectors = [
    'textarea',
    'div[contenteditable="true"]',
    'input[type="text"]'
  ];
  let box = null;
  for (let sel of selectors) {
    box = document.querySelector(sel);
    if (box && box.offsetParent !== null) break;
  }
  let retries = 0;
  while (!box && retries < 8) {
    await new Promise(r => setTimeout(r, 400));
    for (let sel of selectors) {
      box = document.querySelector(sel);
      if (box && box.offsetParent !== null) break;
    }
    retries++;
  }
  if (!box) {
    alert("No se encontró el chatbox de NotebookLM. ¿Seguro que la página está completamente cargada?");
    return;
  }

  // Limpia y pega el texto SOLO
  if (box.tagName === "TEXTAREA" || box.tagName === "INPUT") {
    box.value = "";
    box.dispatchEvent(new Event("input", { bubbles: true }));
    box.value = text;
    box.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (box.isContentEditable) {
    box.innerText = "";
    box.dispatchEvent(new Event("input", { bubbles: true }));
    box.innerText = text;
    box.dispatchEvent(new Event("input", { bubbles: true }));
  }
  box.focus();
  await new Promise(r => setTimeout(r, 200));

  // SOLO este evento (como antes, sin disparar keypress/keyUp innecesarios)
  box.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));

  iniciarMonitoreo(draftId);
}

// El resto se mantiene igual para monitoreo y reporte final
function iniciarMonitoreo(draftId) {
  let lastText = "";
  let checkTicks = 0;

  const interval = setInterval(() => {
    const blocks = document.querySelectorAll(
      '.response-text, [role="article"], .markdown-content, div[data-testid], article, section, div[class]'
    );
    let matchBlock = null;

    for (const block of blocks) {
      if (!block.innerText) continue;
      const txt = block.innerText.trim();
      if (
        txt.toUpperCase().includes("FIN DEL INFORME") ||
        txt.toUpperCase().includes("FIN DEL ANÁLISIS") ||
        txt.toUpperCase().includes("CORDIALMENTE")
      ) {
        matchBlock = block;
      }
    }
    if (!matchBlock) return;

    const currentText = matchBlock.innerText.trim();
    if (currentText === lastText) {
      checkTicks++;
      if (checkTicks >= 2) {
        clearInterval(interval);
        comunicarFinal(draftId, currentText);
      }
    } else {
      lastText = currentText;
      checkTicks = 0;
    }
  }, 1100);
}

function comunicarFinal(draftId, text) {
  chrome.runtime.sendMessage({
    type: "NBLM_REPORT_FINAL",
    draftId: draftId,
    reportText: text
  }, (response) => {
    if (chrome.runtime.lastError) {
      setTimeout(() => comunicarFinal(draftId, text), 1000);
    }
  });
}