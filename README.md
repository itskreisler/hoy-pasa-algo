# Plantilla Proyecto Final (actualizada)

TÍTULO
[NombreApp] – Eventos locales en tiempo real

1. PLANTEAMIENTO DEL PROBLEMA
En muchas ocasiones, las promociones y actividades de negocios locales solo son visibles para quienes pasan frente al establecimiento. Esto genera una desconexión entre usuarios y oportunidades, haciendo que se pierdan descuentos, cambios de horarios o eventos importantes por falta de difusión digital inmediata.

2. INTRODUCCIÓN
[NombreApp] es una plataforma web desarrollada como un MVP (Producto Mínimo Viable) para permitir la publicación y visualización de eventos en tiempo real, organizados por categorías y fechas. Mediante una experiencia centrada en el usuario, permite a los negocios aumentar su visibilidad y a los usuarios descubrir actividades relevantes sin necesidad de desplazarse innecesariamente.

3. OBJETIVOS
3.1 OBJETIVO GENERAL
Desarrollar una aplicación web moderna que permita a personas y negocios publicar y consultar eventos de manera sencilla, ordenados por fecha y categoría.

3.2 OBJETIVOS ESPECÍFICOS
Crear una interfaz amigable con menú superior e inferior.

Implementar filtros por categoría (comida, servicios, deportes, etc.) y por fecha (hoy, mañana, esta semana, próximos).

Utilizar tarjetas para mostrar eventos con info clave y botones de interacción (like/favorito).

Integrar un sistema de publicación de eventos rápido y accesible.

Diseñar un MVP funcional usando Astro con React y Zustand.

4. METODOLOGÍA
4.1 TECNOLOGÍA UTILIZADA
Frontend:

Astro (estructura general del sitio, SSR)

React (componentes interactivos)

TailwindCSS (estilos rápidos y responsivos)

Estado global:

Zustand (gestión de estado para filtros, favoritos, sesión, etc.)

Backend (opcional o provisional):

Firebase (auth y base de datos) o backend en Node/Express para eventos y usuarios.

4.2 DISEÑOS (MOCKUPS)
Diseños creados en Figma para:

Página de inicio con buscador y filtros

Tarjetas de evento con detalles clave

Página de perfil

Formulario de creación de eventos

Menú de navegación inferior (Inicio, Crear, Perfil)

4.3 ESTRUCTURA DEL SOFTWARE
Astro: rutas, layout base, integración con componentes React.

React: componentes como EventoCard, FiltroCategorias, FiltroFechas, Navbar, BottomMenu.

Zustand: manejo del estado global (categoría activa, fecha activa, favoritos).

TailwindCSS: diseño responsivo, utilidades para espaciado, colores, layouts.

5. RESULTADOS OBTENIDOS
🖼 Interfaz responsiva con filtros visibles desde el inicio.

🖼 Cards de eventos con info rápida: imagen, hora, ubicación y favoritos.

🖼 Sistema de creación funcional con validación básica.

🖼 Menú inferior que guía la navegación básica del MVP.

🖼 Estado global funcional con Zustand, manteniendo filtros activos entre rutas.

6. CONCLUSIONES
[NombreApp] logró demostrar que es posible crear un MVP moderno, funcional y escalable para resolver la falta de visibilidad de eventos locales. Se validó el uso conjunto de Astro + React + Zustand + Tailwind como stack eficiente para proyectos web centrados en velocidad, estructura clara y usabilidad.

7. BIBLIOGRAFÍA
Astro.build/docs

React.js Docs

TailwindCSS Docs

Zustand Docs