// Improved version of notebooklm-content.js

// Function to monitor chatbox and avoid capturing sent text
function monitorChatbox() {
    const chatbox = document.querySelector('#chatbox');
    let lastSentText = '';
    const logs = [];
    let stabilityChecks = 0;

    // Function to track prompts and logging
    function trackPrompt(text) {
        if (text !== lastSentText) {
            logs.push(`Prompt sent: ${text} at ${new Date().toISOString()}`);
            lastSentText = text;
        }
    }

    // Stability check function
    function stabilityCheck() {
        stabilityChecks++;
        if (stabilityChecks <= 3) {
            // Perform stability check... (implementation depends on requirements)
            logs.push(`Stability check ${stabilityChecks} performed at ${new Date().toISOString()}`);
        } else {
            // Once stability checks are done, send report
            sendFinalReport();
        }
    }

    // Timeout function after 5 minutes
    setTimeout(() => {
        logs.push(`Timeout after 5 minutes at ${new Date().toISOString()}`);
        sendFinalReport();
    }, 300000);

    // Monitor chatbox for changes
    chatbox.addEventListener('input', function(event) {
        const currentText = event.target.value;
        trackPrompt(currentText);
    });

    function sendFinalReport() {
        // Logic to send final report based on logs...
        console.log('Final report sent:', logs);
    }
}

// Initialize the monitoring
monitorChatbox();