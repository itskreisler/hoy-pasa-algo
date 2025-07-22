import React, { useState } from 'react'
import { useAuthStore } from '@src/stores/authStore'
import { t } from '@src/i18n/config.i18n'

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { login } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await login(email, password)
            // Redirigir al usuario después del login exitoso
            window.location.href = '/profile'
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="form-container">
                    <div className="form-card">
                        <h1 className="form-title">{t('page.sign_in.title')}</h1>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        
                        <form className="form-group" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="form-label">
                                    {t('page.sign_in.email')}
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    required 
                                    className="form-input"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="form-label">
                                    {t('page.sign_in.password')}
                                </label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    required 
                                    className="form-input"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input 
                                        id="remember-me" 
                                        name="remember-me" 
                                        type="checkbox" 
                                        className="checkbox-input"
                                    />
                                    <label htmlFor="remember-me" className="checkbox-label">
                                        {t('page.sign_in.remember_me')}
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="/forgot-password" className="link">
                                        {t('page.sign_in.forgot_password')}
                                    </a>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? t('page.sign_in.logging_in') : t('page.sign_in.sign_in')}
                            </button>
                        </form>
                        <div className="form-divider">
                            <div className="relative">
                                <div className="form-divider-line">
                                    <div className="form-divider-border"></div>
                                </div>
                                <div className="form-divider-text">
                                    <span className="form-divider-span">O continúa con</span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button type="button" className="btn-social">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span className="ml-2">Google</span>
                                </button>
                            </div>
                        </div>
                        <p className="mt-6 form-text">
                            {t('page.sign_in.dont_have_account')}
                            <a href="/sign-up" className="link">
                                {t('page.sign_in.sign_up')}
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default SignIn
