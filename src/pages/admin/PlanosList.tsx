
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlanosList = () => {
  // Dados simulados de planos
  const planos = [
    { 
      id: 1, 
      nome: "Básico", 
      preco: 49.90, 
      precoAnual: 479.00,
      maxOrdens: 50,
      maxClientes: 30,
      maxUsuarios: 5,
      recursos: "Gestão de até 50 ordens, Cadastro de 30 clientes, 5 usuários, Relatórios básicos"
    },
    { 
      id: 2, 
      nome: "Profissional", 
      preco: 99.90, 
      precoAnual: 959.00,
      maxOrdens: 500,
      maxClientes: null,
      maxUsuarios: 15,
      recursos: "Gestão de até 500 ordens, Cadastro de clientes ilimitado, 15 usuários, Relatórios avançados, Suporte prioritário"
    },
    { 
      id: 3, 
      nome: "Empresarial", 
      preco: 199.90, 
      precoAnual: 1919.00,
      maxOrdens: null,
      maxClientes: null,
      maxUsuarios: null,
      recursos: "Ordens ilimitadas, Clientes ilimitados, Usuários ilimitados, Relatórios personalizados, Suporte 24/7"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planos</h1>
          <p className="text-muted-foreground">Gerencie os planos de assinatura disponíveis.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço Mensal</TableHead>
                <TableHead>Preço Anual</TableHead>
                <TableHead>Ordens</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planos.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">{plano.nome}</TableCell>
                  <TableCell>R$ {plano.preco.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>R$ {plano.precoAnual.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{plano.maxOrdens ? `${plano.maxOrdens}` : "Ilimitado"}</TableCell>
                  <TableCell>{plano.maxClientes ? `${plano.maxClientes}` : "Ilimitado"}</TableCell>
                  <TableCell>{plano.maxUsuarios ? `${plano.maxUsuarios}` : "Ilimitado"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Detalhes dos Planos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {planos.map((plano) => (
            <Card key={plano.id}>
              <CardHeader>
                <CardTitle>{plano.nome}</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-primary">R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground"> /mês</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ou R$ {plano.precoAnual.toFixed(2).replace('.', ',')} /ano
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {plano.recursos.split(", ").map((recurso, i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                      <span>{recurso}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanosList;
