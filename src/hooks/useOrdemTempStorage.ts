
import { useState, useEffect } from 'react';
import { OrdemServico } from '@/types';

interface OrdemTempData {
  formData: Partial<OrdemServico>;
  timestamp: string;
  activeTab?: string;
}

export function useOrdemTempStorage() {
  const STORAGE_KEY = 'ordem_temp_draft';

  const saveOrdemTemp = (data: Partial<OrdemServico>, activeTab?: string) => {
    try {
      const tempData: OrdemTempData = {
        formData: data,
        timestamp: new Date().toISOString(),
        activeTab
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tempData));
      console.log('Rascunho da OS salvo automaticamente');
    } catch (error) {
      console.error('Erro ao salvar rascunho da OS:', error);
    }
  };

  const loadOrdemTemp = (): OrdemTempData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OrdemTempData;
        // Verificar se o rascunho não é muito antigo (24 horas)
        const savedTime = new Date(parsed.timestamp);
        const now = new Date();
        const diffHours = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
        
        if (diffHours < 24) {
          return parsed;
        } else {
          clearOrdemTemp();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar rascunho da OS:', error);
    }
    return null;
  };

  const clearOrdemTemp = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasOrdemTemp = (): boolean => {
    return loadOrdemTemp() !== null;
  };

  return {
    saveOrdemTemp,
    loadOrdemTemp,
    clearOrdemTemp,
    hasOrdemTemp
  };
}
