
import { Link } from "react-router-dom";
import { ChevronLeft, Wrench } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader = ({ isCollapsed }: SidebarHeaderProps) => {
  return (
    <>
      {!isCollapsed ? (
        <div className="flex items-center w-full">
          <Link to="/dashboard" className="text-lg font-semibold text-white flex items-center overflow-hidden">
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
          <Link to="/dashboard" className="flex justify-center">
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
    </>
  );
};

export default SidebarHeader;
