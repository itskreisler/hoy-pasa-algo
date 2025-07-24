import React from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { NavSkeleton } from '@src/components/ui'

export const DesktopNav: React.FC = () => {
    const { isAuthenticated, loading } = useAuthStore()

    // Mostrar skeleton mientras carga el estado de autenticación
    if (loading) {
        return (
            <nav className="hidden md:block">
                <NavSkeleton />
            </nav>
        )
    }

    return (
        <nav className="hidden md:block">
            <ul className="flex items-center space-x-6 lg:space-x-8">
                <li>
                    <a 
                        href="/" 
                        className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                    >
                        Inicio
                    </a>
                </li>
                <li>
                    <a
                        href="/explore"
                        className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                    >
                        Explorar
                    </a>
                </li>
                {isAuthenticated && (
                    <>
                        <li>
                            <a
                                href="/create-event"
                                className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                            >
                                Crear Evento
                            </a>
                        </li>
                        <li>
                            <a
                                href="/profile"
                                className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                            >
                                Perfil
                            </a>
                        </li>
                    </>
                )}
                {!isAuthenticated && (
                    <>
                        <li>
                            <a 
                                href="/sign-in" 
                                className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                            >
                                Iniciar Sesión
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/sign-up" 
                                className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-sm lg:text-base font-medium"
                            >
                                Registrarse
                            </a>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default DesktopNav
