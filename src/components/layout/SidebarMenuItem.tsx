
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  title: string;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
  isCollapsed: boolean;
}

const SidebarMenuItem = ({ 
  title, 
  path, 
  icon: Icon, 
  exact = false, 
  isCollapsed 
}: SidebarMenuItemProps) => {
  return (
    <NavLink
      to={path}
      end={exact}
      className={({ isActive }) => `
        flex items-center px-3 py-2.5 mx-2 my-1 rounded-lg
        ${isActive 
          ? "bg-primary/20 text-white font-medium" 
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }
      `}
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && <span className="ml-3">{title}</span>}
    </NavLink>
  );
};

export default SidebarMenuItem;
