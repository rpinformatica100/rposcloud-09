
import { useState } from "react";
import { toast } from "sonner";

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface CnpjResponse {
  nome: string;
  fantasia: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
}

export function useExternalServices() {
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCnpj, setLoadingCnpj] = useState(false);

  // Busca informações do CEP usando a API ViaCEP
  const fetchCep = async (cep: string): Promise<Partial<CepResponse> | null> => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      toast.error("CEP inválido");
      return null;
    }

    setLoadingCep(true);

    try {
      const formattedCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar CEP");
      }

      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao consultar CEP");
      return null;
    } finally {
      setLoadingCep(false);
    }
  };

  // Busca informações do CNPJ usando a API ReceitaWS
  const fetchCnpj = async (cnpj: string): Promise<Partial<CnpjResponse> | null> => {
    if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
      toast.error("CNPJ inválido");
      return null;
    }

    setLoadingCnpj(true);

    try {
      // Usando API pública para consulta de CNPJ
      const formattedCnpj = cnpj.replace(/\D/g, '');
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${formattedCnpj}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("CNPJ não encontrado");
          return null;
        }
        throw new Error("Erro ao buscar CNPJ");
      }

      const data = await response.json();
      
      // Formatando a resposta para o padrão esperado
      return {
        nome: data.razao_social || '',
        fantasia: data.nome_fantasia || '',
        telefone: data.ddd_telefone_1 || '',
        email: '',
        cep: data.cep || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio?.nome || '',
        uf: data.uf || ''
      };
    } catch (error) {
      console.error("Erro ao buscar CNPJ:", error);
      toast.error("Erro ao consultar CNPJ");
      return null;
    } finally {
      setLoadingCnpj(false);
    }
  };

  return {
    fetchCep,
    fetchCnpj,
    loadingCep,
    loadingCnpj
  };
}
