// Configuración de la API
const API_BASE_URL = 'http://localhost:5000'

// Interfaces
interface ApiResponse<T = any> {
    type: 'success' | 'error'
    message?: string
    data?: T
}

interface RegisterRequest {
    email: string
    password: string
    full_name?: string
    username?: string
    birth_date?: string
    gener?: 'M' | 'F'
    rol?: 'user' | 'admin'
}

interface User {
    id: string
    username: string
    email: string
    full_name: string
    rol: 'user' | 'admin'
}

interface AuthResponse {
    user: User
    token: string
}

// Función helper para hacer peticiones HTTP
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api/v1${endpoint}`

    const defaultHeaders = {
        'Content-Type': 'application/json'
    }

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    }

    try {
        const response = await fetch(url, config)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error('API Request Error:', error)
        throw error
    }
}

// Función helper para peticiones autenticadas
async function authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    })
}

// Funciones de autenticación
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })

    if (response.type === 'error') {
        throw new Error(response.message || 'Error al iniciar sesión')
    }

    if (!response.data) {
        throw new Error('No se recibieron datos del servidor')
    }

    return response.data
}

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    })

    if (response.type === 'error') {
        throw new Error(response.message || 'Error al registrarse')
    }

    if (!response.data) {
        throw new Error('No se recibieron datos del servidor')
    }

    return response.data
}

export const getCurrentUser = async (token: string): Promise<User> => {
    const response = await authenticatedRequest<User>('/auth/me', token)

    if (response.type === 'error') {
        throw new Error(response.message || 'Error al obtener usuario actual')
    }

    if (!response.data) {
        throw new Error('No se recibieron datos del servidor')
    }

    return response.data
}

export const logout = async (): Promise<void> => {
    await apiRequest('/auth/logout', {
        method: 'POST'
    })
}
