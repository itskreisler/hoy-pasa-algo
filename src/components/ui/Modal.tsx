import React, { useEffect, useRef } from 'react'
import '@src/styles/global.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '', 
  title,
  maxWidth = '2xl'
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Mapeo de tamaños
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }

  useEffect(() => {
    const dialog = dialogRef.current

    if (isOpen && dialog) {
      dialog.showModal()
    } else if (!isOpen && dialog) {
      dialog.close('dismiss')
    }

    const handleDialogClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.nodeName === 'DIALOG') {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialog?.open) {
        onClose()
      }
    }

    const handleCloseClick = () => {
      onClose()
    }

    if (dialog) {
      dialog.addEventListener('click', handleDialogClick)
      
      // Agregar listener para el botón de cerrar
      const closeButton = dialog.querySelector('.close-button')
      if (closeButton) {
        closeButton.addEventListener('click', handleCloseClick)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      if (dialog) {
        dialog.removeEventListener('click', handleDialogClick)
        const closeButton = dialog.querySelector('.close-button')
        if (closeButton) {
          closeButton.removeEventListener('click', handleCloseClick)
        }
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <dialog
      ref={dialogRef}
      className={`fixed inset-0 m-auto w-[95vw] ${sizeClasses[maxWidth]} h-fit max-h-[90vh] transition-opacity duration-300 rounded-xl p-0 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm data-[open]:opacity-100 opacity-0 pointer-events-none open:pointer-events-auto open:opacity-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {title && (
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            className="close-button text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition-colors"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
      )}
      
      <div className={`${title ? '' : 'relative'} ${title ? 'max-h-[calc(90vh-80px)] overflow-y-auto' : 'max-h-[90vh] overflow-y-auto'}`}>
        {!title && (
          <button
            className="close-button absolute top-4 right-4 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        )}
        {children}
      </div>
    </dialog>
  )
}

export default Modal
