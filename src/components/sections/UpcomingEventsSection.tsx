import React, { useEffect } from 'react'
import { useEventStore } from '@src/stores/eventStore'

const UpcomingEventsSection: React.FC = () => {
    const { events, loading, error, fetchEvents } = useEventStore()

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    // Filtrar solo eventos públicos y activos
    const upcomingEvents = events
        .filter(event => event.visibility === 'public' && event.status === 'active')
        .slice(0, 6) // Mostrar máximo 6 eventos

    // Función para formatear la fecha
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        } catch {
            return dateString
        }
    }

    // Función para obtener emoji basado en palabras clave del título o descripción
    const getEventIcon = (title: string, description: string) => {
        const text = `${title} ${description}`.toLowerCase()
        
        if (text.includes('concierto') || text.includes('música') || text.includes('rock') || text.includes('banda')) return '🎤'
        if (text.includes('cine') || text.includes('película') || text.includes('film')) return '🎬'
        if (text.includes('arte') || text.includes('pintura') || text.includes('taller') || text.includes('dibujo')) return '🎨'
        if (text.includes('deporte') || text.includes('fútbol') || text.includes('basketball')) return '⚽'
        if (text.includes('comida') || text.includes('gastronomía') || text.includes('cocina')) return '🍽️'
        if (text.includes('teatro') || text.includes('obra') || text.includes('drama')) return '🎭'
        if (text.includes('baile') || text.includes('danza') || text.includes('dance')) return '💃'
        if (text.includes('festival') || text.includes('feria')) return '🎪'
        if (text.includes('conferencia') || text.includes('charla') || text.includes('seminario')) return '🎯'
        if (text.includes('exposición') || text.includes('museo') || text.includes('galería')) return '🖼️'
        
        return '📅' // Icono por defecto
    }

    if (loading) {
        return (
            <aside className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/20 p-4 md:p-6 lg:order-last border dark:border-gray-700">
                <h3 className="text-lg md:text-xl font-bold mb-4 text-center lg:text-left text-gray-900 dark:text-gray-100">
                    Próximos Eventos
                </h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                            <div className="animate-pulse">
                                <div className="flex items-start space-x-3 mb-2">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="ml-11 space-y-2">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        )
    }

    if (error) {
        return (
            <aside className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/20 p-4 md:p-6 lg:order-last border dark:border-gray-700">
                <h3 className="text-lg md:text-xl font-bold mb-4 text-center lg:text-left text-gray-900 dark:text-gray-100">
                    Próximos Eventos
                </h3>
                <div className="text-center py-8">
                    <div className="text-red-500 dark:text-red-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Error al cargar eventos
                    </p>
                    <button 
                        onClick={fetchEvents}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </aside>
        )
    }

    return (
        <aside className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/20 p-4 md:p-6 lg:order-last border dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                    Próximos Eventos
                </h3>
                <button 
                    onClick={fetchEvents}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    title="Actualizar eventos"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
            
            {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-500 mb-3">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM14 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM6 9h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        No hay eventos próximos disponibles
                    </p>
                    <a 
                        href="/create-event" 
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Crear evento
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-start space-x-3 mb-2">
                                <span className="text-2xl group-hover:scale-110 transition-transform">
                                    {getEventIcon(event.title, event.description)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            event.visibility === 'public' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                        }`}>
                                            {event.visibility === 'public' ? 'Público' : 'Privado'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-11 space-y-1">
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">📅</span> {formatDate(event.date)}
                                    {event.time && (
                                        <span> a las {event.time}</span>
                                    )}
                                </p>
                                {(event.city || event.country) && (
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">📍</span> {[event.city, event.country].filter(Boolean).join(', ')}
                                    </p>
                                )}
                                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                                    {event.description}
                                </p>
                                {event.link && (
                                    <a 
                                        href={event.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Ver más detalles
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {events.length > 6 && (
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
                            <a 
                                href="/explore" 
                                className="inline-flex items-center px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Ver todos los eventos
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            )}
        </aside>
    )
}

export default UpcomingEventsSection
