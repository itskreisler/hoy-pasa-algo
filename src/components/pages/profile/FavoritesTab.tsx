import React, { useEffect } from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'
import RemoveFavorite from './RemoveFavorite'

const FavoritesTab: React.FC = () => {
    const { favoriteEvents, favoritesLoading, fetchFavoriteEvents } = useEventStore()
    const { token } = useAuthStore()

    useEffect(() => {
        if (token) {
            fetchFavoriteEvents(token)
        }
    }, [token, fetchFavoriteEvents])

    const handleRefresh = () => {
        if (token) {
            fetchFavoriteEvents(token)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Eventos Favoritos ({favoriteEvents.length})
                    </h3>
                    <button
                        onClick={handleRefresh}
                        disabled={favoritesLoading}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {favoritesLoading ? 'Cargando...' : 'Actualizar'}
                    </button>
                </div>

                {favoritesLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-20 rounded-lg"></div>
                        ))}
                    </div>
                ) : favoriteEvents.length > 0 ? (
                    <div className="space-y-4">
                        {favoriteEvents.map(event => (
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
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RemoveFavorite eventId={event.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No tienes eventos marcados como favoritos</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                            Explora eventos y marca tus favoritos para encontrarlos fácilmente aquí
                        </p>
                        <a href="/explore" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Explorar eventos
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FavoritesTab
