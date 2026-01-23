// Background service worker for the Desiderativo Chrome extension

console.log('Desiderativo Assistant background service worker initialized');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Desiderativo Assistant installed');
    // Open welcome page or instructions
    chrome.tabs.create({
      url: 'https://notebooklm.google.com'
    });
  } else if (details.reason === 'update') {
    console.log('Desiderativo Assistant updated');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  
  if (request.action === 'openNotebookLM') {
    chrome.tabs.create({ url: 'https://notebooklm.google.com' });
    sendResponse({ success: true });
  }
  
  return true;
});

// Handle browser action click (if needed)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
});

// Store templates in chrome.storage for offline access
const templates = {
  basic: 'Plantilla Básica',
  detailed: 'Análisis Detallado',
  interpretation: 'Guía de Interpretación'
};

chrome.storage.local.set({ templates }, () => {
  console.log('Templates stored in local storage');
});
