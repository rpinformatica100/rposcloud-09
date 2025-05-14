
import { useState } from "react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Sidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile, logout } = useAuth();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  
  // O sidebar está colapsado se o estado for "collapsed"
  const isCollapsed = state === "collapsed";
  
  // Toggle submenu visibility
  const toggleSubmenu = (menuKey: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  
  // Verifica se o caminho atual está dentro de um grupo
  const isPathInGroup = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  // Estilo para os links ativos
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center w-full space-x-3 py-2 px-3 rounded-md bg-primary text-primary-foreground font-medium"
      : "flex items-center w-full space-x-3 py-2 px-3 rounded-md hover:bg-slate-200/50 text-slate-700";

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Redirecionar para a landing page após logout
  };

  // Styles for submenus
  const submenuButton = "flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-slate-200/50 text-slate-700";
  const submenuActive = "bg-primary text-primary-foreground font-medium";
  
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };
  
  return (
    <SidebarContainer
      className={`border-r bg-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between h-16 px-4 border-b">
        {!isCollapsed ? (
          <Link to="/" className="text-xl font-semibold text-primary flex items-center">
            <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">OS</div>
            <span className="text-primary font-bold">Sistema OS</span>
          </Link>
        ) : (
          <Link to="/" className="flex justify-center w-full">
            <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center">OS</div>
          </Link>
        )}
        <SidebarTrigger>
          <Menu size={20} className="text-slate-600" />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent className="px-3 py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app" end className={getNavClass}>
                    <Home size={20} />
                    {!isCollapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Ordens */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-slate-500 px-3 py-2"}>
            {!isCollapsed && "Ordens de Serviço"}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3 py-1">
            <SidebarMenu>
              <SidebarMenuItem>
                {isCollapsed ? (
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/ordens" className={getNavClass}>
                      <FileText size={20} />
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <button 
                    className={`${submenuButton} ${isPathInGroup(['/app/ordens']) ? submenuActive : ''}`}
                    onClick={() => toggleSubmenu('ordens')}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText size={20} />
                      <span>Ordens</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${openSubmenus.ordens ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </SidebarMenuItem>
              
              {!isCollapsed && openSubmenus.ordens && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/ordens" end className={getNavClass}>
                        Lista de Ordens
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/ordens/nova" className={getNavClass}>
                        Nova Ordem
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Clientes */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-slate-500 px-3 py-2"}>
            {!isCollapsed && "Cadastros"}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3 py-1">
            <SidebarMenu>
              <SidebarMenuItem>
                {isCollapsed ? (
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/clientes" className={getNavClass}>
                      <Users size={20} />
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <button 
                    className={`${submenuButton} ${isPathInGroup(['/app/clientes']) ? submenuActive : ''}`}
                    onClick={() => toggleSubmenu('clientes')}
                  >
                    <div className="flex items-center space-x-3">
                      <Users size={20} />
                      <span>Clientes</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${openSubmenus.clientes ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </SidebarMenuItem>
              
              {!isCollapsed && openSubmenus.clientes && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/clientes" end className={getNavClass}>
                        Lista de Clientes
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/clientes/novo" className={getNavClass}>
                        Novo Cliente
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Produtos */}
        <SidebarGroup>
          <SidebarGroupContent className="px-3 py-1">
            <SidebarMenu>
              <SidebarMenuItem>
                {isCollapsed ? (
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/produtos" className={getNavClass}>
                      <ShoppingCart size={20} />
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <button 
                    className={`${submenuButton} ${isPathInGroup(['/app/produtos']) ? submenuActive : ''}`}
                    onClick={() => toggleSubmenu('produtos')}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingCart size={20} />
                      <span>Produtos</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${openSubmenus.produtos ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </SidebarMenuItem>
              
              {!isCollapsed && openSubmenus.produtos && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/produtos" end className={getNavClass}>
                        Lista de Produtos
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/produtos/novo" className={getNavClass}>
                        Novo Produto
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Financeiro */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-slate-500 px-3 py-2"}>
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
          <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "text-xs font-medium text-slate-500 px-3 py-2"}>
            {!isCollapsed && "Configurações"}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3 py-1">
            <SidebarMenu>
              <SidebarMenuItem>
                {isCollapsed ? (
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/configuracoes" className={getNavClass}>
                      <Settings size={20} />
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <button 
                    className={`${submenuButton} ${isPathInGroup(['/app/configuracoes']) ? submenuActive : ''}`}
                    onClick={() => toggleSubmenu('configuracoes')}
                  >
                    <div className="flex items-center space-x-3">
                      <Settings size={20} />
                      <span>Configurações</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${openSubmenus.configuracoes ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </SidebarMenuItem>
              
              {!isCollapsed && openSubmenus.configuracoes && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/configuracoes" end className={getNavClass}>
                        Configurações Gerais
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <NavLink to="/app/configuracoes/perfil" className={getNavClass}>
                        Perfil da Empresa
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4 border-t">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(profile?.nome)}
            </AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 truncate">
                {profile?.nome}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {profile?.cargo || profile?.email}
              </p>
            </div>
          )}
          <button 
            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 flex items-center justify-center"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
