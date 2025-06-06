
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";

const CadastroIncompleto = () => {
  const { assistencia } = useSupabaseAuth();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    // Mostrar o alerta apenas se:
    // 1. Existe uma assistência logada
    // 2. O cadastro não está completo
    // 3. A mensagem não foi exibida antes (primeira vez ou quando redefine)
    if (
      assistencia && 
      assistencia.cadastroCompleto === false && 
      assistencia.mensagemCadastroExibida === false
    ) {
      setMostrarAlerta(true);
    } else {
      setMostrarAlerta(false);
    }
  }, [assistencia]);

  const fecharAlerta = async () => {
    setMostrarAlerta(false);
    
    // Marcar que a mensagem já foi exibida para não mostrar novamente
    if (assistencia) {
      try {
        const { error } = await supabase
          .from('assistencias')
          .update({ mensagem_cadastro_exibida: true })
          .eq('id', assistencia.id);
        
        if (error) {
          console.error('Erro ao atualizar mensagem cadastro exibida:', error);
        }
      } catch (error) {
        console.error('Erro ao fechar alerta:', error);
      }
    }
  };

  const calcularProgresso = (): number => {
    if (!assistencia) return 0;
    
    let camposPreenchidos = 0;
    let totalCampos = 6; // Campos básicos necessários
    
    // Verificar campos básicos
    if (assistencia.nome) camposPreenchidos++;
    if (assistencia.email) camposPreenchidos++;
    if (assistencia.telefone) camposPreenchidos++;
    if (assistencia.responsavel) camposPreenchidos++;
    
    // Verificar documento (CPF ou CNPJ)
    if ((assistencia as any).cpf || (assistencia as any).cnpj) camposPreenchidos++;
    
    // Verificar endereço básico
    if ((assistencia as any).endereco) camposPreenchidos++;
    
    return Math.round((camposPreenchidos / totalCampos) * 100);
  };

  if (!mostrarAlerta) return null;

  const progresso = calcularProgresso();

  return (
    <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 mb-4 relative">
      <AlertCircle className="h-5 w-5 text-blue-600" />
      <AlertDescription className="text-blue-900 pr-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <span className="font-semibold text-lg">Complete seu cadastro</span>
            <p className="text-sm text-blue-700 mt-1">
              Finalize seu perfil para usar todas as funcionalidades do sistema
            </p>
            <div className="mt-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <span>Progresso:</span>
                <div className="flex-1 bg-blue-200 rounded-full h-2 max-w-32">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progresso}%` }}
                  />
                </div>
                <span className="font-medium">{progresso}%</span>
              </div>
            </div>
            <Button 
              asChild 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Link to="/app/configuracoes" className="flex items-center gap-2">
                Completar agora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
        onClick={fecharAlerta}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar</span>
      </Button>
    </Alert>
  );
};

export default CadastroIncompleto;
