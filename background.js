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
    sendResponse({ ok: true });
    return false;
  }
});

async function handleStart(request, sender, sendResponse) {
  try {
    const tabs = await chrome.tabs.query({ url: "*://notebooklm.google.com/*" });
    
    if (tabs.length === 0) {
      sendResponse({ ok: false, error: "Abre NotebookLM en otra pestaña primero" });
      return;
    }

    const draftId = "D" + Date.now();
    const formTabId = sender.tab.id;

    await chrome.storage.local.set({
      ["draft:" + draftId]: { 
        protocoloText: request.protocoloText, 
        formTabId: formTabId,
        finalReady: false 
      }
    });

    // Verificar que el content script esté listo
    try {
      await chrome.tabs.sendMessage(tabs[0].id, {
        type: "NBLM_START",
        draftId,
        protocoloText: request.protocoloText
      });
      
      sendResponse({ ok: true, draftId });
    } catch (error) {
      console.error("Error comunicando con NotebookLM:", error.message);
      sendResponse({ 
        ok: false, 
        error: "Se precisa cargar motor de análisis" 
      });
    }
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

    try {
      // Verificar que la pestaña existe
      await chrome.tabs.get(formTabId);
      
      // Enviar el reporte al formulario SIN esperar respuesta
      chrome.tabs.sendMessage(formTabId, {
        type: "NBLM_REPORT_FINAL",
        reportText: text
      }).catch(err => {
        console.warn("Error enviando mensaje al formulario:", err.message);
      });
      
      console.log("✅ Reporte enviado correctamente al formulario");
      
    } catch (tabError) {
      console.warn("La pestaña del formulario original no existe, buscando alternativa...");
      
      // Buscar otra pestaña del formulario abierta
      const formTabs = await chrome.tabs.query({ url: chrome.runtime.getURL("form.html") });
      
      if (formTabs.length > 0) {
        chrome.tabs.sendMessage(formTabs[0].id, {
          type: "NBLM_REPORT_FINAL",
          reportText: text
        }).catch(err => {
          console.warn("Error enviando mensaje a pestaña alternativa:", err.message);
        });
        console.log("✅ Reporte enviado a otra pestaña del formulario");
      } else {
        console.warn("⚠️ No hay pestañas del formulario abiertas para recibir el reporte");
      }
    }
  } catch (error) {
    console.error("Error en handleFinish:", error);
  } finally {
    // Limpiar storage
    try {
      await chrome.storage.local.remove(key);
    } catch (cleanupError) {
      console.error("Error limpiando storage:", cleanupError);
    }
  }
}