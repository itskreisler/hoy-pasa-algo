import React, { useEffect, useRef } from 'react'
import { useEventStore } from '@src/stores/eventStore'

interface CarouselProps {
    className?: string
}

const Carousel: React.FC<CarouselProps> = ({ className = '' }) => {
    const carouselRef = useRef<HTMLDivElement>(null)
    const { events, loading, error, fetchEvents } = useEventStore()
    
    // Filtrar eventos que tienen imagen
    const eventsWithImages = events.filter(event => event.image_url && event.image_url.trim() !== '')

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    useEffect(() => {
        const carouselContainer = carouselRef.current
        if (!carouselContainer) return

        // Solo clonar elementos si hay contenido para clonar
        const items = carouselContainer.querySelectorAll('.carousel-item')
        if (items.length === 0) return

        // Limpiar elementos clonados previos
        const allItems = Array.from(items)
        const originalCount = eventsWithImages.length > 0 ? eventsWithImages.length : 4
        
        allItems.forEach((item, index) => {
            if (index >= originalCount) {
                item.remove()
            }
        })

        // Clonar las imágenes para crear un bucle infinito
        const remainingItems = carouselContainer.querySelectorAll('.carousel-item')
        remainingItems.forEach((item) => {
            const clonedItem = item.cloneNode(true)
            carouselContainer.appendChild(clonedItem)
            carouselContainer.appendChild(clonedItem)
        })
    }, [eventsWithImages])

    if (loading) {
        return (
            <div className={`carousel mx-auto overflow-hidden w-full ${className}`}>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        )
    }

    if (error || eventsWithImages.length === 0) {
        // Fallback con eventos de ejemplo atractivos
        const fallbackEvents = [
            {
                id: 'fallback-1',
                title: '🎉 ¡Próximamente eventos increíbles!',
                description: 'Estamos preparando eventos únicos que no querrás perderte',
                gradient: 'from-blue-500 to-purple-600',
                icon: '🎊'
            },
            {
                id: 'fallback-2',
                title: '🌟 Descubre experiencias únicas',
                description: 'Conéctate con tu comunidad y vive momentos inolvidables',
                gradient: 'from-green-500 to-teal-600',
                icon: '✨'
            },
            {
                id: 'fallback-3',
                title: '🚀 Mantente conectado',
                description: 'No te pierdas las últimas actualizaciones y eventos especiales',
                gradient: 'from-orange-500 to-red-600',
                icon: '🔥'
            },
            {
                id: 'fallback-4',
                title: '💫 Crea recuerdos increíbles',
                description: 'Cada evento es una oportunidad para nuevas aventuras',
                gradient: 'from-pink-500 to-rose-600',
                icon: '🎈'
            }
        ]

        return (
            <>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes carousel {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-400%);
                            }
                        }

                        /* Estilos para PC */
                        @media (min-width: 1024px) {
                            @keyframes carousel {
                                0% {
                                    transform: translateX(0);
                                }
                                100% {
                                    transform: translateX(-200%);
                                }
                            }
                        }

                        /* Estilos para tableta */
                        @media (min-width: 768px) and (max-width: 1023px) {
                            @keyframes carousel {
                                0% {
                                    transform: translateX(0);
                                }
                                100% {
                                    transform: translateX(-300%);
                                }
                            }
                        }

                        /* Estilos para móvil */
                        @media (max-width: 767px) {
                            @keyframes carousel {
                                0% {
                                    transform: translateX(0);
                                }
                                100% {
                                    transform: translateX(-400%);
                                }
                            }
                        }

                        .carousel-container:hover {
                            animation-play-state: paused;
                        }
                    `
                }} />
                <div className={`carousel mx-auto overflow-hidden w-full ${className}`}>
                    <div 
                        ref={carouselRef}
                        className="carousel-container flex"
                        style={{
                            animation: 'carousel 45s infinite linear'
                        }}
                    >
                        {fallbackEvents.map((item) => (
                            <div key={item.id} className="carousel-item relative px-2 flex-shrink-0 w-full lg:w-1/3 md:w-1/2">
                                <div className={`w-full aspect-video bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg`}>
                                    {/* Elementos decorativos de fondo */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-4 right-4 text-6xl opacity-50">{item.icon}</div>
                                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full blur-xl"></div>
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-3xl opacity-20"></div>
                                    </div>
                                    
                                    {/* Contenido principal */}
                                    <div className="text-center px-6 z-10 relative">
                                        <div className="text-4xl mb-3">{item.icon}</div>
                                        <h3 className="text-white font-bold text-sm lg:text-base drop-shadow-lg mb-2 leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-white text-xs opacity-90 drop-shadow-lg leading-relaxed">
                                            {item.description}
                                        </p>
                                        <div className="mt-3 inline-flex items-center text-xs text-white bg-black bg-opacity-40 dark:bg-white dark:bg-opacity-30 dark:text-gray-900 px-3 py-1 rounded-full backdrop-blur-sm font-medium">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Muy pronto</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes carousel {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-${eventsWithImages.length * 100}%);
                        }
                    }

                    /* Estilos para PC */
                    @media (min-width: 1024px) {
                        @keyframes carousel {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-${Math.ceil(eventsWithImages.length / 3) * 100}%);
                            }
                        }
                    }

                    /* Estilos para tableta */
                    @media (min-width: 768px) and (max-width: 1023px) {
                        @keyframes carousel {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-${Math.ceil(eventsWithImages.length / 2) * 100}%);
                            }
                        }
                    }

                    /* Estilos para móvil */
                    @media (max-width: 767px) {
                        @keyframes carousel {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-${eventsWithImages.length * 100}%);
                            }
                        }
                    }

                    .carousel-container:hover {
                        animation-play-state: paused;
                    }
                `
            }} />
            <div className={`carousel mx-auto overflow-hidden w-full ${className}`}>
                <div 
                    ref={carouselRef}
                    className="carousel-container flex"
                    style={{
                        animation: 'carousel 50s infinite linear'
                    }}
                >
                    {eventsWithImages.map((event) => (
                        <div key={event.id} className="carousel-item relative px-2 flex-shrink-0 w-full lg:w-1/3 md:w-1/2">
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full aspect-video object-cover rounded-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent) {
                                        parent.innerHTML = `
                                            <div class="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                                                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        `
                                    }
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center mx-2">
                                <div className="text-center px-4">
                                    <h3 className="text-white font-bold text-sm lg:text-base drop-shadow-lg mb-1 line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <p className="text-white text-xs opacity-90 drop-shadow-lg line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-center mt-2 text-xs text-white opacity-80">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Carousel
