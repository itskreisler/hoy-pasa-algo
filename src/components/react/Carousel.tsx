import { useEventStore } from '@src/stores/eventStore'
import React, { useEffect, useRef } from 'react'

interface CarouselProps {
    className?: string
}

interface CarouselItem {
    id: string
    title: string
    description: string
    date: string
    status: string
    visibility: string
    image_url?: string
    user_id: string
    isPlaceholder?: boolean
    subtitle?: string
}

enum FillOrder {
    ASC = 'ASC',     // Eventos reales primero, luego frases
    DESC = 'DESC',   // Frases primero, luego eventos reales
    RANDOM = 'RANDOM' // Orden aleatorio mezclado
}

const Carousel: React.FC<CarouselProps> = ({ className = '' }) => {
    const carouselRef = useRef<HTMLDivElement>(null)
    const { events } = useEventStore()
    
    // Constante para controlar el orden del relleno
    // FillOrder.ASC = Eventos reales primero, luego frases
    // FillOrder.DESC = Frases primero, luego eventos reales
    // FillOrder.RANDOM = Orden aleatorio mezclado
    const FILL_ORDER: keyof typeof FillOrder = FillOrder.DESC
    
    // Frases atractivas para llenar el carrusel cuando hay pocos eventos
    const attractivePhrases = [
        { 
            title: '¡Descubre eventos increíbles!', 
            image: '/media/images/image.jpg',
            subtitle: 'Únete a nuestra comunidad',
            description: 'Crea y descubre eventos únicos'
        },
        { 
            title: 'Tu próxima aventura te espera', 
            image: '/media/images/image.jpg',
            subtitle: 'Explora nuevas experiencias',
            description: 'Conecta con personas afines'
        },
        { 
            title: 'Vive experiencias únicas', 
            image: '/media/images/image.jpg',
            subtitle: 'Momentos que perduran',
            description: 'Eventos que transforman vidas'
        },
        { 
            title: 'Conecta con tu comunidad', 
            image: '/media/images/image.jpg',
            subtitle: 'Construye relaciones',
            description: 'Encuentra tu tribu ideal'
        }
    ]
    
    // Combinar eventos reales con frases de relleno si es necesario
    const getDisplayItems = (): CarouselItem[] => {
        const realEvents: CarouselItem[] = [...events]
        const minItems = 4
        
        if (realEvents.length < minItems) {
            const needed = minItems - realEvents.length
            const fillItems: CarouselItem[] = attractivePhrases.slice(0, needed).map((phrase, index) => ({
                id: `placeholder-${index}`,
                title: phrase.title,
                description: phrase.description,
                date: new Date().toISOString(),
                status: 'active',
                visibility: 'public',
                image_url: phrase.image,
                user_id: 'system',
                isPlaceholder: true,
                subtitle: phrase.subtitle
            }))
            
            // Aplicar el orden según la constante FILL_ORDER
            if (FILL_ORDER === FillOrder.DESC) {
                // Frases primero, luego eventos reales
                return [...fillItems, ...realEvents]
            } else if (FILL_ORDER === FillOrder.RANDOM) {
                // Mezclar aleatoriamente eventos reales y frases
                const allItems = [...realEvents, ...fillItems]
                return allItems.sort(() => Math.random() - 0.5)
            } else {
                // Eventos reales primero, luego frases (orden original - ASC)
                return [...realEvents, ...fillItems]
            }
        }
        
        return realEvents
    }
    
    const displayItems = getDisplayItems()
    
    useEffect(() => {
        if (!events || events.length === 0) return
        console.log('object')
        const carouselContainer = carouselRef.current
        if (!carouselContainer) return

        const items = carouselContainer.querySelectorAll('.carousel-item')
        if (items.length === 0) return

        // Clonar las imágenes para crear un bucle infinito
        items.forEach((item) => {
            const clonedItem = item.cloneNode(true)
            carouselContainer.appendChild(clonedItem)
        })

        return () => {
            // Limpiar elementos clonados al desmontar
            const allItems = carouselContainer.querySelectorAll('.carousel-item')
            allItems.forEach((item, index) => {
                if (index >= displayItems.length) {
                    item.remove()
                }
            })
        }
    }, [displayItems])

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .carousel {
                        overflow: hidden;
                        width: 100%;
                    }

                    .carousel-container {
                        display: flex;
                        animation: carousel 30s infinite linear;
                    }

                    .carousel-container:hover {
                        animation-play-state: paused;
                    }

                    .carousel-item {
                        flex-shrink: 0;
                    }

                    .carousel-item:hover {
                        transform: translateY(-2px);
                        transition: transform 0.3s ease;
                    }

                    .carousel-item img {
                        filter: brightness(0.9) contrast(1.1);
                        transition: filter 0.3s ease;
                    }

                    .carousel-item:hover img {
                        filter: brightness(1) contrast(1.2);
                    }

                    @keyframes carousel {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-300%);
                        }
                    }

                    /* Estilos para PC */
                    @media (min-width: 1024px) {
                        .carousel-item {
                            width: 33.33%;
                        }

                        @keyframes carousel {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-100%);
                            }
                        }
                    }

                    /* Estilos para tableta */
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .carousel-item {
                            width: 50%;
                        }

                        @keyframes carousel {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-150%);
                            }
                        }
                    }

                    /* Estilos para móvil */
                    @media (max-width: 767px) {
                        .carousel-item {
                            width: 100%;
                        }

                        @keyframes carousel {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-300%);
                            }
                        }
                    }
                `
            }} />
            
            <div className={`carousel mx-auto ${className}`}>
                <div 
                    ref={carouselRef}
                    className="carousel-container"
                    id="carousel"
                >
                    {displayItems.map((event) => (
                        <div key={event.id} className="carousel-item relative px-2">
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full aspect-video object-cover rounded-lg transition-transform duration-300"
                                onError={(e) => {
                                    // Imagen de respaldo para placeholders
                                    const target = e.target as HTMLImageElement
                                    target.src = 'https://placehold.co/400x225/6366f1/ffffff?text=Imagen+no+disponible'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg flex items-end justify-center mx-2 transition-all duration-300">
                                <div className="w-full p-4 pb-6 text-center transform transition-transform duration-300">
                                    <span className="font-extrabold text-xl md:text-2xl leading-tight drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent filter brightness-125 block mb-2">
                                        {event.title}
                                    </span>
                                    {event.isPlaceholder && (
                                        <div className="flex flex-col items-center justify-center space-y-1 opacity-90">
                                            <span className="text-blue-200 text-sm font-medium tracking-wide">
                                                {event.subtitle || 'Únete a nuestra comunidad'}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                                <span className="text-blue-100 text-xs">
                                                    {event.description}
                                                </span>
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                                            </div>
                                        </div>
                                    )}
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
