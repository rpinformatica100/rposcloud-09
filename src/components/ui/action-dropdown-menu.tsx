
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Eye, Download, Printer, Link2 } from "lucide-react";

interface ActionItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive";
  separator?: boolean;
}

interface ActionDropdownMenuProps {
  actions: ActionItem[];
  align?: "start" | "center" | "end";
}

export function ActionDropdownMenu({ actions, align = "end" }: ActionDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="bg-background">
        {actions.map((action, index) => (
          <div key={index}>
            {action.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem 
              onClick={action.onClick}
              className={action.variant === "destructive" ? "text-red-600 focus:text-red-600" : ""}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Edit, Trash, Eye, Download, Printer, Link2 };
