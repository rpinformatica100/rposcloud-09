
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface OrdensFiltersProps {
  filtro: string;
  statusFiltro: string;
  onFiltroChange: (value: string) => void;
  onStatusFiltroChange: (value: string) => void;
}

export function OrdensFilters({ 
  filtro, 
  statusFiltro, 
  onFiltroChange, 
  onStatusFiltroChange 
}: OrdensFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
      <Select value={statusFiltro} onValueChange={onStatusFiltroChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os status</SelectItem>
          <SelectItem value="aberta">Abertas</SelectItem>
          <SelectItem value="andamento">Em andamento</SelectItem>
          <SelectItem value="concluida">Concluídas</SelectItem>
          <SelectItem value="cancelada">Canceladas</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar ordem..." 
          className="pl-9"
          value={filtro}
          onChange={(e) => onFiltroChange(e.target.value)}
        />
      </div>
    </div>
  );
}
