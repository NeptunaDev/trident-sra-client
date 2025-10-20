# Trident - Plataforma de Gestión de Acceso Remoto Seguro (SRA)

## 📋 Descripción General

**Trident** es una plataforma empresarial de gestión de acceso remoto seguro (Secure Remote Access - SRA) diseñada para equipos DevOps y administradores de sistemas. Permite controlar, monitorear y auditar todas las conexiones remotas a servidores e infraestructura crítica con un enfoque de seguridad zero-trust.

### Características Principales

- 🔒 **Acceso Seguro**: Arquitectura zero-trust con bóveda de credenciales encriptadas
- 🖥️ **Control de Comandos**: Filtrado y bloqueo de comandos peligrosos en tiempo real
- 👥 **Sesiones Colaborativas**: Múltiples usuarios en la misma sesión con control de acceso basado en roles
- 📹 **Auditoría Completa**: Grabación de sesiones y registros de comandos buscables
- 🌐 **Multi-Protocolo**: Soporte para SSH, RDP y VNC
- 🌍 **Multiidioma**: Interfaz en inglés y español

## 🏗️ Arquitectura del Proyecto

### Tecnologías Utilizadas

- **Framework**: Next.js 15.5.4 (React 19.1.0)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + shadcn/ui
- **Iconos**: Lucide React
- **Gestión de Estado**: React Hooks
- **Internacionalización**: Sistema i18n personalizado

### Estructura del Proyecto

```
front/
├── app/                          # Páginas de la aplicación (App Router)
│   ├── dashboard/                # Panel principal
│   │   ├── audit/                # Módulo de auditoría
│   │   ├── connections/          # Gestión de conexiones
│   │   │   ├── ssh/              # Conexiones SSH
│   │   │   ├── rdp/              # Conexiones RDP
│   │   │   └── vnc/              # Conexiones VNC
│   │   ├── profile/              # Perfil de usuario
│   │   ├── settings/             # Configuración
│   │   └── users/                # Gestión de usuarios
│   ├── login/                    # Inicio de sesión
│   ├── register/                 # Registro
│   ├── session/[id]/             # Vista de sesión activa (dinámica)
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Estilos globales
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes UI base
│   ├── dashboard-header.tsx      # Header del dashboard
│   ├── dashboard-sidebar.tsx     # Sidebar del dashboard
│   ├── language-switcher.tsx     # Selector de idioma
│   ├── new-connection-form.tsx   # Formulario de nueva conexión
│   ├── status-badge.tsx          # Badge de estado
│   ├── trident-logo.tsx          # Logo de la aplicación
│   └── wave-background.tsx       # Fondo animado
├── lib/                          # Utilidades y lógica de negocio
│   ├── auth.ts                   # Autenticación
│   ├── i18n.ts                   # Internacionalización
│   └── utils.ts                  # Utilidades generales
└── public/                       # Archivos estáticos

```

## 🚀 Módulos y Funcionalidades

### 1. Autenticación

**Archivos**: `app/login/page.tsx`, `app/register/page.tsx`, `lib/auth.ts`

- Login con email y contraseña
- Registro de nuevos usuarios
- Almacenamiento de sesión en localStorage
- Funciones: `login()`, `register()`, `logout()`, `getCurrentUser()`, `isAuthenticated()`

### 2. Dashboard Principal

**Archivos**: `app/dashboard/page.tsx`, `app/dashboard/layout.tsx`

- Resumen de infraestructura
- Métricas en tiempo real (hosts activos, sesiones, comandos)
- Conexiones recientes
- Feed de actividad del equipo
- Navegación centralizada

### 3. Gestión de Conexiones

**Archivos**: `app/dashboard/connections/`, subdirectorios `ssh/`, `rdp/`, `vnc/`

#### Características:
- Vista unificada de todas las conexiones
- Filtros por protocolo (SSH, RDP, VNC)
- Búsqueda de conexiones
- Estadísticas por tipo de conexión:
  - Total de conexiones
  - Conexiones activas
  - Total de sesiones
  - Conexiones activas ahora

#### Protocolos Soportados:

**SSH (Secure Shell)**
- Puerto predeterminado: 22
- Autenticación: Contraseña o clave SSH
- Terminal interactiva Linux/Unix

**RDP (Remote Desktop Protocol)**
- Puerto predeterminado: 3389
- Autenticación: Usuario/Contraseña Windows
- Acceso a escritorio remoto Windows

**VNC (Virtual Network Computing)**
- Puerto predeterminado: 5900+
- Autenticación: Contraseña
- Acceso a escritorio remoto multiplataforma

### 4. Sesiones Activas

**Archivos**: `app/session/[id]/page.tsx`

#### Vista de Sesión Dinámica:
La aplicación utiliza una vista dinámica que detecta el tipo de conexión basándose en el ID de la sesión:

- **SSH**: URLs con formato `ssh-{id}` → Terminal Linux/Unix
- **RDP**: URLs con formato `rdp-{id}` → Terminal Windows
- **VNC**: URLs con formato `vnc-{id}` → Terminal Unix/Linux
- **Genérico**: Cualquier otro ID → Terminal SSH por defecto

#### Características de Sesión:
- Terminal interactiva en tiempo real
- Grabación de sesión (activable/desactivable)
- Visualización de comandos ejecutados
- Bloqueo de comandos peligrosos
- Panel de información:
  - Tiempo de sesión
  - Estado de conexión
  - Viewers activos
  - Estadísticas de comandos (total, seguros, bloqueados)
- Compartir sesión
- Finalizar sesión

### 5. Gestión de Usuarios

**Archivos**: `app/dashboard/users/page.tsx`

#### Funcionalidades:
- Listado completo de usuarios
- Búsqueda y filtrado
- Estadísticas:
  - Total de usuarios
  - Usuarios activos
  - Administradores
  - Técnicos
- Roles disponibles:
  - **Admin**: Acceso completo al sistema
  - **Technician**: Acceso a conexiones y sesiones
  - **Observer**: Solo visualización
- Acciones: Editar, Eliminar
- Información por usuario:
  - Nombre y email
  - Rol con badge de color
  - Estado (activo/inactivo)
  - Última actividad
  - Total de sesiones

### 6. Perfil de Usuario

**Archivos**: `app/dashboard/profile/page.tsx`

#### Secciones:
- **Información Personal**:
  - Avatar
  - Nombre completo
  - Email
  - Bio
- **Información de Cuenta**:
  - Rol
  - Miembro desde
  - Último login
  - Zona horaria
- **Resumen de Actividad**:
  - Total de sesiones
  - Horas conectadas
  - Días activos

### 7. Configuración

**Archivos**: `app/dashboard/settings/page.tsx`

#### Opciones:
- **Información de Perfil**: Edición de datos personales
- **Claves SSH**: Gestión de claves para conexiones
- **Seguridad**:
  - Autenticación de dos factores (2FA)
  - Cambio de contraseña
- **Preferencias**:
  - Tema (Oscuro/Claro/Auto)
  - Tamaño de fuente del terminal
  - Grabación automática de sesiones

### 8. Auditoría

**Archivos**: `app/dashboard/audit/page.tsx`

- Registro completo de todas las actividades
- Filtros por:
  - Usuario
  - Tipo de evento
  - Fecha
  - Conexión
- Exportación de logs
- Búsqueda avanzada

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Colores Principales */
--primary: #5bc2e7          /* Azul cyan principal */
--primary-hover: #4ba8d1    /* Azul cyan hover */
--background: #0a0a0f       /* Negro azulado */
--card: #11111f             /* Gris muy oscuro */
--card-hover: #1a1a2e       /* Gris oscuro */
--card-elevated: #2a2a3e    /* Gris medio */

/* Colores de Estado */
--success: #00ff88          /* Verde éxito */
--danger: #ff6b6b           /* Rojo peligro */
--warning: #ffd93d          /* Amarillo advertencia */
--info: #5bc2e7             /* Azul información */

/* Roles */
--admin: #5bc2e7            /* Azul para Admin */
--technician: #00ff88       /* Verde para Technician */
--observer: #9b59b6         /* Morado para Observer */

/* Textos */
--text-primary: #ffffff     /* Blanco */
--text-secondary: #c0c5ce   /* Gris claro */
--text-muted: #9ca3af       /* Gris medio */
--text-disabled: #6b7280    /* Gris oscuro */
```

### Componentes UI

La aplicación utiliza componentes de shadcn/ui basados en Radix UI:

- **Button**: Variantes outline, ghost, default
- **Card**: Contenedores de contenido
- **Input**: Campos de texto
- **Select**: Selectores desplegables
- **Dialog**: Modales
- **DropdownMenu**: Menús contextuales
- **Badge**: Etiquetas de estado
- **Avatar**: Avatares de usuario
- **Alert**: Notificaciones y alertas
- **Switch**: Interruptores on/off
- **Checkbox**: Casillas de verificación
- **Label**: Etiquetas de formulario
- **RadioGroup**: Grupos de opciones

## 🌍 Internacionalización (i18n)

**Archivo**: `lib/i18n.ts`

### Idiomas Soportados
- Inglés (en) - Por defecto
- Español (es)

### Funciones Principales
```typescript
getLanguage(): Language          // Obtiene idioma actual
setLanguage(lang: Language)      // Establece idioma
t(key: string): string           // Traduce una clave
```

### Categorías de Traducciones
- Navegación
- Landing page
- Autenticación
- Dashboard
- Conexiones
- Estadísticas
- Estados
- Acciones
- Notificaciones
- Perfil
- Común

## 🔒 Seguridad

### Características de Seguridad

1. **Arquitectura Zero-Trust**: No se confía en ninguna conexión por defecto
2. **Bóveda de Credenciales**: Almacenamiento seguro y encriptado
3. **Control de Comandos**: Bloqueo en tiempo real de comandos peligrosos
4. **Auditoría Completa**: Registro de todas las acciones
5. **Roles y Permisos**: Control de acceso basado en roles (RBAC)
6. **Autenticación 2FA**: Autenticación de dos factores opcional
7. **Sesión Segura**: Timeout automático de sesiones
8. **Grabación de Sesiones**: Evidencia de todas las actividades

### Comandos Bloqueados (Ejemplos)

Por seguridad, la aplicación bloquea automáticamente comandos peligrosos:

**Linux/Unix (SSH/VNC)**:
- `rm -rf /` - Eliminar sistema completo
- `:(){ :|:& };:` - Fork bomb
- `dd if=/dev/zero of=/dev/sda` - Sobrescribir disco
- `mkfs.ext4 /dev/sda1` - Formatear partición

**Windows (RDP)**:
- `del C:\*.*` - Eliminar archivos del sistema
- `format C:` - Formatear disco del sistema
- `rd /s /q C:\` - Eliminar directorios recursivamente

## 📊 Flujo de Trabajo

### Flujo de Usuario Típico

1. **Acceso**:
   ```
   Landing Page → Login/Register → Dashboard
   ```

2. **Crear Conexión**:
   ```
   Dashboard → Connections → New Connection → 
   Seleccionar Protocolo (SSH/RDP/VNC) → Configurar → Save
   ```

3. **Iniciar Sesión**:
   ```
   Connections → Click "Connect" → Session View → 
   Terminal Interactiva → Comandos → End Session
   ```

4. **Gestionar Usuarios** (Admin):
   ```
   Dashboard → Users → Add User → 
   Configurar Rol → Save
   ```

5. **Auditoría**:
   ```
   Dashboard → Audit → Filtrar → 
   Ver Detalles → Exportar
   ```

## 🚦 Estados de Conexión

### Estados Posibles

- **🟢 Online/Connected**: Conexión activa y funcional
- **🔴 Offline/Disconnected**: Sin conexión
- **🟡 Connecting**: Estableciendo conexión
- **⚫ Idle**: Inactivo pero conectado

## 📦 Instalación y Configuración

### Requisitos Previos

- Node.js v22.17.1 o superior
- npm o yarn
- Git

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd front

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:3000
```

### Scripts Disponibles

```json
{
  "dev": "next dev",           // Modo desarrollo
  "build": "next build",       // Build producción
  "start": "next start",       // Servidor producción
  "lint": "eslint ."          // Linter
}
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=Trident
NEXT_PUBLIC_API_URL=http://localhost:3001

# Configuración de autenticación
NEXT_PUBLIC_SESSION_TIMEOUT=3600000
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test

# Coverage
npm run test:coverage
```

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
npm start
```

### Despliegue en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

## 📝 Convenciones de Código

### TypeScript
- Uso estricto de tipos
- Interfaces para props de componentes
- Enums para constantes

### React
- Componentes funcionales con hooks
- "use client" para componentes interactivos
- Props tipadas con TypeScript

### CSS/Tailwind
- Utility-first approach
- Clases personalizadas en globals.css
- Colores del sistema de diseño

### Naming
- **Componentes**: PascalCase (ej: `DashboardHeader`)
- **Archivos**: kebab-case (ej: `dashboard-header.tsx`)
- **Variables**: camelCase (ej: `userName`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_URL`)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Commits Convencionales

```
feat: Nueva característica
fix: Corrección de bug
docs: Documentación
style: Formato, punto y coma
refactor: Refactorización
test: Agregar tests
chore: Mantenimiento
```

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

- **Desarrollo Frontend**: Equipo Neptuna
- **Diseño UI/UX**: Equipo de Diseño
- **Backend**: Equipo de Infraestructura

## 📞 Soporte

Para soporte técnico o consultas:
- Email: support@trident.com
- Documentación: https://docs.trident.com
- Issues: GitHub Issues

## 🗺️ Roadmap

### Próximas Funcionalidades

- [ ] Integración con LDAP/Active Directory
- [ ] Autenticación SSO (Single Sign-On)
- [ ] API REST documentada
- [ ] SDK para integraciones
- [ ] App móvil (iOS/Android)
- [ ] Notificaciones push en tiempo real
- [ ] Dashboard de métricas avanzadas
- [ ] Exportación de informes PDF
- [ ] Integración con Slack/Teams
- [ ] Soporte para más protocolos (Telnet, HTTPS)

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Versión**: 1.0.0  
**Última Actualización**: Octubre 2025  
**Estado**: En Desarrollo Activo

