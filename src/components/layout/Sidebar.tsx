
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  UserCircle,
  Building,
  Image
} from "lucide-react";

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
      ? "w-full flex items-center space-x-2 py-2 px-3 rounded-md bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "w-full flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Styles for submenus
  const submenuButton = "flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground";
  const submenuActive = "bg-sidebar-accent text-sidebar-accent-foreground font-medium";
  
  return (
    <SidebarContainer
      className={`border-r border-sidebar-border bg-primary/5 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between h-16 px-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="text-xl font-semibold text-primary">
            Sistema OS
          </div>
        )}
        <SidebarTrigger>
          <Menu size={20} />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel className="hidden">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
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

        {/* Clientes */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && "Clientes & Fornecedores"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
                    <div className="flex items-center space-x-2">
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
          <SidebarGroupLabel>
            {!isCollapsed && "Produtos & Serviços"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
                    <div className="flex items-center space-x-2">
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

        {/* Ordens */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && "Ordens de Serviço"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
                    <div className="flex items-center space-x-2">
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

        {/* Financeiro */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && "Financeiro"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
          <SidebarGroupLabel>
            {!isCollapsed && "Configurações"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
                    <div className="flex items-center space-x-2">
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

      <SidebarFooter className="mt-auto p-3 border-t border-sidebar-border">
        <div className="flex items-center space-x-2">
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                {profile?.nome}
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                {profile?.cargo}
              </p>
            </div>
          )}
          <button 
            className="p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
