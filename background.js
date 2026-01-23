// background.js

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("form.html") });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "analizar-protocolo") {
    handleStart(request, sender, sendResponse);
    return true;
  }

  if (request.type === "NBLM_REPORT_FINAL") {
    handleFinish(request.draftId, request.reportText);
    return false;
  }
});

async function handleStart(request, sender, sendResponse) {
  const tabs = await chrome.tabs.query({ url: "*://notebooklm.google.com/*" });
  
  if (tabs.length === 0) {
    sendResponse({ ok: false, error: "Cargar motor de análisis" });
    return;
  }

  const draftId = "D" + Date.now();
  const formTabId = sender.tab.id;

  // Guardar el tabId del formulario para enviarle el resultado después
  await chrome.storage.local.set({
    ["draft:" + draftId]: { 
      protocoloText: request.protocoloText, 
      formTabId: formTabId,
      finalReady: false 
    }
  });

  chrome.tabs.sendMessage(tabs[0].id, {
    type: "NBLM_START",
    draftId,
    protocoloText: request.protocoloText
  });

  sendResponse({ ok: true, draftId });
}

async function handleFinish(draftId, text) {
  const key = "draft:" + draftId;
  const data = await chrome.storage.local.get(key);

  if (!data[key]) {
    console.error("No se encontró el draft:", draftId);
    return;
  }

  const formTabId = data[key].formTabId;

  // Enviar el reporte al formulario original
  try {
    await chrome.tabs.sendMessage(formTabId, {
      type: "NBLM_REPORT_FINAL",
      reportText: text
    });
  } catch (error) {
    console.error("Error enviando mensaje al formulario:", error);
  }

  // Limpiar storage
  await chrome.storage.local.remove(key);
}