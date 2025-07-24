import React, { useState, useEffect, useMemo } from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { t } from '@src/i18n/config.i18n'
import { Modal, EventDetails } from '@src/components/ui'

const Explore: React.FC = () => {
    const { events, loading, error, fetchEvents } = useEventStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const openModal = (event: any) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedEvent(null)
    }

    const filteredEvents = useMemo(() => {
        return events.filter(event =>
            event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [events, searchTerm])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <main className="flex-grow px-4 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
                    {t('page.explore.title')}
                </h1>

                <div className="mb-8 max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder={t('page.explore.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-full shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div 
                                key={event.id} 
                                onClick={() => openModal(event)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 flex flex-col sm:flex-row cursor-pointer group"
                            >
                                {/* Sección de imagen - solo si existe */}
                                {event.image_url && (
                                    <div className="w-full h-32 sm:w-20 sm:h-auto md:w-24 bg-gray-100 dark:bg-gray-700 relative flex-shrink-0 sm:min-h-full">
                                        <img 
                                            src={event.image_url} 
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.style.display = 'none'
                                                const parent = target.parentElement
                                                if (parent) {
                                                    parent.innerHTML = `
                                                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                                                            <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                        </div>
                                                    `
                                                }
                                            }}
                                        />
                                        
                                        {/* Badge de visibilidad */}
                                        <div className="absolute top-1 right-1">
                                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded backdrop-blur-sm ${
                                                event.visibility === 'public' ? 'bg-green-100/90 text-green-700 dark:bg-green-900/80 dark:text-green-200' :
                                                event.visibility === 'private' ? 'bg-yellow-100/90 text-yellow-700 dark:bg-yellow-900/80 dark:text-yellow-200' :
                                                'bg-red-100/90 text-red-700 dark:bg-red-900/80 dark:text-red-200'
                                            }`}>
                                                {event.visibility.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Contenido al lado de la imagen */}
                                <div className="flex-1 flex flex-col justify-between p-3">
                                    {/* Header con título y badge */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-sm flex-grow mr-2">
                                            {event.title}
                                        </h2>
                                        {!event.image_url && (
                                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded flex-shrink-0 ${
                                                event.visibility === 'public' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' :
                                                event.visibility === 'private' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
                                            }`}>
                                                {event.visibility.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Descripción */}
                                    <div className="flex-1 mb-2">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3">
                                            {event.description}
                                        </p>
                                    </div>
                                    
                                    {/* Footer con información */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="truncate text-xs">{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            
                                            {(event.city || event.country) && (
                                                <div className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="truncate max-w-16 sm:max-w-20 text-xs">{[event.city, event.country].filter(Boolean).join(', ')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status y botón */}
                                        <div className="flex items-center justify-between sm:justify-end space-x-2">
                                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                                                event.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300' :
                                                event.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' :
                                                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                                {event.status.toUpperCase()}
                                            </span>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                                {t('page.explore.no_events_found')}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Intenta con términos de búsqueda diferentes
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal reutilizable */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal}
                maxWidth="4xl"
            >
                {selectedEvent && <EventDetails event={selectedEvent} />}
            </Modal>
        </main>
    )
}

export default Explore
