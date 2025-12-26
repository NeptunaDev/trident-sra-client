"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Users,
  KeyRound,
  Building2,
  ScrollText,
  FileKey2,
  UserRound,
  PlayCircle,
  Video,
  TerminalSquare,
  Network,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { TridentLogo } from "@/components/trident-logo";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Users", href: "/super-admin/users", icon: Users },
  { title: "Roles", href: "/super-admin/roles", icon: KeyRound },
  {
    title: "Organizations",
    href: "/super-admin/organizations",
    icon: Building2,
  },
  { title: "Connections", href: "/super-admin/connections", icon: Network },
  { title: "Audit Logs", href: "/super-admin/auditlogs", icon: ScrollText },
  { title: "Policies", href: "/super-admin/policies", icon: FileKey2 },
  { title: "Participants", href: "/super-admin/participants", icon: UserRound },
  {
    title: "Sessions Participants",
    href: "/super-admin/sessions-participants",
    icon: PlayCircle,
  },
  { title: "Sessions", href: "/super-admin/sessions", icon: PlayCircle },
  { title: "Recordings", href: "/super-admin/recordings", icon: Video },
  { title: "Commands", href: "/super-admin/commands", icon: TerminalSquare },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#11111f] border-r border-[rgba(91,194,231,0.2)] flex flex-col h-screen">
      <div className="p-6 border-b border-[rgba(91,194,231,0.2)] flex items-center justify-between gap-3">
        <TridentLogo />
        <div className="flex items-center gap-2 text-[#5bc2e7]">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide">
            SUPER ADMIN
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-[#1a1a2e] hover:text-[#5bc2e7]",
              pathname === item.href
                ? "bg-[#1a1a2e] text-[#5bc2e7]"
                : "text-[#c0c5ce]"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[rgba(91,194,231,0.2)]">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#1a1a2e] hover:text-[#5bc2e7] text-[#c0c5ce]"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#1a1a2e] border border-[rgba(91,194,231,0.2)] text-[#c0c5ce]">
            ↩
          </span>
          <span>Back to dashboard</span>
        </Link>
      </div>
    </aside>
  );
}
