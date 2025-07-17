export const es = {
    title: 'Hoy Pasa Algo',
    nav: {
        home: 'Inicio',
        events: 'Eventos',
        about: 'Acerca de',
        contact: 'Contacto',
        login: 'Iniciar sesión',
        singup: 'Registrarse'
    },
    page: {
        home: {
            title: 'Bienvenido a Hoy Pasa Algo',
            description: 'Descubre los eventos más interesantes que suceden cerca de ti. ¡No te pierdas nada!',
            upcomingEvents: 'Próximos Eventos',
            viewEvents: 'Ver eventos',
            createdEvents: 'Eventos Creados',
            registeredUsers: 'Usuarios Registrados',
            growing: 'Y creciendo cada día',
            activeCommunity: 'Comunidad activa'
        }

    },
    footer: {
        copyright: `© ${new Date().getFullYear()} Hoy Pasa Algo. Todos los derechos reservados.`,
        copy: '© {year}'
    }
} as const
