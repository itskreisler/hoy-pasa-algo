import React, { useEffect, useState } from 'react'
import { useEventStore, type Event } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'
import EditEventModal from './EditEventModal'
import DeleteEventModal from './DeleteEventModal'

const EventsTab: React.FC = () => {
    const { myEvents, myEventsLoading, fetchMyEvents } = useEventStore()
    const { token } = useAuthStore()
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    useEffect(() => {
        if (token) {
            fetchMyEvents(token)
        }
    }, [token, fetchMyEvents])

    const handleRefresh = () => {
        if (token) {
            fetchMyEvents(token)
        }
    }

    const handleEdit = (event: Event) => {
        setSelectedEvent(event)
        setEditModalOpen(true)
    }

    const handleDelete = (event: Event) => {
        setSelectedEvent(event)
        setDeleteModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM14 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM6 9h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                        </svg>
                        Mis Eventos ({myEvents.length})
                    </h3>
                    <button 
                        onClick={handleRefresh}
                        disabled={myEventsLoading}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {myEventsLoading ? 'Cargando...' : 'Actualizar'}
                    </button>
                </div>
                
                {myEventsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-20 rounded-lg"></div>
                        ))}
                    </div>
                ) : myEvents.length > 0 ? (
                    <div className="space-y-4">
                        {myEvents.map(event => (
                            <div key={event.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{event.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM14 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM6 9h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                                                </svg>
                                                {event.date}
                                            </span>
                                            {event.time && (
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {event.time}
                                                </span>
                                            )}
                                            {(event.city || event.country) && (
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {[event.city, event.country].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            event.status === 'active' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                                        }`}>
                                            {event.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            event.visibility === 'public' 
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                        }`}>
                                            {event.visibility}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => handleEdit(event)} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(event)} className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors">
                                            Eliminar
                                        </button>
                                        {event.link && (
                                            <a 
                                                href={event.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                                            >
                                                Ver enlace
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM14 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM6 9h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No tienes eventos creados</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Comienza creando tu primer evento para compartir con la comunidad</p>
                        <a href="/create-event" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Crear mi primer evento
                        </a>
                    </div>
                )}
            </div>
            <EditEventModal event={selectedEvent} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
            <DeleteEventModal event={selectedEvent} isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
        </div>
    )
}

export default EventsTab
