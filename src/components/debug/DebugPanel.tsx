
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bug, 
  ChevronDown, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle,
  XCircle,
  Users,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanStatus } from '@/hooks/usePlanStatus';
import { StateManager } from '@/utils/stateManager';
import { resetTestData } from '@/data/testUsers';
import { toast } from 'sonner';

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [backupData, setBackupData] = useState('');
  const { user } = useAuth();
  const { userPlan } = usePlanStatus();
  const stateManager = StateManager.getInstance();

  const handleCreateBackup = () => {
    const backup = stateManager.createBackup();
    setBackupData(backup);
    navigator.clipboard.writeText(backup);
    toast.success('Backup criado e copiado para a área de transferência');
  };

  const handleRestoreBackup = () => {
    if (!backupData.trim()) {
      toast.error('Cole o backup na caixa de texto primeiro');
      return;
    }
    
    const success = stateManager.restoreBackup(backupData);
    if (success) {
      toast.success('Backup restaurado com sucesso! Recarregue a página.');
    } else {
      toast.error('Erro ao restaurar backup');
    }
  };

  const handleResetTestData = () => {
    resetTestData();
    toast.success('Dados de teste resetados! Faça login novamente.');
    window.location.reload();
  };

  const handleValidateData = () => {
    const validation = stateManager.validateDataIntegrity();
    if (validation.isValid) {
      toast.success('Todos os dados estão íntegros');
    } else {
      toast.error(`Problemas encontrados: ${validation.errors.join(', ')}`);
    }
  };

  const getStorageInfo = () => {
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    const planKeys = Object.keys(localStorage).filter(key => key.startsWith('plan_'));
    const stateKeys = Object.keys(localStorage).filter(key => key.startsWith('user_state_'));
    
    return {
      users: allUsers.length,
      plans: planKeys.length,
      states: stateKeys.length,
      totalKeys: localStorage.length
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Painel de Debug e Testes
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
            <CardDescription>
              Ferramentas para desenvolvimento e testes do sistema
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Informações do Estado Atual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Usuário Atual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Nome:</span>
                        <span className="text-sm">{user.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Tipo:</span>
                        <Badge variant="outline">{user.tipo}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Plano:</span>
                        <Badge>{user.plano}</Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum usuário logado</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Informações de Armazenamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Usuários:</span>
                    <span className="text-sm">{storageInfo.users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Planos:</span>
                    <span className="text-sm">{storageInfo.plans}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estados:</span>
                    <span className="text-sm">{storageInfo.states}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total de Chaves:</span>
                    <span className="text-sm">{storageInfo.totalKeys}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status do Plano */}
            {userPlan && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Status do Plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium">Tipo:</span>
                      <p className="text-sm">{userPlan.planType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={userPlan.status === 'active' ? 'default' : 'destructive'}>
                        {userPlan.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Dias Restantes:</span>
                      <p className="text-sm">{userPlan.remainingDays}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">É Pago:</span>
                      <p className="text-sm">{userPlan.isPaid ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ferramentas de Backup */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Backup e Restauração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleCreateBackup} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Criar Backup
                  </Button>
                  <Button onClick={handleRestoreBackup} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Restaurar Backup
                  </Button>
                  <Button onClick={handleValidateData} variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Validar Dados
                  </Button>
                  <Button onClick={handleResetTestData} variant="destructive" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Completo
                  </Button>
                </div>
                
                <Textarea
                  placeholder="Cole aqui o backup para restaurar..."
                  value={backupData}
                  onChange={(e) => setBackupData(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Usuários de Teste */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Usuários de Teste Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><strong>teste@teste.com</strong> - senha: 123456 (Trial)</div>
                    <div><strong>basico@teste.com</strong> - senha: 123456 (Básico)</div>
                    <div><strong>profissional@teste.com</strong> - senha: 123456 (Profissional)</div>
                    <div><strong>enterprise@teste.com</strong> - senha: 123456 (Enterprise)</div>
                    <div><strong>expirado@teste.com</strong> - senha: 123456 (Expirado)</div>
                    <div><strong>admin@sistema.com</strong> - senha: admin123 (Admin)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
