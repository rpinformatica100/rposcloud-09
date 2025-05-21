
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cliente } from "@/types";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

interface ClienteCardProps {
  cliente?: Cliente;
}

export function ClienteCard({ cliente }: ClienteCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <User className="h-4 w-4 mr-2 text-primary" />
            Cliente
          </CardTitle>
          {cliente && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
            >
              Ver perfil
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {cliente ? (
          <div className="space-y-2 text-sm">
            <div className="font-medium">{cliente.nome}</div>
            
            {/* Informações principais em layout horizontal */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {cliente.documento && (
                <div>
                  <span className="text-muted-foreground">CPF/CNPJ:</span>{" "}
                  {cliente.documento}
                </div>
              )}
              {cliente.telefone && (
                <div>
                  <span className="text-muted-foreground">Tel:</span>{" "}
                  {cliente.telefone}
                </div>
              )}
              {cliente.email && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {cliente.email}
                </div>
              )}
              
              {/* Endereço em formato compacto */}
              {(cliente.endereco || cliente.cidade || cliente.estado) && (
                <div className="col-span-2 pt-1">
                  <p className="text-muted-foreground text-xs mb-0.5">Endereço:</p>
                  <p className="text-xs">
                    {cliente.endereco}
                    {(cliente.cidade || cliente.estado || cliente.cep) && (
                      <span>, {[
                        cliente.cidade,
                        cliente.estado,
                        cliente.cep
                      ].filter(Boolean).join(" - ")}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Nenhum cliente vinculado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
