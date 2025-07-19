import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useStore } from 'zustand'
enum Theme {
    Light = 'light',
    Dark = 'dark'
}
interface ThemeState {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

// Función para aplicar tema al DOM
const applyThemeToDOM = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
}

// Crear el store con persist
const themeStore = createStore<ThemeState>()(
    persist(
        (set, get) => ({
            theme: Theme.Dark, // Por defecto modo oscuro

            toggleTheme: () => {
                const newTheme = get().theme === Theme.Dark ? Theme.Light : Theme.Dark
                set({ theme: newTheme })
                applyThemeToDOM(newTheme)
            },

            setTheme: (theme: Theme) => {
                set({ theme })
                applyThemeToDOM(theme)
            }
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                // Aplicar tema después de la hidratación
                if (state) {
                    applyThemeToDOM(state.theme)
                }
            }
        }
    )
)

// Suscribirse a cambios para aplicar al DOM automáticamente
themeStore.subscribe((state) => {
    applyThemeToDOM(state.theme)
})

// Hook para usar en React
export const useThemeStore = () => useStore(themeStore)
