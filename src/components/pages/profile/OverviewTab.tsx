import React from 'react'
import { t } from '@src/i18n/config.i18n'

interface OverviewTabProps {
    user: any
}

const OverviewTab: React.FC<OverviewTabProps> = ({ user }) => {
    return (
        <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('page.profile.personal_information')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('page.profile.username')}</label>
                        <p className="text-gray-900 dark:text-gray-100">{(user as any)?.user?.username || t('page.profile.not_specified')}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('page.profile.full_name')}</label>
                        <p className="text-gray-900 dark:text-gray-100">{(user as any)?.user?.full_name || t('page.profile.not_specified')}</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('page.profile.email')}</label>
                        <p className="text-gray-900 dark:text-gray-100">{(user as any)?.user?.email || t('page.profile.not_specified')}</p>
                    </div>
                </div>
            </div>

            {/* Información de Cuenta */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    {t('page.profile.account_information')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('page.profile.user_id')}</label>
                        <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{(user as any)?.user?.id || t('page.profile.not_available')}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('page.profile.role')}</label>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${ 
                            (user as any)?.user?.rol === 'admin' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                        }`}>
                            {(user as any)?.user?.rol === 'admin' ? t('page.profile.admin') : t('page.profile.user')}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('page.profile.status')}</label>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">{t('page.profile.active')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OverviewTab
