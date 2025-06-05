import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  badge: string | null;
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/app",
      badge: null
    },
    {
      icon: FileText,
      label: "Ordens de Serviço",
      href: "/app/ordens",
      badge: null
    },
    {
      icon: Users,
      label: "Clientes",
      href: "/app/clientes",
      badge: null
    },
    {
      icon: Package,
      label: "Produtos/Serviços",
      href: "/app/produtos",
      badge: null
    },
    {
      icon: TrendingUp,
      label: "Financeiro",
      href: "/app/financeiro",
      badge: null
    },
    {
      icon: BarChart3,
      label: "Relatórios",
      href: "/app/relatorios",
      badge: null
    },
    {
      icon: CreditCard,
      label: "Planos",
      href: "/app/assinatura",
      badge: null
    },
    {
      icon: Settings,
      label: "Configurações",
      href: "/app/configuracoes",
      badge: null
    }
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-secondary h-full",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-center py-4">
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-muted">
          {isExpanded ? "<<" : ">>"}
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={cn(
              "group flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted hover:text-foreground",
              isActive(item.href) ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {isExpanded && item.label}
            {item.badge && isExpanded && (
              <span className="ml-auto text-xs text-muted-foreground">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
