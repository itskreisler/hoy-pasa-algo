import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ENDPOINTS } from '@src/config/api'

// Interfaces TypeScript
interface User {
    id: string
    username: string
    email: string
    full_name: string
    rol: 'user' | 'admin'
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null

    // Actions
    login: (email: string, password: string) => Promise<void>
    register: (userData: RegisterData) => Promise<void>
    logout: () => void
    clearError: () => void
    checkAuth: () => Promise<void>
}

interface RegisterData {
    email: string
    password: string
    full_name?: string
    username?: string
    birth_date?: string
    gener?: 'M' | 'F'
    rol?: 'user' | 'admin'
}

interface ApiResponse<T = any> {
    type: 'success' | 'error'
    message: string
    data?: T
}

interface AuthData {
    user: User
    token: string
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (email: string, password: string) => {
                try {
                    set({ loading: true, error: null })

                    const response = await fetch(ENDPOINTS.auth.login, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    })

                    const result: ApiResponse<AuthData> = await response.json()

                    if (response.ok && result.data) {
                        set({
                            user: result.data.user,
                            token: result.data.token,
                            isAuthenticated: true,
                            loading: false,
                            error: null
                        })
                    } else {
                        throw new Error(result.message || 'Error en el login')
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        loading: false,
                        error: errorMessage
                    })
                    throw error
                }
            },

            register: async (userData: RegisterData) => {
                try {
                    set({ loading: true, error: null })

                    const response = await fetch(ENDPOINTS.auth.register, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })

                    const result: ApiResponse<AuthData> = await response.json()

                    if (response.ok && result.data) {
                        set({
                            user: result.data.user,
                            token: result.data.token,
                            isAuthenticated: true,
                            loading: false,
                            error: null
                        })
                    } else {
                        throw new Error(result.message || 'Error en el registro')
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        loading: false,
                        error: errorMessage
                    })
                    throw error
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loading: false,
                    error: null
                })
            },

            clearError: () => {
                set({ error: null })
            },

            checkAuth: async () => {
                const { token } = get()

                if (!token) {
                    return
                }

                try {
                    set({ loading: true })

                    const response = await fetch(ENDPOINTS.auth.me, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })

                    if (!response.ok) {
                        // Token inválido, limpiar estado
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            loading: false
                        })
                        return
                    }

                    const result: ApiResponse<User> = await response.json()

                    if (result.data) {
                        set({
                            user: result.data,
                            isAuthenticated: true,
                            loading: false
                        })
                    }
                } catch {
                    // En caso de error de red, mantener el estado actual
                    set({ loading: false })
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                // Verificar token después de la hidratación
                if (state?.token) {
                    state.checkAuth?.()
                }
            }
        }
    )
)
