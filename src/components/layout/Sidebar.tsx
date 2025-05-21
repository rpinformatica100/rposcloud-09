
import { useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  ShoppingCart,
  FileText,
  CreditCard,
  Settings,
  Menu,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile, logout } = useAuth();
  
  // O sidebar está colapsado se o estado for "collapsed"
  const isCollapsed = state === "collapsed";
  
  // Estilo para os links ativos e inativos
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center w-full space-x-3 py-2.5 px-3 rounded-md bg-indigo-600 text-white font-medium shadow-md"
      : "flex items-center w-full space-x-3 py-2.5 px-3 rounded-md hover:bg-indigo-500/20 text-gray-200 hover:text-white transition-colors";

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Redirecionar para a landing page após logout
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
      className={`border-r bg-gray-900 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!isCollapsed ? (
          <Link to="/" className="text-xl font-semibold text-white flex items-center">
            <div className="bg-indigo-600 text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">OS</div>
            <div className="truncate text-white font-bold">Sistema OS</div>
          </Link>
        ) : (
          <Link to="/" className="flex justify-center w-full">
            <div className="bg-indigo-600 text-white rounded-md w-8 h-8 flex items-center justify-center">OS</div>
          </Link>
        )}
        <SidebarTrigger>
          <div className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors">
            <Menu size={18} className="text-white" />
          </div>
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent className="bg-gray-900 pb-0">
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-none">
          {/* Dashboard */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-indigo-300 px-3 py-2"}>
              {!isCollapsed && "Principal"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3 py-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app" end className={getNavClass}>
                      <LayoutDashboard size={20} />
                      {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Cadastros */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-indigo-300 px-3 py-2"}>
              {!isCollapsed && "Cadastros"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3 py-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/clientes" className={getNavClass}>
                      <Users size={20} />
                      {!isCollapsed && <span>Clientes</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/produtos" className={getNavClass}>
                      <ShoppingCart size={20} />
                      {!isCollapsed && <span>Produtos</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Operacional */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-indigo-300 px-3 py-2"}>
              {!isCollapsed && "Operacional"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3 py-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/ordens" className={getNavClass}>
                      <FileText size={20} />
                      {!isCollapsed && <span>Ordens de Serviço</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/ordens/nova" className={getNavClass}>
                      <FileText size={20} />
                      {!isCollapsed && <span>Nova Ordem</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Financeiro */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-indigo-300 px-3 py-2"}>
              {!isCollapsed && "Financeiro"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3 py-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/financeiro" className={getNavClass}>
                      <CreditCard size={20} />
                      {!isCollapsed && <span>Movimentos</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Configurações */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-indigo-300 px-3 py-2"}>
              {!isCollapsed && "Sistema"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3 py-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/configuracoes" className={getNavClass}>
                      <Settings size={20} />
                      {!isCollapsed && <span>Configurações</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/configuracoes/perfil" className={getNavClass}>
                      <Settings size={20} />
                      {!isCollapsed && <span>Perfil da Empresa</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4 border-t border-gray-800">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 border-2 border-indigo-600/20">
              <AvatarFallback className="bg-indigo-600/20 text-indigo-200">
                {getInitials(profile?.nome)}
              </AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.nome}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {profile?.cargo || profile?.email}
                </p>
              </div>
            )}
          </div>
          
          {!isCollapsed ? (
            <button 
              className="w-full py-2 px-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white flex items-center justify-center space-x-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Sair do Sistema</span>
            </button>
          ) : (
            <button 
              className="w-full p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white flex items-center justify-center"
              onClick={handleLogout}
              title="Sair do Sistema"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
