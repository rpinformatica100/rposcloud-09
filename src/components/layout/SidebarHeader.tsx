
import { Link } from "react-router-dom";
import { ChevronLeft, Cloud } from "lucide-react";
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
              <Cloud size={18} />
            </div>
            <div className="truncate font-medium">RP OS Cloud</div>
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
              <Cloud size={18} />
            </div>
          </Link>
          
          <SidebarTrigger>
            <div className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-600 text-gray-300 transition-colors shadow-lg border border-gray-600">
              <ChevronLeft size={18} className="transform rotate-180" />
            </div>
          </SidebarTrigger>
        </div>
      )}
    </>
  );
};

export default SidebarHeader;
