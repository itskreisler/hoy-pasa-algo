import React, { useEffect, useState } from 'react'
import { useEventStore, type Event } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'
import { Modal } from '@src/components/ui'
import { uploadFile } from '@src/lib/api'

const EventsTab: React.FC = () => {
    const { myEvents, myEventsLoading, fetchMyEvents, updateEvent, deleteEvent, loading: eventLoading, error: eventError } = useEventStore()
    const { token } = useAuthStore()
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    
    // Estados para el formulario de edición
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [success, setSuccess] = useState<string | null>(null)
    const [imageSource, setImageSource] = useState<'url' | 'file'>('url')
    const [imageUrl, setImageUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (token) {
            fetchMyEvents(token)
        }
    }, [token, fetchMyEvents])

    // Inicializar formulario cuando se selecciona un evento para editar
    useEffect(() => {
        if (selectedEvent && isEditModalOpen) {
            setTitle(selectedEvent.title)
            setDescription(selectedEvent.description)
            setDate(selectedEvent.date.split('T')[0])
            setVisibility(selectedEvent.visibility)
            setImageUrl(selectedEvent.image_url || '')
            setSuccess(null)
        }
    }, [selectedEvent, isEditModalOpen])

    const handleRefresh = () => {
        if (token) {
            fetchMyEvents(token)
        }
    }

    const handleEdit = (event: Event) => {
        setSelectedEvent(event)
        setEditModalOpen(true)
    }

    const handleDelete = (event: Event) => {
        setSelectedEvent(event)
        setDeleteModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedEvent(null)
        setSuccess(null)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedEvent(null)
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess(null)

        if (!token || !selectedEvent) {
            return
        }

        let finalImageUrl = imageUrl

        if (imageSource === 'file' && imageFile) {
            try {
                const response = await uploadFile(imageFile, token)
                if (response.type === 'success' && response.data?.urls) {
                    finalImageUrl = response.data.urls[0]
                } else {
                    throw new Error(response.message || 'Error al subir la imagen')
                }
            } catch (error) {
                console.error(error)
                return
            }
        }

        try {
            await updateEvent(selectedEvent.id, { 
                title, 
                description, 
                date, 
                visibility, 
                image_url: finalImageUrl 
            }, token)
            setSuccess('Evento actualizado exitosamente')
            setTimeout(() => {
                closeEditModal()
            }, 1500)
        } catch {
            // Error es manejado por el store
        }
    }

    const handleDeleteConfirm = async () => {
        if (!token || !selectedEvent) {
            return
        }

        try {
            await deleteEvent(selectedEvent.id, token)
            closeDeleteModal()
        } catch {
            // Error es manejado por el store
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM14 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM6 9h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                        </svg>
                        Mis Eventos ({myEvents.length})
                    </h3>
                    <button 
                        onClick={handleRefresh}
                        disabled={myEventsLoading}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {myEventsLoading ? 'Cargando...' : 'Actualizar'}
                    </button>
                </div>
                
                {myEventsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-20 rounded-lg"></div>
                        ))}
                    </div>
                ) : myEvents.length > 0 ? (
                    <div className="space-y-4">
                        {myEvents.map(event => (
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
                                            {event.time && (
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {event.time}
                                                </span>
                                            )}
                                            {(event.city || event.country) && (
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {[event.city, event.country].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            event.status === 'active' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                                        }`}>
                                            {event.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            event.visibility === 'public' 
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                        }`}>
                                            {event.visibility}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => handleEdit(event)} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(event)} className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors">
                                            Eliminar
                                        </button>
                                        {event.link && (
                                            <a 
                                                href={event.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                                            >
                                                Ver enlace
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM14 7V3a1 1 0 012 0v4a1 1 0 11-2 0zM6 9h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No tienes eventos creados</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Comienza creando tu primer evento para compartir con la comunidad</p>
                        <a href="/create-event" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Crear mi primer evento
                        </a>
                    </div>
                )}
            </div>
            
            {/* Modal de Edición */}
            <Modal 
                isOpen={isEditModalOpen} 
                onClose={closeEditModal}
                title="Editar Evento"
                maxWidth="2xl"
            >
                <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Título del evento <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={4}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fecha <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Hora <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="time"
                                id="time"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                País <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="text"
                                id="country"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ciudad <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Categoría <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <select
                                id="category"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            >
                                <option>Categoría 1</option>
                                <option>Categoría 2</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Subcategoría <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <select
                                id="subcategory"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            >
                                <option>Subcategoría 1</option>
                                <option>Subcategoría 2</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Hashtags <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="text"
                                id="hashtags"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Imagen del evento
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <select
                                    value={imageSource}
                                    onChange={(e) => setImageSource(e.target.value as 'url' | 'file')}
                                    className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="url">URL</option>
                                    <option value="file">Subir archivo</option>
                                </select>
                                {imageSource === 'url' ? (
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                                        placeholder="https://example.com/image.png"
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Enlace del evento <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="text"
                                id="link"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="calendar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Calendario <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="text"
                                id="calendar"
                                disabled
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Visibilidad <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="visibility"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="public">Público</option>
                                <option value="private">Privado</option>
                                <option value="only_me">Solo yo</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button 
                            type="button" 
                            onClick={closeEditModal} 
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={eventLoading} 
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {eventLoading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                    {eventError && <p className="text-red-500 text-sm text-center mt-4">{eventError}</p>}
                    {success && <p className="text-green-500 text-sm text-center mt-4">{success}</p>}
                </form>
            </Modal>

            {/* Modal de Eliminación */}
            <Modal 
                isOpen={isDeleteModalOpen} 
                onClose={closeDeleteModal}
                title="Eliminar Evento"
                maxWidth="md"
            >
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        ¿Estás seguro de que deseas eliminar el evento <strong>{selectedEvent?.title}</strong>?
                        <br />
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                            Esta acción no se puede deshacer.
                        </span>
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button 
                            type="button" 
                            onClick={closeDeleteModal} 
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleDeleteConfirm} 
                            disabled={eventLoading} 
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {eventLoading ? 'Eliminando...' : 'Eliminar evento'}
                        </button>
                    </div>
                    {eventError && <p className="text-red-500 text-sm text-center mt-4">{eventError}</p>}
                </div>
            </Modal>
        </div>
    )
}

export default EventsTab
