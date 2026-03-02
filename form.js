'use strict';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    // Adjust the API endpoint according to the Gemini API documentation
    const apiUrl = 'https://api.gemini.com/v1/some_endpoint';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response('Error fetching data from Gemini API: ' + err.message, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}
