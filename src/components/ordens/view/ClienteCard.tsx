
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cliente } from "@/types";
import { useNavigate } from "react-router-dom";

interface ClienteCardProps {
  cliente?: Cliente;
}

export function ClienteCard({ cliente }: ClienteCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        {cliente ? (
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">{cliente.nome}</h3>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              {cliente.documento && (
                <div>
                  <span className="font-medium">
                    Documento:
                  </span>{" "}
                  {cliente.documento}
                </div>
              )}
              {cliente.email && (
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {cliente.email}
                </div>
              )}
              {cliente.telefone && (
                <div>
                  <span className="font-medium">Telefone:</span>{" "}
                  {cliente.telefone}
                </div>
              )}
            </div>

            {(cliente.endereco ||
              cliente.cidade ||
              cliente.estado) && (
              <>
                <Separator />
                <div className="space-y-1 text-sm">
                  {cliente.endereco && (
                    <div>{cliente.endereco}</div>
                  )}
                  <div>
                    {[
                      cliente.cidade,
                      cliente.estado,
                      cliente.cep,
                    ]
                      .filter(Boolean)
                      .join(" - ")}
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
              >
                Ver detalhes do cliente
              </Button>
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
