
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Package,
  Wrench,
  CreditCard
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

const Sidebar = () => {
  const { state } = useSidebar();
  const { profile, logout } = useAuth();
  const [configExpanded, setConfigExpanded] = useState(false);
  
  const isCollapsed = state === "collapsed";
  
  // Menu items para assistências técnicas
  const menuItems = [
    { title: "Dashboard", path: "/", icon: LayoutDashboard, exact: true },
    { title: "Clientes", path: "/clientes", icon: Users },
    { title: "Ordens de Serviço", path: "/ordens", icon: FileText },
    { title: "Produtos", path: "/produtos", icon: Package },
    { title: "Financeiro", path: "/financeiro", icon: CreditCard },
  ];

  const configMenuItems = [
    { title: "Empresa", path: "/configuracoes/perfil", icon: Wrench },
    { title: "Configurações", path: "/configuracoes", icon: Settings, exact: true },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const toggleConfigMenu = () => {
    setConfigExpanded(!configExpanded);
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
              <Link to="/" className="text-lg font-semibold text-white flex items-center overflow-hidden">
                <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                  <Wrench size={18} />
                </div>
                <div className="truncate font-medium">TechOS</div>
              </Link>
              
              <SidebarTrigger className="ml-auto">
                <div className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                  <ChevronLeft size={18} />
                </div>
              </SidebarTrigger>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link to="/" className="flex justify-center">
                <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center">
                  <Wrench size={18} />
                </div>
              </Link>
              
              <SidebarTrigger>
                <div className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
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
                end={item.exact}
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
            
            <div className="relative">
              <button
                onClick={toggleConfigMenu}
                className={`
                  flex items-center w-full px-3 py-2.5 mx-2 my-1 rounded-lg
                  ${window.location.pathname.startsWith('/configuracoes')
                    ? "bg-primary/20 text-white font-medium" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <Settings size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-grow text-left">Configurações</span>
                    <ChevronLeft 
                      size={16} 
                      className={`transition-transform ${configExpanded ? 'rotate-270' : 'rotate-180'}`} 
                    />
                  </>
                )}
              </button>
              
              {configExpanded && !isCollapsed && (
                <div className="ml-6 mt-1">
                  {configMenuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) => `
                        flex items-center px-3 py-2 mx-2 my-1 rounded-lg text-sm
                        ${isActive 
                          ? "bg-primary/10 text-white font-medium" 
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }
                      `}
                    >
                      <item.icon size={16} className="flex-shrink-0" />
                      <span className="ml-3">{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SidebarContent>

        <SidebarFooter className="mt-auto border-t border-gray-700 p-3">
          <div className="flex items-center mb-3">
            <Avatar className="h-9 w-9 border border-gray-600">
              {/* Fix: Replace profile?.avatar with assistencia?.logo or null check */}
              <AvatarImage src={profile?.assistencia?.logo || undefined} alt={profile?.nome} />
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
                  {profile?.email}
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

export default Sidebar;
