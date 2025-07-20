import React, { useState } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { t } from '@src/i18n/config.i18n'

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { register } = useAuthStore()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await register({
                email: formData.email,
                password: formData.password,
                full_name: formData.name
            })
            // Redirigir al usuario después del registro exitoso
            window.location.href = '/profile'
        } catch (err: any) {
            setError(err.message || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="form-container">
                    <div className="form-card">
                        <h1 className="form-title">
                            {t('page.sign_up.title')}
                        </h1>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        
                        <form className="form-group" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="form-label">
                                    {t('page.sign_up.full_name')}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    required
                                    className="form-input"
                                    placeholder="Ingresa tu nombre completo"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="form-label">
                                    {t('page.sign_up.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    className="form-input"
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="form-label">
                                    {t('page.sign_up.password')}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    className="form-input"
                                    placeholder="Mínimo 8 caracteres"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? t('page.sign_up.registering') : t('page.sign_up.sign_up')}
                            </button>
                        </form>
                        <p className="mt-6 form-text">
                            {t('page.sign_up.already_have_account')}
                            <a href="/sign-in" className="link">
                                {t('page.sign_up.sign_in')}
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Signup
