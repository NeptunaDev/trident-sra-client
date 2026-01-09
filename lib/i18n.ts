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
    create_account: "Create Account",
    creating_account: "Creating Account...",
    continue: "Continue",
    full_name: "Full Name",
    work_email: "Work Email",
    organization_name: "Organization Name",
    organization_slug: "Organization Slug",
    account_info: "Account Info",
    organization_setup: "Organization Setup",
    step_of: "Step {step} of {total}",
    create_trident_account: "Create your TRIDENT account",
    terms_agreement: "I agree to the",
    terms_agreement_and: "and",
    terms_of_service: "Terms of Service",
    privacy_policy: "Privacy Policy",
    must_accept_terms: "You must accept the Terms of Service and Privacy Policy to continue",
    // Tooltips
    tooltip_full_name: "Enter your full name as it will appear in your profile",
    tooltip_work_email: "Use your work email address. This will be used for account verification and notifications",
    tooltip_organization_name: "The official name of your company or organization",
    tooltip_organization_slug: "A URL-friendly identifier for your organization. Only lowercase letters, numbers, and hyphens are allowed. This will be used in your organization's URL",
    tooltip_password: "Password must be at least 8 characters and contain uppercase, lowercase letters, and numbers",
    // Modals
    privacy_policy_title: "Privacy Policy",
    terms_of_service_title: "Terms of Service",
    privacy_section_1_title: "1. Information We Collect",
    privacy_section_1_content: "We collect information that you provide directly to us, including your name, email address, organization details, and any other information you choose to provide when using our services.",
    privacy_section_2_title: "2. How We Use Your Information",
    privacy_section_2_content: "We use the information we collect to provide, maintain, and improve our services, process your transactions, send you technical notices and support messages, and respond to your comments and questions.",
    privacy_section_3_title: "3. Information Sharing",
    privacy_section_3_content: "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the circumstances described in this policy or with your consent.",
    privacy_section_4_title: "4. Data Security",
    privacy_section_4_content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
    privacy_section_5_title: "5. Your Rights",
    privacy_section_5_content: "You have the right to access, update, or delete your personal information at any time. You may also object to the processing of your personal information or request data portability.",
    privacy_section_6_title: "6. Contact Us",
    privacy_section_6_content: "If you have any questions about this Privacy Policy, please contact us at privacy@trident.com",
    terms_section_1_title: "1. Acceptance of Terms",
    terms_section_1_content: "By accessing and using TRIDENT, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.",
    terms_section_2_title: "2. Use License",
    terms_section_2_content: "Permission is granted to temporarily use TRIDENT for personal and commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not modify, copy, or use the materials for any commercial purpose.",
    terms_section_3_title: "3. User Account",
    terms_section_3_content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
    terms_section_4_title: "4. Prohibited Uses",
    terms_section_4_content: "You may not use TRIDENT in any way that causes, or may cause, damage to the service or impairment of the availability or accessibility of the service, or in any way which is unlawful, illegal, fraudulent, or harmful.",
    terms_section_5_title: "5. Limitation of Liability",
    terms_section_5_content: "In no event shall TRIDENT or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TRIDENT.",
    terms_section_6_title: "6. Revisions",
    terms_section_6_content: "TRIDENT may revise these terms of service at any time without notice. By using this service you are agreeing to be bound by the then current version of these terms of service.",
    terms_section_7_title: "7. Contact Information",
    terms_section_7_content: "If you have any questions about these Terms of Service, please contact us at support@trident.com",
    last_updated: "Last updated:",

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
    validation_hostname_required: "Hostname is required",
    validation_hostname_max: "Hostname must be less than 255 characters",
    validation_port_required: "Port is required",
    validation_port_min: "Port must be at least 1",
    validation_port_max: "Port must be less than or equal to 65535",
    validation_port_invalid: "Port must be a valid number",
    validation_username_required: "Username is required",
    validation_username_max: "Username must be less than 255 characters",
    validation_password_max: "Password must be less than 255 characters",
    validation_description_max: "Description must be less than 255 characters",
    validation_status_max: "Status must be less than 50 characters",
    validation_file_url_required: "File URL is required",
    validation_file_name_max: "File name must be less than 255 characters",
    validation_file_size_min: "File size must be at least 0",
    validation_file_size_invalid: "File size must be a valid number",
    validation_file_size_max: "File size is too large",
    validation_duration_invalid: "Duration must be a valid number",
    validation_duration_max: "Duration is too large",
    validation_session_id_required: "Session ID is required",
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
    create_account: "Crear Cuenta",
    creating_account: "Creando Cuenta...",
    continue: "Continuar",
    full_name: "Nombre Completo",
    work_email: "Correo de Trabajo",
    organization_name: "Nombre de la Organización",
    organization_slug: "Slug de la Organización",
    account_info: "Información de Cuenta",
    organization_setup: "Configuración de Organización",
    step_of: "Paso {step} de {total}",
    create_trident_account: "Crea tu cuenta TRIDENT",
    terms_agreement: "Acepto los",
    terms_agreement_and: "y",
    terms_of_service: "Términos de Servicio",
    privacy_policy: "Política de Privacidad",
    must_accept_terms: "Debes aceptar los Términos de Servicio y la Política de Privacidad para continuar",
    // Tooltips
    tooltip_full_name: "Ingresa tu nombre completo como aparecerá en tu perfil",
    tooltip_work_email: "Usa tu correo de trabajo. Este será usado para verificación de cuenta y notificaciones",
    tooltip_organization_name: "El nombre oficial de tu empresa u organización",
    tooltip_organization_slug: "Un identificador amigable para URL de tu organización. Solo letras minúsculas, números y guiones están permitidos. Esto se usará en la URL de tu organización",
    tooltip_password: "La contraseña debe tener al menos 8 caracteres y contener letras mayúsculas, minúsculas y números",
    // Modals
    privacy_policy_title: "Política de Privacidad",
    terms_of_service_title: "Términos de Servicio",
    privacy_section_1_title: "1. Información que Recopilamos",
    privacy_section_1_content: "Recopilamos información que nos proporcionas directamente, incluyendo tu nombre, dirección de correo electrónico, detalles de la organización y cualquier otra información que elijas proporcionar al usar nuestros servicios.",
    privacy_section_2_title: "2. Cómo Usamos Tu Información",
    privacy_section_2_content: "Usamos la información que recopilamos para proporcionar, mantener y mejorar nuestros servicios, procesar tus transacciones, enviarte avisos técnicos y mensajes de soporte, y responder a tus comentarios y preguntas.",
    privacy_section_3_title: "3. Compartir Información",
    privacy_section_3_content: "No vendemos, intercambiamos ni alquilamos tu información personal a terceros. Podemos compartir tu información solo en las circunstancias descritas en esta política o con tu consentimiento.",
    privacy_section_4_title: "4. Seguridad de Datos",
    privacy_section_4_content: "Implementamos medidas técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.",
    privacy_section_5_title: "5. Tus Derechos",
    privacy_section_5_content: "Tienes derecho a acceder, actualizar o eliminar tu información personal en cualquier momento. También puedes oponerte al procesamiento de tu información personal o solicitar portabilidad de datos.",
    privacy_section_6_title: "6. Contáctanos",
    privacy_section_6_content: "Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos en privacy@trident.com",
    terms_section_1_title: "1. Aceptación de Términos",
    terms_section_1_content: "Al acceder y usar TRIDENT, aceptas y acuerdas estar sujeto a los términos y disposiciones de este acuerdo. Si no estás de acuerdo con estos términos, por favor no uses nuestro servicio.",
    terms_section_2_title: "2. Licencia de Uso",
    terms_section_2_content: "Se otorga permiso para usar TRIDENT temporalmente para fines personales y comerciales. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia no puedes modificar, copiar o usar los materiales para ningún propósito comercial.",
    terms_section_3_title: "3. Cuenta de Usuario",
    terms_section_3_content: "Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Aceptas asumir la responsabilidad de todas las actividades que ocurran bajo tu cuenta.",
    terms_section_4_title: "4. Usos Prohibidos",
    terms_section_4_content: "No puedes usar TRIDENT de ninguna manera que cause, o pueda causar, daño al servicio o deterioro de la disponibilidad o accesibilidad del servicio, o de cualquier manera que sea ilegal, fraudulenta o dañina.",
    terms_section_5_title: "5. Limitación de Responsabilidad",
    terms_section_5_content: "En ningún caso TRIDENT o sus proveedores serán responsables de ningún daño (incluyendo, sin limitación, daños por pérdida de datos o ganancias, o debido a interrupción del negocio) que surja del uso o incapacidad de usar los materiales en TRIDENT.",
    terms_section_6_title: "6. Revisiones",
    terms_section_6_content: "TRIDENT puede revisar estos términos de servicio en cualquier momento sin previo aviso. Al usar este servicio, aceptas estar sujeto a la versión actual de estos términos de servicio.",
    terms_section_7_title: "7. Información de Contacto",
    terms_section_7_content: "Si tienes alguna pregunta sobre estos Términos de Servicio, por favor contáctanos en support@trident.com",
    last_updated: "Última actualización:",

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
    validation_hostname_required: "El hostname es requerido",
    validation_hostname_max: "El hostname debe tener menos de 255 caracteres",
    validation_port_required: "El puerto es requerido",
    validation_port_min: "El puerto debe ser al menos 1",
    validation_port_max: "El puerto debe ser menor o igual a 65535",
    validation_port_invalid: "El puerto debe ser un número válido",
    validation_username_required: "El nombre de usuario es requerido",
    validation_username_max: "El nombre de usuario debe tener menos de 255 caracteres",
    validation_password_max: "La contraseña debe tener menos de 255 caracteres",
    validation_description_max: "La descripción debe tener menos de 255 caracteres",
    validation_status_max: "El estado debe tener menos de 50 caracteres",
    validation_file_url_required: "La URL del archivo es requerida",
    validation_file_name_max: "El nombre del archivo debe tener menos de 255 caracteres",
    validation_file_size_min: "El tamaño del archivo debe ser al menos 0",
    validation_file_size_invalid: "El tamaño del archivo debe ser un número válido",
    validation_file_size_max: "El tamaño del archivo es demasiado grande",
    validation_duration_invalid: "La duración debe ser un número válido",
    validation_duration_max: "La duración es demasiado grande",
    validation_session_id_required: "El ID de sesión es requerido",
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
