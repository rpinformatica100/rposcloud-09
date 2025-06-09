
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

interface SidebarProfileProps {
  isCollapsed: boolean;
}

const SidebarProfile = ({ isCollapsed }: SidebarProfileProps) => {
  const { profile, signOut, assistencia } = useSupabaseAuth();
  
  const handleLogout = () => {
    signOut();
    window.location.href = "/login";
  };
  
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };
  
  return (
    <>
      <div className="flex items-center mb-3">
        <Avatar className="h-9 w-9 border border-gray-600">
          <AvatarImage src={assistencia?.logo || undefined} alt={profile?.nome} />
          <AvatarFallback className="bg-gray-700 text-gray-300">
            {getInitials(profile?.nome)}
          </AvatarFallback>
        </Avatar>
        
        {!isCollapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {profile?.nome}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {profile?.email}
            </p>
          </div>
        )}
      </div>
      
      <button 
        className={`
          w-full rounded-lg transition-colors flex items-center justify-center
          ${!isCollapsed ? "px-3 py-2 space-x-2" : "p-2"}
          bg-red-900/30 hover:bg-red-800/50 text-red-300 
        `}
        onClick={handleLogout}
      >
        <LogOut size={18} />
        {!isCollapsed && <span>Sair</span>}
      </button>
    </>
  );
};

export default SidebarProfile;
