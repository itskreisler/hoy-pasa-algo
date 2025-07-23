import React, { useEffect } from 'react'
import { useStatsStore } from '@src/stores/statsStore'

interface Statistic {
    value: string
    label: string
    description: string
    icon: React.ReactNode
}

const StatisticsSection: React.FC = () => {
    const { stats, loading, error, fetchStats } = useStatsStore()

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    // Formatear números para mostrar
    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

    // Crear estadísticas desde la API
    const statistics: Statistic[] = [
        {
            value: stats ? formatNumber(stats.total_events) : '0',
            label: 'Eventos Creados',
            description: 'Y creciendo cada día',
            icon: (
                <svg className="w-8 h-8 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            value: stats ? formatNumber(stats.total_users) : '0',
            label: 'Usuarios Registrados',
            description: 'Comunidad activa',
            icon: (
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round" className='w-8 h-8 mb-2 mx-auto'><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
            )
        }
    ]

    if (error) {
        return (
            <section className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 py-8 md:py-12">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Error al cargar estadísticas
                    </h3>
                    <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reintentar
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 text-white py-8 md:py-12 relative overflow-hidden">
            {/* Patrón de fondo decorativo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        Nuestras Estadísticas
                    </h3>
                    <p className="text-blue-100 dark:text-blue-200 text-lg">
                        El crecimiento de nuestra comunidad
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <svg className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <p className="text-blue-100">Cargando estadísticas...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {statistics.map((stat, index) => (
                            <div
                                key={index}
                                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="text-center">
                                    <div className="text-blue-100 group-hover:text-white transition-colors">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-lg md:text-xl text-blue-100 dark:text-blue-200 font-semibold">
                                        {stat.label}
                                    </div>
                                    <div className="text-sm md:text-base text-blue-200 dark:text-blue-300 mt-2">
                                        {stat.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && (
                    <div className="text-center mt-8">
                        <button
                            onClick={fetchStats}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 hover:border-white/30"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar estadísticas
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default StatisticsSection
