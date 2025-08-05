---
description: Repository Information Overview
alwaysApply: true
---

# MedConsult Admin Dashboard Information

## Summary
A React-based administrative dashboard for the MedConsult platform, providing interfaces for managing doctors, patients, appointments, complaints, charities, and other medical consultation services. Built with modern web technologies for efficient healthcare administration.

## Structure
- **src/**: Core application source code containing components, pages, hooks, and utilities
- **public/**: Static assets including icons and placeholder images
- **components/**: Reusable UI components organized by feature (doctors, patients, auth, etc.)
- **pages/**: Main application views for different administrative sections
- **hooks/**: Custom React hooks for state management and API interactions
- **lib/**: Utility functions and API service configuration
- **types/**: TypeScript type definitions for various data models

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
- Shadcn UI (Radix UI components)
- Tailwind CSS 3.4.11
- Recharts 2.12.7
- Zod 3.23.8
- React Hook Form 7.53.0

**Development Dependencies**:
- Vite 5.4.1
- TypeScript 5.5.3
- ESLint 9.9.0
- PostCSS 8.4.47
- SWC (via @vitejs/plugin-react-swc)

## Build & Installation
```bash
# Install dependencies
npm i

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration
**Base URL**: Configured via environment variable `VITE_API_URL` with fallback to `http://localhost:8000/api`
**Authentication**: JWT-based with token stored in localStorage
**Request Timeout**: 10 seconds
**Error Handling**: Comprehensive error handling with automatic logout on 401 responses

## Main Files & Resources
**Entry Point**: src/main.tsx
**App Configuration**: src/App.tsx
**Routing**: React Router with protected routes via ProtectedRoute component
**State Management**: React Query for server state, React Context for authentication
**API Service**: src/lib/api.ts with interceptors for authentication and error handling

## Features
- **Authentication**: Login system with protected routes
- **User Management**: Admin, doctor, and patient management interfaces
- **Medical Services**: Appointments, medical questions, and specialties management
- **Financial Tracking**: Financial reports and transaction monitoring
- **Content Management**: Gallery and notification systems
- **Analytics**: KPI dashboards and activity logging
- **Charity Management**: Interface for managing charity organizations