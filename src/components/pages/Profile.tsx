import React, { useEffect } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { ProfileSkeleton } from '@src/components/ui'
import { t } from '@src/i18n/config.i18n'

const Profile: React.FC = () => {
    const { user, token, isAuthenticated, loading, logout, checkAuth } = useAuthStore()

    useEffect(() => {
        // Verificar la autenticación al cargar el componente
        checkAuth()
    }, [checkAuth])

    const handleLogout = () => {
        logout()
        window.location.href = '/'
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
        <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-5xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                    {/* Header con avatar y botón de logout */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                {((user as any)?.user?.username || (user as any)?.user?.full_name || (user as any)?.user?.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {t('page.profile.title')}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {t('page.profile.account_info')}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {t('page.profile.log_out')}
                        </button>
                    </div>
                    
                    {/* Grid de información del perfil */}
                    <div className="space-y-8">
                        {/* Información Personal */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {t('page.profile.personal_information')}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Fila 1: Nombre de Usuario y Nombre Completo */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center">
                                    <div className="flex items-center space-x-3 w-full">
                                        <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('page.profile.username')}</p>
                                            <p className={`text-sm font-medium ${!(user as any)?.user?.username ? 'italic text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {(user as any)?.user?.username ? (user as any).user.username : t('page.profile.not_specified')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center">
                                    <div className="flex items-center space-x-3 w-full">
                                        <svg className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('page.profile.full_name')}</p>
                                            <p className={`text-sm font-medium ${!(user as any)?.user?.full_name ? 'italic text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {(user as any)?.user?.full_name ? (user as any).user.full_name : t('page.profile.not_specified')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Fila 2: Email (span completo) */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center md:col-span-2">
                                    <div className="flex items-center space-x-3 w-full">
                                        <svg className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('page.profile.email')}</p>
                                            <p className={`text-sm font-medium ${!(user as any)?.user?.email ? 'italic text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {(user as any)?.user?.email ? (user as any).user.email : t('page.profile.not_specified')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Información de Cuenta */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                {t('page.profile.account_information')}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Fila 1: ID, Rol, Estado */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center">
                                    <div className="flex items-center space-x-3 w-full">
                                        <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('page.profile.user_id')}</p>
                                            <p className="text-xs font-mono text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 px-2 py-1 rounded border truncate">
                                                {(user as any)?.user?.id || t('page.profile.not_available')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center">
                                    <div className="flex items-center space-x-3 w-full">
                                        <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('page.profile.role')}</p>
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${ 
                                                (user as any)?.user?.rol === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                            }`}>
                                                {(user as any)?.user?.rol === 'admin' ? t('page.profile.admin') : t('page.profile.user')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center">
                                    <div className="flex items-center space-x-3 w-full">
                                        <svg className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('page.profile.status')}</p>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full"></div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('page.profile.active')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Estado de la sesión */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('page.profile.session_status')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{t('page.profile.token')}:</p>
                                <p className="text-gray-900 dark:text-gray-100 font-mono text-xs break-all">
                                    {token ? `${token.substring(0, 30)}...` : t('page.profile.not_available')}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{t('page.profile.status')}:</p>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-400 dark:bg-green-500' : 'bg-red-400 dark:bg-red-500'}`}></div>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {isAuthenticated ? t('page.profile.authenticated') : t('page.profile.not_authenticated')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Profile
