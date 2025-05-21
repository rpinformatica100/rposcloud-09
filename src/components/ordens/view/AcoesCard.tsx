
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrintOrderButton from "@/components/ordens/PrintOrderButton";
import { OrdemServico, ItemOrdemServico } from "@/types";

interface AcoesCardProps {
  ordem: OrdemServico;
  itens: ItemOrdemServico[];
}

export function AcoesCard({ ordem, itens }: AcoesCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Ações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate(`/ordens/editar/${ordem.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Ordem de Serviço
          </Button>
          {/* @ts-ignore - Temporarily ignoring type error until PrintOrderButton is updated */}
          <PrintOrderButton ordem={ordem} itens={itens} cliente={ordem.cliente} />
        </div>
      </CardContent>
    </Card>
  );
}
