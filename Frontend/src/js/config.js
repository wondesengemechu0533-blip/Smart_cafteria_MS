// API base URL — in production the frontend is served from the same origin
// as the backend, so we use a relative path.  In local development the
// frontend runs on a different port (e.g. 5500) and talks to the backend
// on port 5000.
window.__API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : location.origin;

window.__API_URL = window.__API_BASE + '/api/v1';
