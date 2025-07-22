import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { ProfileSkeleton } from '@src/components/ui'
import { t } from '@src/i18n/config.i18n'
import { 
    ProfileHeader, 
    ProfileSidebar, 
    OverviewTab, 
    EventsTab, 
    FavoritesTab, 
    SettingsTab 
} from './profile/index'

const Profile: React.FC = () => {
    const { user, isAuthenticated, loading, checkAuth } = useAuthStore()
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        // Verificar la autenticación al cargar el componente
        checkAuth()
    }, [checkAuth])

    // Función para renderizar el contenido del tab activo
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab user={user} />
            case 'events':
                return <EventsTab />
            case 'favorites':
                return <FavoritesTab />
            case 'settings':
                return <SettingsTab />
            default:
                return <OverviewTab user={user} />
        }
    }

    // Mostrar skeleton mientras carga o si no tenemos datos completos del usuario
    if (loading || (isAuthenticated && !user)) {
        return <ProfileSkeleton />
    }

    // Si no está autenticado (incluso si tenemos datos de usuario en caché)
    if (!isAuthenticated && !loading) {
        return (
            <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                            {t('page.profile.title')}
                        </h1>
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                {t('page.profile.you_must_be_logged_in')}
                            </p>
                            <div className="pt-4">
                                <a 
                                    href="/sign-in" 
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    {t('page.profile.sign_in')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    // Si llegamos aquí pero no tenemos usuario, algo está mal
    if (!user) {
        return (
            <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('page.profile.error_loading_profile')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('page.profile.could_not_load_user_info')}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {t('page.profile.reload_page')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-grow bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <ProfileHeader user={user} />

                {/* Layout Principal: Sidebar + Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Profile
