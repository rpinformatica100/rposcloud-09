
import { User, LogOut } from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface SupabaseSidebarProfileProps {
  isCollapsed: boolean;
}

const SupabaseSidebarProfile = ({ isCollapsed }: SupabaseSidebarProfileProps) => {
  const { user, profile, signOut } = useSupabaseAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
  };

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-700"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-600 text-white text-xs">
                {getInitials(profile?.nome || user?.email)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" side="right">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.nome || "Usuário"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {profile?.tipo || "Não definido"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start p-2 h-auto hover:bg-gray-700"
        >
          <div className="flex items-center space-x-3 w-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-600 text-white text-xs">
                {getInitials(profile?.nome || user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {profile?.nome || "Usuário"}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {profile?.tipo || "Não definido"}
              </p>
            </div>
            <User className="h-4 w-4 text-gray-300 flex-shrink-0" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.nome || "Usuário"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {profile?.tipo || "Não definido"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SupabaseSidebarProfile;
