
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
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  
  // O sidebar está colapsado se o estado for "collapsed"
  const isCollapsed = state === "collapsed";
  
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

  return (
    <SidebarContainer
      className={`border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between h-16 px-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="text-xl font-semibold text-sidebar-foreground">
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
                <SidebarMenuButton asChild>
                  <NavLink to="/app/clientes" end className={getNavClass}>
                    <Users size={20} />
                    {!isCollapsed && <span>Lista de Clientes</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!isCollapsed && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/app/clientes/novo"
                      className={getNavClass}
                    >
                      <span className="pl-7">Novo Cliente</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                <SidebarMenuButton asChild>
                  <NavLink to="/app/produtos" end className={getNavClass}>
                    <ShoppingCart size={20} />
                    {!isCollapsed && <span>Lista de Produtos</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!isCollapsed && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/app/produtos/novo"
                      className={getNavClass}
                    >
                      <span className="pl-7">Novo Produto</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                <SidebarMenuButton asChild>
                  <NavLink to="/app/ordens" end className={getNavClass}>
                    <FileText size={20} />
                    {!isCollapsed && <span>Lista de Ordens</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!isCollapsed && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/ordens/nova" className={getNavClass}>
                      <span className="pl-7">Nova Ordem</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                <SidebarMenuButton asChild>
                  <NavLink to="/app/configuracoes" className={getNavClass}>
                    <Settings size={20} />
                    {!isCollapsed && <span>Configurações Gerais</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-3 border-t border-sidebar-border">
        <div className="flex items-center space-x-2">
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                {usuario?.nome}
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                {usuario?.cargo}
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
