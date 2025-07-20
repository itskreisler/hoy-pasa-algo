import React from 'react'
import { t } from '@src/i18n/config.i18n'
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
                        {t('nav.home')}
                    </a>
                </li>
                <li>
                    <a
                        href="/explore"
                        className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                    >
                        {t('nav.explore')}
                    </a>
                </li>
                {isAuthenticated && (
                    <>
                        <li>
                            <a
                                href="/create-event"
                                className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                            >
                                {t('nav.create_event')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/profile"
                                className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors text-sm lg:text-base font-medium"
                            >
                                {t('nav.profile')}
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
                                {t('nav.login')}
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/sign-up" 
                                className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-sm lg:text-base font-medium"
                            >
                                {t('nav.singup')}
                            </a>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default DesktopNav
