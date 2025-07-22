import React, { useState, useEffect, useMemo } from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { t } from '@src/i18n/config.i18n'

const Explore: React.FC = () => {
    const { events, loading, error, fetchEvents } = useEventStore()
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const filteredEvents = useMemo(() => {
        return events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{event.title}</h2>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            event.visibility === 'public' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                                            event.visibility === 'private' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                            'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                        }`}>
                                            {event.visibility}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 h-24 overflow-y-auto">{event.description}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        <strong>{t('page.explore.date')}</strong> {new Date(event.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 md:col-span-2 lg:col-span-3">
                            {t('page.explore.no_events_found')}
                        </p>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Explore
