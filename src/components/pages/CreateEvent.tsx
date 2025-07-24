import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { useEventStore } from '@src/stores/eventStore'
import { ProfileSkeleton } from '@src/components/ui'
import { t } from '@src/i18n/config.i18n'
import { uploadFile } from '@src/lib/api'

const CreateEvent: React.FC = () => {
    const { user, token, isAuthenticated, loading: authLoading, checkAuth } = useAuthStore()
    const { createEvent, loading: eventLoading, error: eventError } = useEventStore()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [success, setSuccess] = useState<string | null>(null)
    const [imageSource, setImageSource] = useState<'url' | 'file'>('url')
    const [imageUrl, setImageUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess(null)

        if (!isAuthenticated || !token) {
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
            await createEvent({ title, description, date, visibility, image_url: finalImageUrl }, token)
            setSuccess(t('page.create_event.success'))
            setTitle('')
            setDescription('')
            setDate('')
            setVisibility('public')
            setImageSource('url')
            setImageUrl('')
            setImageFile(null)
        } catch {
            // error is handled by the store
        }
    }

    const loading = authLoading || eventLoading

    if (loading || (isAuthenticated && !user)) {
        return <ProfileSkeleton />
    }

    if (!isAuthenticated) {
        return (
            <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                            {t('page.create_event.title')}
                        </h1>
                        <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('page.create_event.you_must_be_logged_in')}
                            </p>
                            <a href="/sign-in" className="text-blue-500 hover:underline">
                                {t('page.create_event.sign_in')}
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                        {t('page.create_event.title')}
                    </h1>
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
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? t('page.create_event.form.creating') : t('page.create_event.form.create_event')}
                            </button>
                        </div>
                        {eventError && <p className="text-red-500 text-sm text-center">{eventError}</p>}
                        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                    </form>
                </div>
            </div>
        </main>
    )
}

export default CreateEvent
