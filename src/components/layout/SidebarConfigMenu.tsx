
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Settings, ChevronDown, Building } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConfigMenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface SidebarConfigMenuProps {
  isCollapsed: boolean;
}

const SidebarConfigMenu = ({ isCollapsed }: SidebarConfigMenuProps) => {
  const [configExpanded, setConfigExpanded] = useState(false);

  const configMenuItems: ConfigMenuItem[] = [
    { title: "Perfil da Empresa", path: "/app/configuracoes/perfil", icon: Building },
    { title: "Configurações", path: "/app/configuracoes/sistema", icon: Settings },
  ];

  const toggleConfigMenu = () => {
    if (!isCollapsed) {
      setConfigExpanded(!configExpanded);
    }
  };

  const isConfigActive = window.location.pathname.startsWith('/app/configuracoes');

  return (
    <div className="relative">
      <button
        onClick={toggleConfigMenu}
        className={`
          flex items-center w-full px-3 py-2.5 mx-2 my-1 rounded-lg transition-all duration-200
          ${isConfigActive
            ? "bg-primary/20 text-white font-medium" 
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }
        `}
      >
        <Settings size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="ml-3 flex-grow text-left text-sm font-medium">Configurações</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${configExpanded ? 'rotate-180' : 'rotate-0'}`} 
            />
          </>
        )}
      </button>
      
      {!isCollapsed && (
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${configExpanded ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}
          `}
        >
          <ScrollArea className="h-full max-h-80">
            <div className="ml-4 py-1 space-y-1">
              {configMenuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 mx-2 rounded-lg text-xs transition-all duration-200
                    ${isActive 
                      ? "bg-primary/15 text-white font-medium shadow-sm" 
                      : "text-gray-300 hover:bg-gray-700/70 hover:text-white"
                    }
                  `}
                >
                  <item.icon size={14} className="flex-shrink-0" />
                  <span className="ml-3 truncate font-medium">{item.title}</span>
                </NavLink>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SidebarConfigMenu;
