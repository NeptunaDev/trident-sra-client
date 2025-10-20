export type Language = "en" | "es"

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    connections: "Connections",
    audit: "Audit",
    settings: "Settings",
    users: "Users",
    logout: "Logout",

    // Landing
    hero_title: "Control Every Command. Protect Every Connection.",
    hero_subtitle: "Enterprise remote access management platform for DevOps teams",
    get_started: "Get Started",
    learn_more: "Learn More",

    // Auth
    sign_in: "Sign In",
    sign_up: "Sign Up",
    email: "Email",
    password: "Password",
    remember_me: "Remember me",
    forgot_password: "Forgot password?",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",

    // Dashboard
    welcome_back: "Welcome back",
    whats_happening: "Here's what's happening with your infrastructure today",
    recent_connections: "Recent Connections",
    team_activity: "Team Activity Feed",
    view_all: "View All",
    connect: "Connect",

    // Connections
    new_connection: "New Connection",
    connection_name: "Connection Name",
    connection_type: "Connection Type",
    host: "Host",
    port: "Port",
    username: "Username",
    save: "Save",
    cancel: "Cancel",

    // Stats
    hosts: "Hosts",
    active: "Active",
    today: "Today",
    time: "Time",

    // Status
    online: "Online",
    offline: "Offline",
    connecting: "Connecting",
    idle: "Idle",

    // Actions
    join_session: "Join Session",
    view_log: "View Log",
    disconnect: "Disconnect",

    // Notifications
    notifications: "Notifications",
    no_notifications: "No new notifications",

    // Profile
    profile: "Profile",
    back_to_home: "Back to Home",
    
    // Common
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    search: "Search",
    filter: "Filter",
    actions: "Actions",
    status: "Status",
    name: "Name",
    type: "Type",
    last_active: "Last Active",
    sessions: "Sessions",
    total: "Total",
    connected: "Connected",
    disconnected: "Disconnected",
  },
  es: {
    // Navigation
    dashboard: "Panel",
    connections: "Conexiones",
    audit: "Auditoría",
    settings: "Configuración",
    users: "Usuarios",
    logout: "Cerrar Sesión",

    // Landing
    hero_title: "Controla Cada Comando. Protege Cada Conexión.",
    hero_subtitle: "Plataforma empresarial de gestión de acceso remoto para equipos DevOps",
    get_started: "Comenzar",
    learn_more: "Saber Más",

    // Auth
    sign_in: "Iniciar Sesión",
    sign_up: "Registrarse",
    email: "Correo",
    password: "Contraseña",
    remember_me: "Recordarme",
    forgot_password: "¿Olvidaste tu contraseña?",
    no_account: "¿No tienes cuenta?",
    have_account: "¿Ya tienes cuenta?",

    // Dashboard
    welcome_back: "Bienvenido de nuevo",
    whats_happening: "Esto es lo que está pasando con tu infraestructura hoy",
    recent_connections: "Conexiones Recientes",
    team_activity: "Actividad del Equipo",
    view_all: "Ver Todo",
    connect: "Conectar",

    // Connections
    new_connection: "Nueva Conexión",
    connection_name: "Nombre de Conexión",
    connection_type: "Tipo de Conexión",
    host: "Host",
    port: "Puerto",
    username: "Usuario",
    save: "Guardar",
    cancel: "Cancelar",

    // Stats
    hosts: "Hosts",
    active: "Activos",
    today: "Hoy",
    time: "Tiempo",

    // Status
    online: "En Línea",
    offline: "Desconectado",
    connecting: "Conectando",
    idle: "Inactivo",

    // Actions
    join_session: "Unirse a Sesión",
    view_log: "Ver Registro",
    disconnect: "Desconectar",

    // Notifications
    notifications: "Notificaciones",
    no_notifications: "No hay notificaciones nuevas",

    // Profile
    profile: "Perfil",
    back_to_home: "Volver al Inicio",
    
    // Common
    edit: "Editar",
    delete: "Eliminar",
    add: "Agregar",
    search: "Buscar",
    filter: "Filtrar",
    actions: "Acciones",
    status: "Estado",
    name: "Nombre",
    type: "Tipo",
    last_active: "Última Actividad",
    sessions: "Sesiones",
    total: "Total",
    connected: "Conectado",
    disconnected: "Desconectado",
  },
}

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"
  return (localStorage.getItem("trident_language") as Language) || "en"
}

export function setLanguage(lang: Language): void {
  localStorage.setItem("trident_language", lang)
}

export function t(key: keyof typeof translations.en): string {
  const lang = getLanguage()
  return translations[lang][key] || translations.en[key]
}
