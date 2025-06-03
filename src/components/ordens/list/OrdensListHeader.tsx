
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrdensFilters } from "./OrdensFilters";

interface OrdensListHeaderProps {
  filtro: string;
  statusFiltro: string;
  onFiltroChange: (value: string) => void;
  onStatusFiltroChange: (value: string) => void;
}

export function OrdensListHeader({ 
  filtro, 
  statusFiltro, 
  onFiltroChange, 
  onStatusFiltroChange 
}: OrdensListHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
        <Button onClick={() => navigate('/app/ordens/nova')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ordem
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Lista de Ordens</h2>
          <p className="text-muted-foreground">
            Gerencie as ordens de serviço
          </p>
        </div>
        <OrdensFilters 
          filtro={filtro}
          statusFiltro={statusFiltro}
          onFiltroChange={onFiltroChange}
          onStatusFiltroChange={onStatusFiltroChange}
        />
      </div>
    </div>
  );
}
