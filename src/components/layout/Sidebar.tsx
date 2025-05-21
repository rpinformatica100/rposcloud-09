
import { useState } from "react";
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
  FileText,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Globe,
  FileText2,
  User,
  CreditCard,
  Bell
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Sidebar = () => {
  const { state } = useSidebar();
  const { profile, logout } = useAuth();
  const [configMenuOpen, setConfigMenuOpen] = useState(false);
  
  const isCollapsed = state === "collapsed";
  
  // Menu items simplificados
  const menuItems = [
    { title: "Dashboard", path: "/app", icon: LayoutDashboard },
    { title: "Clientes", path: "/app/clientes", icon: Users },
    { title: "Produtos/Serviços", path: "/app/produtos", icon: Package },
    { title: "Ordens de Serviço", path: "/app/ordens", icon: FileText },
    { title: "Financeiro", path: "/app/financeiro", icon: Wallet },
  ];
  
  // Sub-menu de configurações
  const configItems = [
    { title: "Geral", path: "/app/configuracoes", icon: Globe, exact: true },
    { title: "Perfil da Empresa", path: "/app/configuracoes/perfil", icon: User },
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
      className={`border-r border-gray-200 bg-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between h-16 px-3 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center w-full">
            <Link to="/" className="text-lg font-semibold text-gray-800 flex items-center overflow-hidden">
              <div className="bg-gray-800 text-white rounded-md w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                OS
              </div>
              <div className="truncate font-medium">Sistema OS</div>
            </Link>
            
            <SidebarTrigger className="ml-auto">
              <div className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                <ChevronLeft size={18} />
              </div>
            </SidebarTrigger>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex justify-center">
              <div className="bg-gray-800 text-white rounded-md w-8 h-8 flex items-center justify-center">
                OS
              </div>
            </Link>
            
            <SidebarTrigger>
              <div className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                <ChevronLeft size={18} className="transform rotate-180" />
              </div>
            </SidebarTrigger>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-white overflow-hidden">
        <div className="py-4">
          {/* Regular menu items */}
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/app"}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 mx-2 my-1 rounded-lg
                ${isActive 
                  ? "bg-gray-100 text-gray-800 font-medium" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">{item.title}</span>}
            </NavLink>
          ))}
          
          {/* Configurações com submenu */}
          <div className="mx-2 my-1">
            <Collapsible
              open={configMenuOpen}
              onOpenChange={setConfigMenuOpen}
              className={`rounded-lg overflow-hidden ${configMenuOpen ? 'bg-gray-50' : ''}`}
            >
              <CollapsibleTrigger className="w-full text-left">
                <div className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg
                  ${
                    window.location.pathname.startsWith('/app/configuracoes')
                      ? "bg-gray-100 text-gray-800 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}>
                  <div className="flex items-center">
                    <Settings size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">Configurações</span>}
                  </div>
                  {!isCollapsed && (
                    configMenuOpen ? 
                    <ChevronUp size={16} /> : 
                    <ChevronDown size={16} />
                  )}
                </div>
              </CollapsibleTrigger>
              
              {!isCollapsed && (
                <CollapsibleContent>
                  <div className="pl-5 pr-2 py-1">
                    {configItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => `
                          flex items-center px-3 py-2 my-1 rounded-md text-sm
                          ${isActive 
                            ? "bg-gray-100 text-gray-800 font-medium" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <item.icon size={16} className="flex-shrink-0" />
                        <span className="ml-2">{item.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-gray-200 p-3">
        <div className="flex items-center mb-3">
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {getInitials(profile?.nome)}
            </AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-800 truncate">
                {profile?.nome}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.cargo || profile?.email}
              </p>
            </div>
          )}
        </div>
        
        <button 
          className={`
            w-full rounded-lg transition-colors flex items-center justify-center
            ${!isCollapsed ? "px-3 py-2 space-x-2" : "p-2"}
            bg-red-50 hover:bg-red-100 text-red-600 
          `}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
