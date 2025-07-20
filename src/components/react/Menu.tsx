import React, { useEffect, useRef } from 'react'
import '@src/styles/global.css'
import { t } from '@src/i18n/config.i18n'
import { useAuthStore } from '@src/stores/authStore'
import { MobileMenuSkeleton } from '@src/components/ui'

interface MenuProps {
  className?: string
}

export const Menu: React.FC<MenuProps> = ({ className = '' }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { isAuthenticated, loading } = useAuthStore()

  useEffect(() => {
    const openButton = document.getElementById('mobileMenuButton')
    const dialog = dialogRef.current

    const handleOpenClick = () => {
      if (dialog) {
        dialog.showModal()
      }
    }

    const handleDialogClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.nodeName === 'DIALOG') {
        dialog?.close('dismiss')
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialog?.open) {
        dialog.close('dismiss')
      }
    }

    const handleCloseClick = () => {
      if (dialog) {
        dialog.close('dismiss')
      }
    }

    if (openButton) {
      openButton.addEventListener('click', handleOpenClick)
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
      if (openButton) {
        openButton.removeEventListener('click', handleOpenClick)
      }
      if (dialog) {
        dialog.removeEventListener('click', handleDialogClick)
        const closeButton = dialog.querySelector('.close-button')
        if (closeButton) {
          closeButton.removeEventListener('click', handleCloseClick)
        }
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={`md:hidden fixed inset-0 m-auto w-[90vw] max-w-sm h-fit transition-opacity duration-300 rounded-lg p-6 shadow-xl backdrop:backdrop-blur-sm data-[open]:opacity-100 opacity-0 pointer-events-none open:pointer-events-auto open:opacity-100 bg-white dark:bg-gray-800 border dark:border-gray-700 ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('nav.menu')}</h2>
        <button
          className="close-button text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition-colors"
          aria-label="Cerrar menú"
        >
          ×
        </button>
      </div>
      
      {loading ? (
        <MobileMenuSkeleton />
      ) : (
        <ul className="space-y-4">
          <li>
            <a
              href="/"
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors font-medium"
              onClick={() => dialogRef.current?.close('dismiss')}
            >
              {t('nav.home')}
            </a>
          </li>
          <li>
            <a
              href="/explore"
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors font-medium"
              onClick={() => dialogRef.current?.close('dismiss')}
            >
              {t('nav.explore')}
            </a>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <a
                  href="/create-event"
                  className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors font-medium"
                  onClick={() => dialogRef.current?.close('dismiss')}
                >
                  {t('nav.create_event')}
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors font-medium"
                  onClick={() => dialogRef.current?.close('dismiss')}
                >
                  {t('nav.profile')}
                </a>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li>
                <a
                  href="/sign-in"
                  className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors font-medium"
                  onClick={() => dialogRef.current?.close('dismiss')}
                >
                  {t('nav.login')}
                </a>
              </li>
              <li>
                <a
                  href="/sign-up"
                  className="block py-3 px-4 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors font-medium text-center"
                  onClick={() => dialogRef.current?.close('dismiss')}
                >
                  {t('nav.singup')}
                </a>
              </li>
            </>
          )}
        </ul>
      )}
    </dialog>
  )
}

export default Menu
