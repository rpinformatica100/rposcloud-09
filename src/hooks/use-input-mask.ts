
import { ChangeEvent } from "react";

export function useInputMask() {
  // Máscara para CEP: 12345-678
  const cepMask = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    
    e.target.value = value;
    return e;
  };

  // Máscara para telefone: (12) 34567-8900
  const phoneMask = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    if (value.length > 0) {
      value = `(${value.slice(0, 2)}${value.length > 2 ? ') ' : ''}${value.slice(2, 7)}${value.length > 7 ? '-' : ''}${value.slice(7, 11)}`;
    }
    
    e.target.value = value;
    return e;
  };

  // Máscara para CNPJ: 12.345.678/0001-90
  const cnpjMask = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
    
    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
    return e;
  };

  // Máscara para CPF: 123.456.789-00
  const cpfMask = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    if (value.length > 0) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1-$2');
    }
    
    e.target.value = value;
    return e;
  };

  // Função genérica para detectar se é CPF ou CNPJ e aplicar a máscara correspondente
  const documentMask = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    
    if (digits.length <= 11) {
      return cpfMask(e);
    } else {
      return cnpjMask(e);
    }
  };

  // Máscara para moeda: R$ 1.234,56
  const currencyMask = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value) {
      value = (parseInt(value) / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      e.target.value = `R$ ${value}`;
    } else {
      e.target.value = '';
    }
    
    return e;
  };

  // Função para extrair valor numérico de um valor formatado em moeda
  const currencyToNumber = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/\D/g, '')) / 100;
  };

  return {
    cepMask,
    phoneMask,
    cnpjMask,
    cpfMask,
    documentMask,
    currencyMask,
    currencyToNumber,
  };
}
