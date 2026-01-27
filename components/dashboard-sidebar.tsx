"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TridentLogo } from "./trident-logo";
import {
  Home,
  Server,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Terminal,
  Monitor,
  Eye,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { translations, getLanguage, type Language } from "@/lib/i18n";

interface NavItem {
  title: string;
  titleEs: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Connections"]);
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = translations[lang];

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      titleEs: "Panel",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Connections",
      titleEs: "Conexiones",
      href: "/dashboard/connections",
      icon: Server,
      children: [
        {
          title: "SSH",
          titleEs: "SSH",
          href: "/dashboard/connections/ssh",
          icon: Terminal,
        },
        {
          title: "RDP",
          titleEs: "RDP",
          href: "/dashboard/connections/rdp",
          icon: Monitor,
        },
        {
          title: "VNC",
          titleEs: "VNC",
          href: "/dashboard/connections/vnc",
          icon: Eye,
        },
      ],
    },
    {
      title: "Users",
      titleEs: "Usuarios",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Audit",
      titleEs: "Auditoría",
      href: "/dashboard/audit",
      icon: FileText,
    },
    {
      title: "Settings",
      titleEs: "Configuración",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <aside className="w-64 bg-[#11111f] border-r border-[rgba(91,194,231,0.2)] flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(91,194,231,0.2)]">
        <TridentLogo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex-1 flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      "hover:bg-[#1a1a2e] hover:text-[#5bc2e7]",
                      pathname.startsWith(item.href)
                        ? "bg-[#1a1a2e] text-[#5bc2e7]"
                        : "text-[#c0c5ce]"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{lang === "en" ? item.title : item.titleEs}</span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpand(item.title);
                    }}
                    className="p-2 hover:bg-[#1a1a2e] hover:text-[#5bc2e7] rounded-md transition-colors text-[#c0c5ce]"
                  >
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {expandedItems.includes(item.title) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          "hover:bg-[#1a1a2e] hover:text-[#5bc2e7]",
                          pathname === child.href
                            ? "bg-[#1a1a2e] text-[#5bc2e7]"
                            : "text-[#c0c5ce]"
                        )}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>
                          {lang === "en" ? child.title : child.titleEs}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
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
                <span>{lang === "en" ? item.title : item.titleEs}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer with Home button */}
      <div className="p-4 border-t border-[rgba(91,194,231,0.2)]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#1a1a2e] hover:text-[#5bc2e7] text-[#c0c5ce]"
        >
          <LogOut className="w-4 h-4 rotate-180" />
          <span>{translations[lang].back_to_home}</span>
        </Link>
      </div>
    </aside>
  );
}
