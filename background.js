// background.js

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("form.html") });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "analizar-protocolo") {
    handleStart(request, sendResponse);
    return true; 
  }

  if (request.type === "NBLM_REPORT_FINAL") {
    handleFinish(request.draftId, request.reportText);
    return false;
  }
});

async function handleStart(request, sendResponse) {
  const tabs = await chrome.tabs.query({ url: "*://notebooklm.google.com/*" });
  if (tabs.length === 0) {
    sendResponse({ ok: false, error: "Abre NotebookLM primero." });
    return;
  }

  const draftId = "D" + Date.now();
  await chrome.storage.local.set({
    ["draft:" + draftId]: { protocoloText: request.protocoloText, finalReady: false }
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
  
  const formattedText = text + "\n\n---\n[INFORME GENERADO AUTOMÁTICAMENTE]";
  
  await chrome.storage.local.set({
    [key]: { ...(data[key] || {}), reportText: formattedText, finalReady: true }
  });

  // Abrir pestaña de resultados
  const url = chrome.runtime.getURL(`result.html?draftId=${draftId}`);
  chrome.tabs.create({ url, active: true });
}