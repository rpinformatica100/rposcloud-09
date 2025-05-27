
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader as SidebarHeaderContainer,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  CreditCard,
  BarChart2,
  Star
} from "lucide-react";

// Import the new components
import SidebarMenuItem from "./SidebarMenuItem";
import SidebarConfigMenu from "./SidebarConfigMenu";
import SidebarProfile from "./SidebarProfile";
import SidebarHeader from "./SidebarHeader";

const Sidebar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Menu items para assistências técnicas - FIXED PATHS
  const menuItems = [
    { title: "Dashboard", path: "/app", icon: LayoutDashboard, exact: true },
    { title: "Clientes", path: "/app/clientes", icon: Users },
    { title: "Ordens de Serviço", path: "/app/ordens", icon: FileText },
    { title: "Produtos", path: "/app/produtos", icon: Package },
    { title: "Financeiro", path: "/app/financeiro", icon: CreditCard },
    { title: "Relatórios", path: "/app/relatorios", icon: BarChart2 },
    { title: "Plano", path: "/app/assinatura", icon: Star },
  ];

  return (
    <SidebarContainer
      className={`border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <div className="flex flex-col h-full bg-gray-800 text-gray-100">
        <SidebarHeaderContainer className="flex items-center justify-between h-16 px-3 border-b border-gray-700">
          <SidebarHeader isCollapsed={isCollapsed} />
        </SidebarHeaderContainer>

        <SidebarContent className="overflow-hidden">
          <div className="py-4">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.path}
                title={item.title}
                path={item.path}
                icon={item.icon}
                exact={item.exact}
                isCollapsed={isCollapsed}
              />
            ))}
            
            <SidebarConfigMenu isCollapsed={isCollapsed} />
          </div>
        </SidebarContent>

        <SidebarFooter className="mt-auto border-t border-gray-700 p-3">
          <SidebarProfile isCollapsed={isCollapsed} />
        </SidebarFooter>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
