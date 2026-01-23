// Content script for NotebookLM integration
console.log('Desiderativo Assistant content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'insertText') {
    insertTextIntoNotebookLM(request.text);
    sendResponse({ success: true });
  }
  return true;
});

// Function to insert text into NotebookLM
function insertTextIntoNotebookLM(text) {
  // Try to find the main text input area in NotebookLM
  // NotebookLM uses contenteditable divs for input
  const selectors = [
    '[contenteditable="true"]',
    'textarea',
    '[role="textbox"]',
    '.notebook-input',
    '[data-text-input]'
  ];

  let inputElement = null;
  for (const selector of selectors) {
    inputElement = document.querySelector(selector);
    if (inputElement) break;
  }

  if (inputElement) {
    // Insert the text
    if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
      inputElement.value = text;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // For contenteditable elements
      inputElement.textContent = text;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    showNotification('Contenido insertado en NotebookLM');
  } else {
    showNotification('No se pudo encontrar el área de texto. Por favor, pega manualmente (Ctrl+V).');
  }
}

// Helper function to show notifications
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = 'desiderativo-notification';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add visual indicator that extension is active
function addExtensionIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'desiderativo-indicator';
  indicator.innerHTML = '🎯 Desiderativo Assistant activo';
  document.body.appendChild(indicator);
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addExtensionIndicator);
} else {
  addExtensionIndicator();
}
