import React from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'
import { t } from '@src/i18n/config.i18n'

interface AddFavoriteProps {
    eventId: number
}

const AddFavorite: React.FC<AddFavoriteProps> = ({ eventId }) => {
    const { addFavorite, loading: eventLoading, error: eventError } = useEventStore()
    const { token } = useAuthStore()

    const handleAddFavorite = async () => {
        if (!token) return
        await addFavorite(eventId, token)
    }

    return (
        <>
            <button
                onClick={handleAddFavorite}
                disabled={eventLoading}
                className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/70 transition-colors"
            >
                {t('page.favorites.add')}
            </button>
            {eventError && <p className="text-red-500 text-sm">{eventError}</p>}
        </>
    )
}

export default AddFavorite
