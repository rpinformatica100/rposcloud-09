
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Settings, ChevronDown, Building } from "lucide-react";
import { LucideIcon } from "lucide-react";

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
    { title: "Empresa", path: "/configuracoes/perfil", icon: Building },
    { title: "Configurações", path: "/configuracoes/assistencia", icon: Settings, exact: true },
  ];

  const toggleConfigMenu = () => {
    if (!isCollapsed) {
      setConfigExpanded(!configExpanded);
    }
  };

  const isConfigActive = window.location.pathname.startsWith('/configuracoes');

  return (
    <div className="relative">
      <button
        onClick={toggleConfigMenu}
        className={`
          flex items-center w-full px-3 py-2.5 mx-2 my-1 rounded-lg transition-colors
          ${isConfigActive
            ? "bg-primary/20 text-white font-medium" 
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }
        `}
      >
        <Settings size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="ml-3 flex-grow text-left">Configurações</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${configExpanded ? 'rotate-180' : 'rotate-0'}`} 
            />
          </>
        )}
      </button>
      
      <div 
        className={`
          overflow-hidden transition-all duration-200 ease-in-out
          ${configExpanded && !isCollapsed ? 'max-h-24 opacity-100 mb-2' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="ml-6 py-1">
          {configMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center px-3 py-2 mx-2 my-1 rounded-lg text-sm transition-colors
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
      </div>
    </div>
  );
};

export default SidebarConfigMenu;
