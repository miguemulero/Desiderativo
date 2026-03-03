function findChatbox() {
    // Logic to find and return the chatbox element
    return document.querySelector('.chatbox-selector'); // Update with actual selector
}

function pasteInChatbox(text) {
    const chatbox = findChatbox();
    if (chatbox) {
        chatbox.value = text;
        const event = new Event('input', { bubbles: true });
        chatbox.dispatchEvent(event);
    }
}

function monitorResponse() {
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                const response = mutation.addedNodes[0];
                if (response && response.innerText.includes('FIN DEL INFORME')) {
                    saveToLocalStorage(response.innerText);
                    return;
                }
            }
        }
    });
    const chatbox = findChatbox();
    if (chatbox) {
        observer.observe(chatbox.parentNode, { childList: true });
    }
}

function processRequest() {
    const protocols = JSON.parse(localStorage.getItem('protocols')) || [];
    protocols.forEach((protocol) => {
        pasteInChatbox(protocol);
        // Delay between pasting requests if needed
    });
}

function saveToLocalStorage(response) {
    let storedResponses = JSON.parse(localStorage.getItem('responses')) || [];
    storedResponses.push(response);
    localStorage.setItem('responses', JSON.stringify(storedResponses));
}

// Example of starting the automation
monitorResponse();
processRequest();