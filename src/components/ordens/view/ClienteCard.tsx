
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cliente } from "@/types";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin } from "lucide-react";

interface ClienteCardProps {
  cliente?: Cliente;
}

export function ClienteCard({ cliente }: ClienteCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <User className="h-4 w-4 mr-2 text-primary" />
            Cliente
          </CardTitle>
          {cliente && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-primary"
              onClick={() => navigate(`/app/clientes/${cliente.id}/editar`)}
            >
              Ver perfil
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {cliente ? (
          <>
            {/* Nome do cliente destacado */}
            <div className="font-semibold text-gray-900">{cliente.nome}</div>
            
            {/* Informações essenciais com ícones */}
            <div className="space-y-2">
              {cliente.telefone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{cliente.telefone}</span>
                </div>
              )}
              
              {cliente.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 truncate">{cliente.email}</span>
                </div>
              )}
              
              {(cliente.endereco || cliente.cidade) && (
                <div className="flex items-start text-sm">
                  <MapPin className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-gray-700 text-xs leading-relaxed">
                    {cliente.endereco && <div>{cliente.endereco}</div>}
                    {(cliente.cidade || cliente.estado) && (
                      <div className="text-gray-500">
                        {[cliente.cidade, cliente.estado, cliente.cep].filter(Boolean).join(" - ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {cliente.documento && (
                <div className="text-xs text-gray-500 pt-1 border-t">
                  <span className="font-medium">Doc:</span> {cliente.documento}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <User className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">Nenhum cliente vinculado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
