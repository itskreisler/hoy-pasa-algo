import React from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { t } from '@src/i18n/config.i18n'

const SettingsTab: React.FC = () => {
    const { token, isAuthenticated, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        window.location.href = '/'
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Configuración de Cuenta
                </h3>
                
                <div className="space-y-4">
                    {/* Información de Sesión */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Información de Sesión
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="text-gray-600 dark:text-gray-400 font-medium">{t('page.profile.token')}:</label>
                                <p className="text-gray-900 dark:text-gray-100 font-mono text-xs break-all mt-1 bg-white dark:bg-gray-800 p-2 rounded border">
                                    {token ? `${token.substring(0, 30)}...` : t('page.profile.not_available')}
                                </p>
                            </div>
                            <div>
                                <label className="text-gray-600 dark:text-gray-400 font-medium">{t('page.profile.status')}:</label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-400 dark:bg-green-500' : 'bg-red-400 dark:bg-red-500'}`}></div>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {isAuthenticated ? t('page.profile.authenticated') : t('page.profile.not_authenticated')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferencias */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                            </svg>
                            Preferencias
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Notificaciones por email</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Recibir notificaciones sobre eventos</p>
                                </div>
                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Perfil público</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Permitir que otros vean tu perfil</p>
                                </div>
                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Zona de Peligro */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                        <h4 className="font-medium text-red-900 dark:text-red-200 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Zona de Peligro
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                            Esta acción cerrará tu sesión y tendrás que iniciar sesión nuevamente.
                        </p>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {t('page.profile.log_out')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsTab
