// background.js

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("form.html") });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "analizar-protocolo") {
    handleStart(request, sender, sendResponse);
    return true; // Mantener el canal abierto para respuesta asíncrona
  }

  if (request.type === "NBLM_REPORT_FINAL") {
    handleFinish(request.draftId, request.reportText);
    return false;
  }
});

async function handleStart(request, sender, sendResponse) {
  try {
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

    // Enviar mensaje a NotebookLM
    await chrome.tabs.sendMessage(tabs[0].id, {
      type: "NBLM_START",
      draftId,
      protocoloText: request.protocoloText
    });

    sendResponse({ ok: true, draftId });
  } catch (error) {
    console.error("Error en handleStart:", error);
    sendResponse({ ok: false, error: "Error al iniciar el análisis" });
  }
}

async function handleFinish(draftId, text) {
  const key = "draft:" + draftId;
  
  try {
    const data = await chrome.storage.local.get(key);

    if (!data[key]) {
      console.error("No se encontró el draft:", draftId);
      return;
    }

    const formTabId = data[key].formTabId;

    // Verificar que la pestaña del formulario aún existe
    try {
      const tab = await chrome.tabs.get(formTabId);
      
      if (!tab) {
        console.warn("La pestaña del formulario ya no existe");
        return;
      }

      // Enviar el reporte al formulario original
      await chrome.tabs.sendMessage(formTabId, {
        type: "NBLM_REPORT_FINAL",
        reportText: text
      });
      
      console.log("✅ Reporte enviado correctamente al formulario");
      
    } catch (tabError) {
      // La pestaña fue cerrada o no responde
      console.warn("No se pudo enviar el mensaje al formulario:", tabError.message);
      
      // Intentar encontrar otra pestaña del formulario abierta
      try {
        const formTabs = await chrome.tabs.query({ url: chrome.runtime.getURL("form.html") });
        
        if (formTabs.length > 0) {
          await chrome.tabs.sendMessage(formTabs[0].id, {
            type: "NBLM_REPORT_FINAL",
            reportText: text
          });
          console.log("✅ Reporte enviado a otra pestaña del formulario");
        } else {
          console.warn("No hay pestañas del formulario abiertas");
        }
      } catch (fallbackError) {
        console.error("No se pudo enviar a ninguna pestaña del formulario");
      }
    }
  } catch (error) {
    console.error("Error en handleFinish:", error);
  } finally {
    // Limpiar storage siempre
    try {
      await chrome.storage.local.remove(key);
    } catch (cleanupError) {
      console.error("Error limpiando storage:", cleanupError);
    }
  }
}