import React from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'

interface AddFavoriteProps {
    eventId: string
}

const AddFavorite: React.FC<AddFavoriteProps> = ({ eventId }) => {
    const { addFavorite, favoritesLoading, error: eventError } = useEventStore()
    const { token } = useAuthStore()

    const handleAddFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevenir que se abra el modal
        if (!token) return
        await addFavorite(eventId, token)
    }

    return (
        <>
            <button
                onClick={handleAddFavorite}
                disabled={favoritesLoading}
                className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/70 transition-colors"
            >
                Agregar
            </button>
            {eventError && <p className="text-red-500 text-sm">{eventError}</p>}
        </>
    )
}

export default AddFavorite
