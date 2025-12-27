const isLocal = window.location.hostname === 'localhost';

const API_URL = isLocal 
    ? 'http://localhost:3000' 
    : 'https://loserland2025.tevaphilippe.fr';

const WS_URL = isLocal 
    ? 'ws://localhost:3000' 
    : 'wss://loserland2025.tevaphilippe.fr';