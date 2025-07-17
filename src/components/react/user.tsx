import React, { useState, useEffect } from 'react'

interface User {
    id: number;
    name: string;
}

const Usuarios: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            const users: {
                data: { id: number; name: string }[]
            } = await (
                await globalThis.fetch('http://127.0.0.1:5000/api/v1/users/')
            ).json()
            setUsers(users.data)
        } catch (err) {
            setError('Error al cargar los usuarios')
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleActualizar = () => {
        fetchUsers()
    }

    return (
        <div>
            <h2>Usuarios</h2>
            {loading && <p>Cargando usuarios...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}
            <button onClick={handleActualizar} disabled={loading}>
                {loading ? 'Cargando...' : 'Actualizar'}
            </button>
        </div>
    )
}

export default Usuarios
