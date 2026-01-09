export type Language = "en" | "es";

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
    hero_subtitle:
      "Enterprise remote access management platform for DevOps teams",
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

    // Validation messages
    validation_name_required: "Name is required",
    validation_name_min: "Name must be at least 3 characters",
    validation_name_max: "Name must be less than 100 characters",
    validation_email_required: "Email is required",
    validation_email_invalid: "Invalid email format",
    validation_password_required: "Password is required",
    validation_password_min: "Password must be at least 8 characters",
    validation_password_uppercase:
      "Password must contain at least one uppercase letter",
    validation_password_lowercase:
      "Password must contain at least one lowercase letter",
    validation_password_number: "Password must contain at least one number",
    validation_role_required: "Role is required",
    validation_organization_required: "Organization is required",
    validation_protocol_required: "Protocol is required",
    validation_protocol_max: "Protocol must be less than 50 characters",
    validation_port_required: "Port is required",
    validation_port_min: "Port must be at least 1",
    validation_port_max: "Port must be less than or equal to 65535",
    validation_username_required: "Username is required",
    validation_username_max: "Username must be less than 255 characters",
    validation_password_max: "Password must be less than 255 characters",
    validation_description_max: "Description must be less than 255 characters",
    validation_file_name_max: "File name must be less than 255 characters",
    validation_file_size_invalid: "File size must be a valid number",
    validation_file_size_max: "File size is too large",
    validation_duration_invalid: "Duration must be a valid number",
    validation_duration_max: "Duration is too large",
    validation_public_session_id_required: "Public session ID is required",
    validation_public_session_id_max: "Public session ID must be less than 100 characters",
    validation_connection_id_required: "Connection ID is required",
    validation_commands_min: "Commands count must be at least 0",
    validation_total_commands_max: "Total commands cannot exceed 2,147,483,647",
    validation_blocked_commands_max: "Blocked commands cannot exceed 2,147,483,647",
    validation_slug_required: "Slug is required",
    validation_slug_min: "Slug must be at least 1 character",
    validation_slug_max: "Slug must be at most 100 characters",
    validation_slug_invalid:
      "Slug must contain only lowercase letters, numbers, and hyphens",
    validation_plan_required: "Plan is required",
    validation_max_users_invalid:
      "Max users must be a positive integer or null",
    validation_max_connections_invalid:
      "Max connections must be a positive integer or null",
    validation_max_agents_invalid:
      "Max agents must be a positive integer or null",
    validation_role_name_min: "Role name must be at least 1 character",
    validation_role_name_max: "Role name must be at most 50 characters",
    validation_role_display_name_min:
      "Display name must be at least 1 character",
    validation_role_display_name_max:
      "Display name must be at most 100 characters",
    validation_role_color_required: "Color is required",
    validation_role_color_invalid:
      "Color must be a valid hex color (e.g., #5bc2e7)",
    validation_role_permissions_required: "Permissions are required",
    validation_event_type_required: "Event type is required",
    validation_event_type_min: "Event type must be at least 10 characters",
    validation_event_type_max: "Event type must be at most 100 characters",
    validation_action_required: "Action is required",
    validation_action_min: "Action must be at least 5 characters",
    validation_action_max: "Action must be at most 255 characters",
    validation_status_required: "Status is required",
    validation_status_min: "Status must be at least 5 characters",
    validation_status_max: "Status must be at most 50 characters",
    validation_file_url_required: "File URL is required",
    validation_file_url_invalid: "Invalid URL format",
    validation_session_id_required: "Session ID is required",
    validation_session_id_invalid: "Session ID must be a valid UUID",
    validation_file_size_min: "File size cannot be negative",
    validation_duration_min: "Duration cannot be negative",
    validation_user_id_required: "User authentication is required",
    validation_agent_name_required: "Agent name is required",
    validation_agent_name_min: "Agent name must be at least 1 character",
    validation_agent_name_max: "Agent name must be at most 100 characters",
    validation_hostname_required: "Hostname is required",
    validation_hostname_min: "Hostname must be at least 1 character",
    validation_hostname_max: "Hostname must be at most 255 characters",
    validation_os_type_required: "OS type is required",
    validation_tunnel_type_required: "Tunnel type is required",
    validation_agent_token_required: "Agent token is required",
    validation_agent_token_min: "Agent token must be at least 32 characters",
    validation_port_invalid: "Port must be a valid number between 1 and 65535",
    validation_url_invalid: "Invalid URL format",
    validation_max_concurrent_sessions_invalid:
      "Max concurrent sessions must be a positive integer or null",
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
    hero_subtitle:
      "Plataforma empresarial de gestión de acceso remoto para equipos DevOps",
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

    // Validation messages
    validation_name_required: "El nombre es requerido",
    validation_name_min: "El nombre debe tener al menos 3 caracteres",
    validation_name_max: "El nombre debe tener menos de 100 caracteres",
    validation_email_required: "El correo es requerido",
    validation_email_invalid: "Formato de correo inválido",
    validation_password_required: "La contraseña es requerida",
    validation_password_min: "La contraseña debe tener al menos 8 caracteres",
    validation_password_uppercase:
      "La contraseña debe contener al menos una letra mayúscula",
    validation_password_lowercase:
      "La contraseña debe contener al menos una letra minúscula",
    validation_password_number:
      "La contraseña debe contener al menos un número",
    validation_role_required: "El rol es requerido",
    validation_organization_required: "La organización es requerida",
    validation_protocol_required: "El protocolo es requerido",
    validation_protocol_max: "El protocolo debe tener menos de 50 caracteres",
    validation_port_required: "El puerto es requerido",
    validation_port_min: "El puerto debe ser al menos 1",
    validation_port_max: "El puerto debe ser menor o igual a 65535",
    validation_username_required: "El nombre de usuario es requerido",
    validation_username_max: "El nombre de usuario debe tener menos de 255 caracteres",
    validation_password_max: "La contraseña debe tener menos de 255 caracteres",
    validation_description_max: "La descripción debe tener menos de 255 caracteres",
    validation_file_name_max: "El nombre del archivo debe tener menos de 255 caracteres",
    validation_file_size_invalid: "El tamaño del archivo debe ser un número válido",
    validation_file_size_max: "El tamaño del archivo es demasiado grande",
    validation_duration_invalid: "La duración debe ser un número válido",
    validation_duration_max: "La duración es demasiado grande",
    validation_public_session_id_required: "El ID público de sesión es requerido",
    validation_public_session_id_max: "El ID público de sesión debe tener menos de 100 caracteres",
    validation_connection_id_required: "El ID de conexión es requerido",
    validation_commands_min: "El conteo de comandos debe ser al menos 0",
    validation_total_commands_max: "El total de comandos no puede exceder 2,147,483,647",
    validation_blocked_commands_max: "Los comandos bloqueados no pueden exceder 2,147,483,647",
    validation_slug_required: "El slug es requerido",
    validation_slug_min: "El slug debe tener al menos 1 carácter",
    validation_slug_max: "El slug debe tener como máximo 100 caracteres",
    validation_slug_invalid:
      "El slug solo debe contener letras minúsculas, números y guiones",
    validation_plan_required: "El plan es requerido",
    validation_max_users_invalid:
      "El máximo de usuarios debe ser un entero positivo o null",
    validation_max_connections_invalid:
      "El máximo de conexiones debe ser un entero positivo o null",
    validation_max_agents_invalid:
      "El máximo de agentes debe ser un entero positivo o null",
    validation_role_name_min:
      "El nombre del rol debe tener al menos 1 carácter",
    validation_role_name_max:
      "El nombre del rol debe tener como máximo 50 caracteres",
    validation_role_display_name_min:
      "El nombre de visualización debe tener al menos 1 carácter",
    validation_role_display_name_max:
      "El nombre de visualización debe tener como máximo 100 caracteres",
    validation_role_color_required: "El color es requerido",
    validation_role_color_invalid:
      "El color debe ser un color hexadecimal válido (ej: #5bc2e7)",
    validation_role_permissions_required: "Los permisos son requeridos",
    validation_event_type_required: "El tipo de evento es requerido",
    validation_event_type_min:
      "El tipo de evento debe tener al menos 10 caracteres",
    validation_event_type_max:
      "El tipo de evento debe tener como máximo 100 caracteres",
    validation_action_required: "La acción es requerida",
    validation_action_min: "La acción debe tener al menos 5 caracteres",
    validation_action_max: "La acción debe tener como máximo 255 caracteres",
    validation_status_required: "El estado es requerido",
    validation_status_min: "El estado debe tener al menos 5 caracteres",
    validation_status_max: "El estado debe tener como máximo 50 caracteres",
    validation_file_url_required: "La URL del archivo es obligatoria",
    validation_file_url_invalid: "La URL introducida no es válida",
    validation_session_id_required: "El ID de sesión es obligatorio",
    validation_session_id_invalid: "El ID de sesión no es un UUID válido",
    validation_file_size_min: "El tamaño no puede ser negativo",
    validation_duration_min: "La duración no puede ser negativa",
    validation_user_id_required:
      "Se requiere identificación de usuario de validación",
    validation_agent_name_required: "El nombre del agente es requerido",
    validation_agent_name_min:
      "El nombre del agente debe tener al menos 1 carácter",
    validation_agent_name_max:
      "El nombre del agente debe tener como máximo 100 caracteres",
    validation_hostname_required: "El hostname es requerido",
    validation_hostname_min: "El hostname debe tener al menos 1 carácter",
    validation_hostname_max:
      "El hostname debe tener como máximo 255 caracteres",
    validation_os_type_required: "El tipo de OS es requerido",
    validation_tunnel_type_required: "El tipo de túnel es requerido",
    validation_agent_token_required: "El token del agente es requerido",
    validation_agent_token_min:
      "El token del agente debe tener al menos 32 caracteres",
    validation_port_invalid:
      "El puerto debe ser un número válido entre 1 y 65535",
    validation_url_invalid: "Formato de URL inválido",
    validation_max_concurrent_sessions_invalid:
      "El máximo de sesiones concurrentes debe ser un entero positivo o null",
  },
};

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("trident_language") as Language) || "en";
}

export function setLanguage(lang: Language): void {
  localStorage.setItem("trident_language", lang);
}

export function t(key: keyof typeof translations.en): string {
  const lang = getLanguage();
  return translations[lang][key] || translations.en[key];
}
