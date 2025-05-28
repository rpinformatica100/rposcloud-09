
import { useState, useEffect } from 'react';
import { AssinanteCompleto, TipoPessoa, ETAPAS_CADASTRO } from '@/types/assinante';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useAssinanteCadastro() {
  const { user, assistencia, atualizarPerfilAssistencia } = useAuth();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [dadosAssinante, setDadosAssinante] = useState<Partial<AssinanteCompleto>>({});
  const [loading, setLoading] = useState(false);

  // Carregar dados existentes
  useEffect(() => {
    if (assistencia) {
      const dadosExistentes: Partial<AssinanteCompleto> = {
        id: assistencia.id,
        nome: assistencia.nome,
        email: assistencia.email,
        telefone: assistencia.telefone || '',
        celular: assistencia.celular,
        tipoPessoa: assistencia.tipoPessoa,
        especialidades: assistencia.especialidades || [],
        statusCadastro: assistencia.statusCadastro || 'incompleto',
        cadastroCompleto: assistencia.cadastroCompleto || false,
        etapaAtual: assistencia.etapaAtual || 1,
        // Mapear outros campos conforme necessário
      };
      
      setDadosAssinante(dadosExistentes);
      setEtapaAtual(assistencia.etapaAtual || 1);
    }
  }, [assistencia]);

  const validarEtapa = (etapa: number): boolean => {
    switch (etapa) {
      case 1:
        return !!(dadosAssinante.tipoPessoa && dadosAssinante.nome && dadosAssinante.email && dadosAssinante.telefone);
      
      case 2:
        if (dadosAssinante.tipoPessoa === 'pessoa_fisica') {
          return !!(dadosAssinante.dadosPF?.cpf);
        } else {
          return !!(dadosAssinante.dadosPJ?.cnpj || dadosAssinante.dadosMEI?.cnpj);
        }
      
      case 3:
        return !!(dadosAssinante.especialidades && dadosAssinante.especialidades.length > 0);
      
      default:
        return false;
    }
  };

  const salvarEtapa = async (dadosEtapa: Partial<AssinanteCompleto>) => {
    setLoading(true);
    try {
      const dadosAtualizados = { ...dadosAssinante, ...dadosEtapa };
      setDadosAssinante(dadosAtualizados);
      
      // Mapear para o formato da assistencia existente
      const assistenciaAtualizada = {
        ...assistencia,
        nome: dadosAtualizados.nome,
        email: dadosAtualizados.email,
        telefone: dadosAtualizados.telefone,
        celular: dadosAtualizados.celular,
        tipoPessoa: dadosAtualizados.tipoPessoa,
        especialidades: dadosAtualizados.especialidades,
        statusCadastro: dadosAtualizados.statusCadastro,
        etapaAtual: etapaAtual,
        // Adicionar outros mapeamentos conforme necessário
      };
      
      await atualizarPerfilAssistencia(assistenciaAtualizada);
      
      toast.success('Dados salvos com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao salvar etapa:', error);
      toast.error('Erro ao salvar dados');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const proximaEtapa = async () => {
    if (validarEtapa(etapaAtual)) {
      if (etapaAtual < 3) {
        setEtapaAtual(etapaAtual + 1);
        await salvarEtapa({ etapaAtual: etapaAtual + 1 });
      } else {
        // Finalizar cadastro
        await finalizarCadastro();
      }
    } else {
      toast.error('Preencha todos os campos obrigatórios desta etapa');
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const finalizarCadastro = async () => {
    setLoading(true);
    try {
      const dadosFinais = {
        ...dadosAssinante,
        cadastroCompleto: true,
        statusCadastro: 'completo' as const,
        dataUltimaAtualizacao: new Date().toISOString(),
      };
      
      const sucesso = await salvarEtapa(dadosFinais);
      if (sucesso) {
        toast.success('Cadastro concluído com sucesso!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao finalizar cadastro:', error);
      toast.error('Erro ao finalizar cadastro');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const calcularProgresso = (): number => {
    const etapas = ETAPAS_CADASTRO.map((_, index) => validarEtapa(index + 1));
    const concluidas = etapas.filter(Boolean).length;
    return (concluidas / etapas.length) * 100;
  };

  return {
    etapaAtual,
    dadosAssinante,
    setDadosAssinante,
    loading,
    validarEtapa,
    salvarEtapa,
    proximaEtapa,
    etapaAnterior,
    finalizarCadastro,
    calcularProgresso,
    etapas: ETAPAS_CADASTRO,
  };
}
