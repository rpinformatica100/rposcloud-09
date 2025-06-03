
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useAssinanteCadastro } from '@/hooks/useAssinanteCadastro';
import { useAuth } from '@/contexts/AuthContext';
import EtapaDadosBasicos from '@/components/assinante/EtapaDadosBasicos';
import EtapaDadosFiscais from '@/components/assinante/EtapaDadosFiscais';
import EtapaPerfilProfissional from '@/components/assinante/EtapaPerfilProfissional';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CompletarCadastro = () => {
  const navigate = useNavigate();
  const { atualizarPerfilAssistencia } = useAuth();
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const {
    etapaAtual,
    dadosAssinante,
    setDadosAssinante,
    loading,
    validarEtapa,
    proximaEtapa,
    etapaAnterior,
    finalizarCadastro,
    calcularProgresso,
    etapas,
  } = useAssinanteCadastro();

  const handleProximaEtapa = async () => {
    if (etapaAtual === 3) {
      const sucesso = await finalizarCadastro();
      if (sucesso) {
        navigate('/app');
      }
    } else {
      await proximaEtapa();
    }
  };

  const handleSairCadastro = async () => {
    // Marcar que o usuário escolheu sair do cadastro
    await atualizarPerfilAssistencia({
      mensagemCadastroExibida: true,
      // Salvar progresso atual para não perder dados
      progressoCadastro: {
        etapaAtual,
        dados: dadosAssinante,
        dataUltimaTentativa: new Date().toISOString()
      }
    });
    
    setShowExitDialog(false);
    navigate('/app');
  };

  const renderEtapaAtual = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <EtapaDadosBasicos
            dados={dadosAssinante}
            onUpdate={setDadosAssinante}
          />
        );
      case 2:
        return (
          <EtapaDadosFiscais
            dados={dadosAssinante}
            onUpdate={setDadosAssinante}
          />
        );
      case 3:
        return (
          <EtapaPerfilProfissional
            dados={dadosAssinante}
            onUpdate={setDadosAssinante}
          />
        );
      default:
        return null;
    }
  };

  const etapaInfo = etapas[etapaAtual - 1];
  const progresso = calcularProgresso();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 top-0 text-gray-600 hover:text-gray-800"
            onClick={() => setShowExitDialog(true)}
          >
            <X className="h-4 w-4 mr-2" />
            Sair
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete seu Cadastro
          </h1>
          <p className="text-gray-600">
            Finalize seu perfil para usar todas as funcionalidades do sistema
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Progresso do Cadastro
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progresso)}% concluído
              </span>
            </div>
            <Progress value={progresso} className="h-2 mb-4" />
            
            <div className="flex justify-between">
              {etapas.map((etapa, index) => (
                <div
                  key={etapa.numero}
                  className={`flex items-center ${
                    index < etapas.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        validarEtapa(etapa.numero)
                          ? 'bg-green-500 text-white'
                          : etapa.numero === etapaAtual
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {validarEtapa(etapa.numero) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        etapa.numero
                      )}
                    </div>
                    <div className="ml-2">
                      <div className="text-xs font-medium text-gray-900">
                        {etapa.titulo}
                      </div>
                    </div>
                  </div>
                  {index < etapas.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Etapa Atual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {etapaAtual}
              </span>
              {etapaInfo.titulo}
            </CardTitle>
            <CardDescription>{etapaInfo.descricao}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderEtapaAtual()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={etapaAnterior}
                disabled={etapaAtual === 1 || loading}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              <Button
                onClick={handleProximaEtapa}
                disabled={!validarEtapa(etapaAtual) || loading}
                className="flex items-center gap-2"
              >
                {etapaAtual === 3 ? 'Finalizar Cadastro' : 'Próxima Etapa'}
                {etapaAtual < 3 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de confirmação para sair */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sair do cadastro?</DialogTitle>
              <DialogDescription className="space-y-2">
                <p>Você pode completar seu cadastro mais tarde, mas algumas funcionalidades podem estar limitadas.</p>
                <p className="text-sm text-gray-600">
                  Seu progresso atual ({Math.round(progresso)}%) será salvo e você poderá continuar quando quiser.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowExitDialog(false)}>
                Continuar Cadastro
              </Button>
              <Button variant="secondary" onClick={handleSairCadastro}>
                Sair por Agora
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompletarCadastro;
