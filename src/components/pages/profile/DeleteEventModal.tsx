import React from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { t } from '@src/i18n/config.i18n'
import type { Event } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'

interface DeleteEventModalProps {
    event: Event | null
    isOpen: boolean
    onClose: () => void
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ event, isOpen, onClose }) => {
    const { deleteEvent, loading: eventLoading, error: eventError } = useEventStore()
    const { token } = useAuthStore()

    const handleDelete = async () => {
        if (!token || !event) {
            return
        }

        try {
            await deleteEvent(event.id, token)
            onClose()
        } catch {
            // error is handled by the store
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{t('page.delete_event.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t('page.delete_event.confirmation_message')} <strong>{event?.title}</strong>?
                </p>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                        {t('page.delete_event.form.cancel')}
                    </button>
                    <button onClick={handleDelete} disabled={eventLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50">
                        {eventLoading ? t('page.delete_event.form.deleting') : t('page.delete_event.form.delete_event')}
                    </button>
                </div>
                {eventError && <p className="text-red-500 text-sm text-center mt-4">{eventError}</p>}
            </div>
        </div>
    )
}

export default DeleteEventModal
