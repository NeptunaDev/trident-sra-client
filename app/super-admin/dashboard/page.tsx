import Link from "next/link";
import {
  Users,
  KeyRound,
  Building2,
  ScrollText,
  FileKey2,
  UserRound,
  PlayCircle,
  Video,
  TerminalSquare,
  Bot,
} from "lucide-react";

const cards = [
  {
    title: "Users",
    href: "/super-admin/users",
    icon: Users,
    description: "Manage platform users.",
  },
  {
    title: "Roles",
    href: "/super-admin/roles",
    icon: KeyRound,
    description: "Define access roles.",
  },
  {
    title: "Organizations",
    href: "/super-admin/organizations",
    icon: Building2,
    description: "Manage tenants and orgs.",
  },
  {
    title: "Audit Logs",
    href: "/super-admin/auditlogs",
    icon: ScrollText,
    description: "Review security events.",
  },
  {
    title: "Policies",
    href: "/super-admin/policies",
    icon: FileKey2,
    description: "Create enforcement policies.",
  },
  {
    title: "Participants",
    href: "/super-admin/participants",
    icon: UserRound,
    description: "Session participants catalog.",
  },
  {
    title: "Sessions Participants",
    href: "/super-admin/sessions-participants",
    icon: PlayCircle,
    description: "Manage session participants.",
  },
  {
    title: "Sessions",
    href: "/super-admin/sessions",
    icon: PlayCircle,
    description: "Manage privileged sessions.",
  },
  {
    title: "Recordings",
    href: "/super-admin/recordings",
    icon: Video,
    description: "Review session recordings.",
  },
  {
    title: "Commands",
    href: "/super-admin/commands",
    icon: TerminalSquare,
    description: "Command catalog / blocks.",
  },
  {
    title: "Agents",
    href: "/super-admin/agents",
    icon: Bot,
    description: "Manage agents and their configurations.",
  },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Super Admin</h1>
        <p className="text-sm text-[#c0c5ce]">Choose a module to manage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-[#11111f] border border-[rgba(91,194,231,0.2)] rounded-lg p-4 hover:bg-[#1a1a2e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#0f0f1c] border border-[rgba(91,194,231,0.2)] flex items-center justify-center text-[#5bc2e7]">
                <c.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-semibold">{c.title}</div>
                <div className="text-sm text-[#c0c5ce] truncate">
                  {c.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
