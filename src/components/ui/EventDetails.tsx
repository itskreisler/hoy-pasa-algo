import React, { useState } from 'react'
import { ImageModal } from './ImageModal'

interface EventDetailsProps {
  event: any
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  return (
    <>
      {/* Header con imagen si existe */}
      {event.image_url ? (
        <div className="relative h-64 w-full group">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                    <svg class="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                `
              }
            }}
          />
          
          {/* Badge de visibilidad y botón Ver imagen completa */}
          <div className="absolute top-4 left-4 flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm ${
              event.visibility === 'public' ? 'bg-green-100/90 text-green-700 dark:bg-green-900/80 dark:text-green-200' :
              event.visibility === 'private' ? 'bg-yellow-100/90 text-yellow-700 dark:bg-yellow-900/80 dark:text-yellow-200' :
              'bg-red-100/90 text-red-700 dark:bg-red-900/80 dark:text-red-200'
            }`}>
              {event.visibility.charAt(0).toUpperCase() + event.visibility.slice(1)}
            </span>
            
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm bg-black/50 hover:bg-black/70 text-white transition-colors duration-200 flex items-center space-x-2"
              title="Ver imagen completa"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              <span>Ver completa</span>
            </button>
          </div>
        </div>
      ) : (
        /* Header sin imagen */
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            {/* Badge de visibilidad */}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              event.visibility === 'public' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' :
              event.visibility === 'private' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200' :
              'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
            }`}>
              {event.visibility.charAt(0).toUpperCase() + event.visibility.slice(1)}
            </span>
          </div>

          {/* Icono grande cuando no hay imagen */}
          <div className="flex items-center justify-center">
            <div className="bg-white/20 dark:bg-gray-600/20 rounded-full p-4">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {event.title}
        </h2>

        {/* Descripción */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {event.description}
        </p>

        {/* Información en grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Fecha */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(event.date).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Hora */}
          {event.time && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{event.time}</p>
              </div>
            </div>
          )}

          {/* Categoría */}
          {event.category_id && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Categoría</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{event.category_id}</p>
                {event.subcategory_id && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.subcategory_id}</p>
                )}
              </div>
            </div>
          )}

          {/* Ubicación */}
          {(event.city || event.country) && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {[event.city, event.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Estado */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
              <span className={`px-2 py-1 text-sm font-medium rounded ${
                event.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300' :
                event.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' :
                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {event.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        {event.hashtags && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Hashtags</p>
            <div className="flex flex-wrap gap-2">
              {event.hashtags.split(' ').map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Link */}
        {event.link && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Enlace</p>
            <a 
              href={event.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="truncate">{event.link}</span>
            </a>
          </div>
        )}

        {/* Calendar */}
        {event.calendar && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calendario</p>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full capitalize">
              {event.calendar}
            </span>
          </div>
        )}

        {/* ID del Evento (para desarrollo/debug) */}
        {event.id && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">ID del Evento</p>
            <p className="font-mono text-xs text-gray-500 dark:text-gray-400 break-all bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {event.id}
            </p>
          </div>
        )}
      </div>

      {/* Modal para imagen completa */}
      {event.image_url && (
        <ImageModal
          imageUrl={event.image_url}
          imageAlt={event.title}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </>
  )
}

export default EventDetails
