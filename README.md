# its-evelyn

Una aplicación web moderna y elegante para la gestión de vestidos y trabajos personalizados de una modista.

## Características

- Autenticación con Google y Email.
- Gestión de vestidos con fotos de referencia, fechas de entrega y más de 30 medidas detalladas.
- Lista de vestidos y filtros por estado (Pendientes, En Proceso, Finalizados).
- Dashboard inteligente con alertas de próximas entregas en los siguientes 7 días.
- Calendario integrado (`react-big-calendar`) para una vista general mensual de pedidos agendados en el taller.
- UI Responsiva y Limpia, con colores amigables ("Pink y Beige").
- Roles de usuario: Admin y Client, con permisos diferenciados.

## Arquitectura

- **Frontend**: React 19 con Vite, TailwindCSS para estilos.
- **Backend**: Firebase (Firestore para datos, Storage para imágenes, Auth para autenticación).
- **Estado**: Context API para manejo de autenticación y roles.
- **Rutas**: React Router con protección basada en roles.

### Estructura de Carpetas
```
src/
├── components/     # Componentes reutilizables (Layout, ProtectedRoute)
├── config/         # Configuración de Firebase
├── context/        # Context para Auth
├── pages/          # Páginas principales (Login, Dashboard, etc.)
└── services/       # Servicios para interactuar con Firebase
```

## Instrucciones para Levantar el Proyecto Localmente

### 1. Requisitos Previos

Tener instalado **Node.js** (versión 18 o superior).

### 2. Instalación de dependencias

Abre la terminal en la raíz del proyecto y ejecuta:
```bash
npm install
```

### 3. Configurar Firebase e Integrar Variables de Entorno

Debes tener o crear un proyecto en Firebase (ve las instrucciones en `deployment_guide.md` dentro de los artefactos generados).

1. Luego, toma el archivo `.env.example`, cópialo y pégalo nombrándolo `.env`.
2. Completa `.env` con las credenciales que la consola de Firebase te dio al crear la aplicación web.

### 4. Levantar el proyecto en entorno de desarrollo

```bash
npm run dev
```

La aplicación arrancará y se ejecutará en http://localhost:5173 (o similar).

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run preview`: Vista previa del build de producción.
- `npm run lint`: Ejecuta ESLint para verificar código.

## Despliegue (Producción)

Para revisar información detalla de seguridad y cómo subir el proyecto a **Vercel** de manera automática, por favor lee la **Guía de Despliegue** provista (o el archivo Markdown de artefacto adjuntado por el asistente).

## Contribuir

1. Fork el repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT.
