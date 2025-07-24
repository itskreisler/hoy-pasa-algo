// Configuración central de la API
export const API_BASE_URL = 'http://localhost:5000'
export const API_VERSION = 'v1'

// URL completa de la API
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`

// Endpoints específicos
export const ENDPOINTS = {
    auth: {
        login: `${API_URL}/auth/login`,
        register: `${API_URL}/auth/register`,
        refresh: `${API_URL}/auth/refresh`,
        me: `${API_URL}/auth/me`
    },
    events: {
        base: `${API_URL}/events/`,
        myEvents: `${API_URL}/events/my-events`,
        favorites: `${API_URL}/events/favorites`
    },
    users: {
        stats: `${API_URL}/users/stats`
    }
} as const
