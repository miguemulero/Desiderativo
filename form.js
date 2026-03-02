// Import the necessary libraries
import { Router } from 'itty-router';
import { handleRequest } from './geminiAPI';

// Create a new router instance
const router = Router();

// Define routes
router.get('/', (request) => {
    return new Response('Welcome to the Gemini API Cloudflare Worker!');
});

// Integrate with the Gemini API
router.get('/api/gemini', async (request) => {
    return await handleRequest(request);
});

// Fallback for undefined routes
router.all('*', () => new Response('404 Not Found', { status: 404 }));

// Export the function to handle incoming requests
addEventListener('fetch', event => {
    event.respondWith(router.handle(event.request));
});