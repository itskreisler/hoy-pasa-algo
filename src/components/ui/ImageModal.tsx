import React, { useRef, useEffect, useState } from 'react'

interface ImageModalProps {
  imageUrl: string
  imageAlt: string
  isOpen: boolean
  onClose: () => void
}

export const ImageModal: React.FC<ImageModalProps> = ({ 
  imageUrl, 
  imageAlt, 
  isOpen, 
  onClose 
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
      setImageLoaded(false)
      setImageError(false)
    } else {
      dialog.close()
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => {
      onClose()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleBackdropClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        onClose()
      }
    }

    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('keydown', handleKeyDown)
    dialog.addEventListener('click', handleBackdropClick)

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('keydown', handleKeyDown)
      dialog.removeEventListener('click', handleBackdropClick)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[60] w-full h-full bg-black/90 backdrop-blur-sm p-4 overflow-hidden"
      style={{ margin: 0, maxWidth: '100vw', maxHeight: '100vh' }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
          aria-label="Cerrar imagen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenedor de la imagen */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          {/* Loading spinner */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Imagen */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(true)
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Error state */}
          {imageError && (
            <div className="flex flex-col items-center justify-center text-white p-8">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-medium mb-2">Error al cargar la imagen</p>
              <p className="text-gray-300 text-center">No se pudo cargar la imagen completa</p>
            </div>
          )}
        </div>

        {/* Info en la parte inferior */}
        {imageLoaded && !imageError && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-center">{imageAlt}</p>
            <p className="text-xs text-gray-300 text-center mt-1">
              Haz click en X para cerrar
            </p>
          </div>
        )}
      </div>
    </dialog>
  )
}

export default ImageModal
