---
description: Repository Information Overview
alwaysApply: true
---

# MedConsult Admin Dashboard Information

## Summary
Panel de administración basado en React para la plataforma MedConsult, que proporciona interfaces para gestionar médicos, pacientes, citas, quejas, organizaciones benéficas y otros servicios de consulta médica. Construido con tecnologías web modernas para una administración eficiente de servicios de salud.

## Structure
- **src/**: Código fuente principal organizado en componentes, páginas, hooks y utilidades
  - **components/**: Componentes UI reutilizables organizados por funcionalidad
  - **pages/**: Vistas principales para diferentes secciones administrativas
  - **hooks/**: Custom hooks para gestión de estado e interacciones con API
  - **lib/**: Funciones de utilidad y configuración de servicios API
  - **types/**: Definiciones de tipos TypeScript para modelos de datos
  - **utils/**: Funciones auxiliares y herramientas
- **public/**: Activos estáticos incluyendo iconos e imágenes
- **dist/**: Archivos compilados para producción

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.5.3
**Build System**: Vite 5.4.1
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 18.3.1
- React Router 6.26.2
- TanStack React Query 5.56.2
- Axios 1.10.0
- Shadcn UI (componentes Radix UI)
- Tailwind CSS 3.4.11
- Recharts 2.12.7
- Zod 3.23.8
- React Hook Form 7.53.0
- jsPDF 3.0.1
- XLSX 0.18.5

**Development Dependencies**:
- Vite 5.4.1
- TypeScript 5.5.3
- ESLint 9.9.0
- PostCSS 8.4.47
- SWC (via @vitejs/plugin-react-swc)

## Build & Installation
```bash
# Instalar dependencias
npm i

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Construir para desarrollo
npm run build:dev

# Vista previa de la build
npm run preview
```

## API Integration
**Base URL**: Configurado vía variable de entorno `VITE_API_URL` con fallback a `http://localhost:8000/api`
**Authentication**: Basado en JWT con token almacenado en localStorage
**Request Timeout**: 10 segundos
**Error Handling**: Manejo integral de errores con cierre de sesión automático en respuestas 401

## Main Files & Resources
**Entry Point**: src/main.tsx
**App Configuration**: src/App.tsx
**Routing**: React Router con rutas protegidas mediante componente ProtectedRoute
**State Management**: React Query para estado del servidor, React Context para autenticación
**API Service**: src/lib/api.ts con interceptores para autenticación y manejo de errores
**Configuration Files**:
- vite.config.ts (configuración del servidor en puerto 8080)
- tsconfig.json (configuración de TypeScript)
- tailwind.config.ts (configuración de Tailwind CSS)

## Features
- **Authentication**: Sistema de login con rutas protegidas
- **User Management**: Interfaces para gestión de administradores, médicos y pacientes
- **Medical Services**: Gestión de citas, preguntas médicas y especialidades
- **Financial Tracking**: Informes financieros y monitoreo de transacciones
- **Content Management**: Sistemas de galería y notificaciones
- **Analytics**: Dashboards KPI y registro de actividades
- **Charity Management**: Interfaz para gestionar organizaciones benéficas
- **Subscription Management**: Gestión de planes y suscripciones de usuarios