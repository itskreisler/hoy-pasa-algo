import React from 'react'
import { t } from '@src/i18n/config.i18n'

interface ProfileHeaderProps {
    user: any
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {((user as any)?.user?.username || (user as any)?.user?.full_name || (user as any)?.user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {t('page.profile.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bienvenido, {(user as any)?.user?.username || (user as any)?.user?.full_name || 'Usuario'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
