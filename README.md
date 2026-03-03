# its-evelyn

Una aplicación web moderna y elegante para la gestión de vestidos y trabajos personalizados de una modista.

## Características

- Autenticación con Google y Email.
- Gestión de vestidos con fotos de referencia, fechas de entrega y más de 30 medidas detalladas.
- Lista de vestidos y filtros por estado (Pendientes, En Proceso, Finalizados).
- Dashboard inteligente con alertas de próximas entregas en los siguientes 7 días.
- Calendario integrado (`react-big-calendar`) para una vista general mensual de pedidos agendados en el taller.
- UI Responsiva y Limpia, con colores amigables ("Pink y Beige").

## Instrucciones para Levantar el Proyecto Localmente

### 1. Requisitos Previos

Tener instalado **Node.js**.

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

## Despliegue (Producción)

Para revisar información detalla de seguridad y cómo subir el proyecto a **Vercel** de manera automática, por favor lee la **Guía de Despliegue** provista (o el archivo Markdown de artefacto adjuntado por el asistente).
