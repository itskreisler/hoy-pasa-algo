export const es = {
    title: 'Hoy Pasa Algo',
    nav: {
        home: 'Inicio',
        profile: 'Perfil',
        login: 'Iniciar sesión',
        singup: 'Registrarse',
        menu: 'Menú',
        explore: 'Explorar',
        create_event: 'Crear Evento'
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
        },
        create_event: {
            title: 'Crear un Nuevo Evento',
            you_must_be_logged_in: 'Debes iniciar sesión para crear un evento.',
            sign_in: 'Iniciar Sesión',
            success: '¡Evento creado con éxito!',
            error: 'Error al crear el evento.',
            unknown_error: 'Ocurrió un error desconocido.',
            form: {
                title: 'Título',
                description: 'Descripción',
                date: 'Fecha',
                time: 'Hora',
                country: 'País',
                city: 'Ciudad',
                category: 'Categoría',
                subcategory: 'Subcategoría',
                hashtags: 'Hashtags',
                image_url: 'URL de la Imagen',
                link: 'Enlace',
                calendar: 'Calendario',
                visibility: 'Visibilidad',
                public: 'Público',
                private: 'Privado',
                only_me: 'Solo yo',
                create_event: 'Crear Evento',
                creating: 'Creando...',
                required_field: '*',
                not_available: 'No disponible',
                field_not_available: 'Campo no disponible'
            }
        },
        explore: {
            title: 'Explorar Eventos',
            search_placeholder: 'Buscar eventos...',
            no_events_found: 'No se encontraron eventos.',
            date: 'Fecha:'
        },
        profile: {
            title: 'Mi Perfil',
            you_must_be_logged_in: 'Debes iniciar sesión para ver tu perfil',
            sign_in: 'Iniciar Sesión',
            error_loading_profile: 'Error al cargar el perfil',
            could_not_load_user_info: 'No se pudo cargar la información del usuario',
            reload_page: 'Recargar página',
            account_info: 'Información de tu cuenta',
            log_out: 'Cerrar Sesión',
            personal_information: 'Información Personal',
            username: 'Nombre de Usuario',
            full_name: 'Nombre Completo',
            email: 'Correo Electrónico',
            not_specified: 'No especificado',
            account_information: 'Información de Cuenta',
            user_id: 'ID Usuario',
            role: 'Rol',
            admin: 'Admin',
            user: 'Usuario',
            status: 'Estado',
            active: 'Activa',
            session_status: 'Estado de la Sesión',
            token: 'Token',
            not_available: 'No disponible',
            authenticated: 'Autenticado',
            not_authenticated: 'No autenticado'
        },
        sign_in: {
            title: 'Iniciar Sesión',
            email: 'Correo Electrónico',
            password: 'Contraseña',
            remember_me: 'Recuérdame',
            forgot_password: '¿Olvidaste tu contraseña?',
            sign_in: 'Iniciar Sesión',
            logging_in: 'Iniciando Sesión...',
            dont_have_account: '¿No tienes una cuenta?',
            sign_up: 'Regístrate'
        },
        sign_up: {
            title: 'Crear una cuenta',
            full_name: 'Nombre Completo',
            username: 'Nombre de usuario',
            email: 'Correo Electrónico',
            password: 'Contraseña',
            sign_up: 'Registrarse',
            registering: 'Registrando...',
            already_have_account: '¿Ya tienes una cuenta?',
            sign_in: 'Inicia Sesión'
        }
    },
    footer: {
        copyright: `© ${new Date().getFullYear()} Hoy Pasa Algo. Todos los derechos reservados.`
    }
} as const
