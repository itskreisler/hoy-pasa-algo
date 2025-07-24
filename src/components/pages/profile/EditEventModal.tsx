import React, { useState, useEffect } from 'react'
import { useEventStore } from '@src/stores/eventStore'
import { t } from '@src/i18n/config.i18n'
import { uploadFile } from '@src/lib/api'
import type { Event } from '@src/stores/eventStore'
import { useAuthStore } from '@src/stores/authStore'

interface EditEventModalProps {
    event: Event | null
    isOpen: boolean
    onClose: () => void
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose }) => {
    const { updateEvent, loading: eventLoading, error: eventError } = useEventStore()
    const { token } = useAuthStore()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [success, setSuccess] = useState<string | null>(null)
    const [imageSource, setImageSource] = useState<'url' | 'file'>('url')
    const [imageUrl, setImageUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (event) {
            setTitle(event.title)
            setDescription(event.description)
            setDate(event.date.split('T')[0]) // Assuming date is in ISO format
            setVisibility(event.visibility)
            setImageUrl(event.image_url || '')
        }
    }, [event])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess(null)

        if (!token || !event) {
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
            await updateEvent(event.id, { title, description, date, visibility, image_url: finalImageUrl }, token)
            setSuccess(t('page.edit_event.success'))
            onClose()
        } catch {
            // error is handled by the store
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">{t('page.edit_event.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.title')} <span className="text-red-500">{t('page.create_event.form.required_field')}</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                aria-required="true"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.description')} <span className="text-red-500">{t('page.create_event.form.required_field')}</span>
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                aria-required="true"
                                rows={4}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.date')} <span className="text-red-500">{t('page.create_event.form.required_field')}</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                aria-required="true"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.time')} <span className="text-gray-400 text-xs">({t('page.create_event.form.not_available')})</span>
                            </label>
                            <input
                                type="time"
                                id="time"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.time')} - ${t('page.create_event.form.field_not_available')}`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.country')} <span className="text-gray-400 text-xs">({t('page.create_event.form.not_available')})</span>
                            </label>
                            <input
                                type="text"
                                id="country"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.country')} - ${t('page.create_event.form.field_not_available')}`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.city')} <span className="text-gray-400 text-xs">({t('page.create_event.form.not_available')})</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.city')} - ${t('page.create_event.form.field_not_available')}`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.category')} <span className="text-gray-400 text-xs">({t('page.create_event.form.not_available')})</span>
                            </label>
                            <select
                                id="category"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.category')} - ${t('page.create_event.form.field_not_available')}`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            >
                                <option>Category 1</option>
                                <option>Category 2</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.subcategory')} <span className="text-gray-400 text-xs">({t('page.create_event.form.not_available')})</span>
                            </label>
                            <select
                                id="subcategory"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.subcategory')} - ${t('page.create_event.form.field_not_available')}`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            >
                                <option>Subcategory 1</option>
                                <option>Subcategory 2</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.hashtags')} <span className="text-gray-400 text-xs">({t('page.create_event.form.not_available')})</span>
                            </label>
                            <input
                                type="text"
                                id="hashtags"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.hashtags')} - ${t('page.create_event.form.field_not_available')}`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.image_url')}
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <select
                                    value={imageSource}
                                    onChange={(e) => setImageSource(e.target.value as 'url' | 'file')}
                                    className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="url">URL</option>
                                    <option value="file">{t('page.create_event.form.upload_file')}</option>
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
                                {t('page.create_event.form.link')} <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="text"
                                id="link"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.link')} - Campo no disponible`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="calendar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.calendar')} <span className="text-gray-400 text-xs">(No disponible)</span>
                            </label>
                            <input
                                type="text"
                                id="calendar"
                                disabled
                                aria-disabled="true"
                                aria-label={`${t('page.create_event.form.calendar')} - Campo no disponible`}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('page.create_event.form.visibility')} <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="visibility"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                required
                                aria-required="true"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="public">{t('page.create_event.form.public')}</option>
                                <option value="private">{t('page.create_event.form.private')}</option>
                                <option value="only_me">{t('page.create_event.form.only_me')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                            {t('page.edit_event.form.cancel')}
                        </button>
                        <button type="submit" disabled={eventLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {eventLoading ? t('page.edit_event.form.updating') : t('page.edit_event.form.update_event')}
                        </button>
                    </div>
                    {eventError && <p className="text-red-500 text-sm text-center mt-4">{eventError}</p>}
                    {success && <p className="text-green-500 text-sm text-center mt-4">{success}</p>}
                </form>
            </div>
        </div>
    )
}

export default EditEventModal
