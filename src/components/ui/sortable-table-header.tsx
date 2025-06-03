
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortConfig } from "@/hooks/useTableSort";

interface SortableTableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableTableHeader({
  children,
  sortKey,
  sortConfig,
  onSort,
  className
}: SortableTableHeaderProps) {
  const getSortIcon = () => {
    if (!sortConfig || sortConfig.key !== sortKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => onSort(sortKey)}
      >
        {children}
        {getSortIcon()}
      </Button>
    </div>
  );
}
