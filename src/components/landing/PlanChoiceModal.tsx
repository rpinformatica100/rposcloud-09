
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Star, Zap } from 'lucide-react';
import AuthModal from './AuthModal';

interface PlanChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanChoiceModal({ isOpen, onClose }: PlanChoiceModalProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<'trial' | 'paid' | null>(null);

  const handleTrialChoice = () => {
    setSelectedChoice('trial');
    setAuthModalOpen(true);
  };

  const handlePaidChoice = () => {
    setSelectedChoice('paid');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    onClose();
    
    if (selectedChoice === 'trial') {
      // Redirecionar para ativação do trial
      window.location.href = '/app?activate-trial=true';
    } else {
      // Redirecionar para seleção de planos pagos
      window.location.href = '/app?show-plans=true';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold">
              Escolha sua forma de começar
            </DialogTitle>
            <DialogDescription className="text-lg">
              Teste grátis por 7 dias ou comece com um plano pago
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trial Gratuito */}
            <Card className="relative border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  <Gift className="w-4 h-4 mr-1" />
                  Grátis
                </Badge>
              </div>
              
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Trial Gratuito</CardTitle>
                <CardDescription>
                  Teste todas as funcionalidades por 7 dias
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">R$ 0</div>
                  <div className="text-sm text-gray-500">por 7 dias</div>
                </div>
                
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Até 50 ordens de serviço
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Gestão básica de clientes
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Relatórios essenciais
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Suporte por email
                  </li>
                </ul>
                
                <Button 
                  onClick={handleTrialChoice}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  size="lg"
                >
                  Começar Teste Grátis
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Sem cartão de crédito necessário
                </p>
              </CardContent>
            </Card>

            {/* Planos Pagos */}
            <Card className="relative border-2 border-green-200 hover:border-green-400 transition-colors">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1">
                  <Star className="w-4 h-4 mr-1" />
                  Recomendado
                </Badge>
              </div>
              
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Planos Pagos</CardTitle>
                <CardDescription>
                  Acesso completo a todas as funcionalidades
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">R$ 49,90</div>
                  <div className="text-sm text-gray-500">a partir de /mês</div>
                </div>
                
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Ordens de serviço ilimitadas
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Clientes ilimitados
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Relatórios avançados
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Suporte prioritário
                  </li>
                </ul>
                
                <Button 
                  onClick={handlePaidChoice}
                  className="w-full bg-green-500 hover:bg-green-600"
                  size="lg"
                >
                  Ver Planos Pagos
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Várias opções de pagamento
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab="register"
        trialContext={selectedChoice === 'trial'}
      />
    </>
  );
}
