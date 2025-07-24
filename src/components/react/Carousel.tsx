import React, { useEffect, useRef } from 'react'

interface CarouselProps {
    className?: string
}

const Carousel: React.FC<CarouselProps> = ({ className = '' }) => {
    const carouselRef = useRef<HTMLDivElement>(null)
    const placeholder = '/media/images/image.jpg'

    useEffect(() => {
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
                if (index >= 4) {
                    item.remove()
                }
            })
        }
    }, [])

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
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="carousel-item relative px-2">
                            <img
                                src={placeholder}
                                alt="..."
                                className="w-full aspect-video object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-transparent bg-opacity-20 rounded-lg flex items-center justify-center mx-2">
                                <span className="text-white font-bold text-lg drop-shadow-lg">
                                    🍕 Se te antoja algo delicioso? {index}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Carousel
