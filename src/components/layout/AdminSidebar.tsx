
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  CloudCheck,
  BarChart2
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AdminSidebar = () => {
  const { state } = useSidebar();
  const { profile, logout } = useAuth();
  
  const isCollapsed = state === "collapsed";
  
  // Menu items para administradores
  const menuItems = [
    { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { title: "Assistências", path: "/admin/assistencias", icon: Users },
    { title: "Planos", path: "/admin/planos", icon: Package },
    { title: "Pagamentos", path: "/admin/pagamentos", icon: CreditCard },
    { title: "Relatórios", path: "/admin/relatorios", icon: BarChart2 },
    { title: "Configurações", path: "/admin/configuracoes", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
  
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };
  
  return (
    <SidebarContainer
      className={`border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <div className="flex flex-col h-full bg-gray-800 text-gray-100">
        <SidebarHeader className="flex items-center justify-between h-16 px-3 border-b border-gray-700">
          {!isCollapsed ? (
            <div className="flex items-center w-full">
              <Link to="/admin" className="text-lg font-semibold text-white flex items-center overflow-hidden">
                <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                  <CloudCheck size={18} />
                </div>
                <div className="truncate font-medium">RP OS Cloud Admin</div>
              </Link>
              
              <SidebarTrigger className="ml-auto">
                <div className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                  <ChevronLeft size={18} />
                </div>
              </SidebarTrigger>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link to="/admin" className="flex justify-center">
                <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center">
                  <CloudCheck size={18} />
                </div>
              </Link>
              
              <SidebarTrigger>
                <div className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-600 text-gray-300 transition-colors shadow-lg border border-gray-600">
                  <ChevronLeft size={18} className="transform rotate-180" />
                </div>
              </SidebarTrigger>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="overflow-hidden">
          <div className="py-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin" || item.path === "/admin/relatorios"}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 mx-2 my-1 rounded-lg
                  ${isActive 
                    ? "bg-primary/20 text-white font-medium" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.title}</span>}
              </NavLink>
            ))}
          </div>
        </SidebarContent>

        <SidebarFooter className="mt-auto border-t border-gray-700 p-3">
          <div className="flex items-center mb-3">
            <Avatar className="h-9 w-9 border border-gray-600">
              <AvatarFallback className="bg-gray-700 text-gray-300">
                {getInitials(profile?.nome)}
              </AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.nome}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Administrador
                </p>
              </div>
            )}
          </div>
          
          <button 
            className={`
              w-full rounded-lg transition-colors flex items-center justify-center
              ${!isCollapsed ? "px-3 py-2 space-x-2" : "p-2"}
              bg-red-900/30 hover:bg-red-800/50 text-red-300 
            `}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </SidebarFooter>
      </div>
    </SidebarContainer>
  );
};

export default AdminSidebar;
