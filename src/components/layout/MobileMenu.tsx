import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Cloud, LogOut, ChevronDown } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  CreditCard,
  BarChart2,
  Settings,
  Building
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, signOut } = useSupabaseAuth();
  const [configExpanded, setConfigExpanded] = useState(false);

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard, exact: true },
    { title: "Clientes", path: "/clientes", icon: Users },
    { title: "Ordens de Serviço", path: "/ordens", icon: FileText },
    { title: "Produtos", path: "/produtos", icon: Package },
    { title: "Financeiro", path: "/financeiro", icon: CreditCard },
    { title: "Relatórios", path: "/relatorios", icon: BarChart2 },
  ];

  const configMenuItems = [
    { title: "Empresa", path: "/configuracoes/perfil", icon: Building },
    { title: "Configurações", path: "/configuracoes/assistencia", icon: Settings, exact: true },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    setConfigExpanded(false);
  };

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
    window.location.href = "/";
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-gray-800 text-gray-100 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center h-16 px-4 border-b border-gray-700">
            <Link to="/dashboard" className="text-lg font-semibold text-white flex items-center" onClick={handleLinkClick}>
              <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                <Cloud size={18} />
              </div>
              <div className="truncate font-medium">RP OS Cloud</div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 mx-2 my-1 rounded-lg transition-colors
                  ${isActive 
                    ? "bg-primary/20 text-white font-medium" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
                onClick={handleLinkClick}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3">{item.title}</span>
              </NavLink>
            ))}
            
            {/* Configurações Menu */}
            <div className="relative">
              <button
                onClick={toggleConfigMenu}
                className={`
                  flex items-center w-full px-4 py-3 mx-2 my-1 rounded-lg transition-colors
                  ${window.location.pathname.startsWith('/configuracoes')
                    ? "bg-primary/20 text-white font-medium" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <Settings size={20} className="flex-shrink-0" />
                <span className="ml-3 flex-grow text-left">Configurações</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${configExpanded ? 'rotate-180' : 'rotate-0'}`} 
                />
              </button>
              
              <div 
                className={`
                  overflow-hidden transition-all duration-200 ease-in-out
                  ${configExpanded ? 'max-h-24 opacity-100 mb-2' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="ml-6 py-1">
                  {configMenuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) => `
                        flex items-center px-4 py-2 mx-2 my-1 rounded-lg text-sm transition-colors
                        ${isActive 
                          ? "bg-primary/10 text-white font-medium" 
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }
                      `}
                      onClick={handleLinkClick}
                    >
                      <item.icon size={16} className="flex-shrink-0" />
                      <span className="ml-3">{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Profile */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center mb-4">
              <Avatar className="h-9 w-9 border border-gray-600">
                <AvatarFallback className="bg-gray-700 text-gray-300">
                  {getInitials(profile?.nome)}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.nome}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Assistência Técnica
                </p>
              </div>
            </div>
            
            <button 
              className="w-full rounded-lg transition-colors flex items-center justify-center px-3 py-2 space-x-2 bg-red-900/30 hover:bg-red-800/50 text-red-300"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
