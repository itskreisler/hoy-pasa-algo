import React from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'
import { t } from '@src/i18n/config.i18n'

interface RemoveFavoriteProps {
    eventId: number
}

const RemoveFavorite: React.FC<RemoveFavoriteProps> = ({ eventId }) => {
    const { removeFavorite, loading: eventLoading, error: eventError } = useEventStore()
    const { token } = useAuthStore()

    const handleRemoveFavorite = async () => {
        if (!token) return
        await removeFavorite(eventId, token)
    }

    return (
        <>
            <button
                onClick={handleRemoveFavorite}
                disabled={eventLoading}
                className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
            >
                {t('page.favorites.remove')}
            </button>
            {eventError && <p className="text-red-500 text-sm">{eventError}</p>}
        </>
    )
}

export default RemoveFavorite
