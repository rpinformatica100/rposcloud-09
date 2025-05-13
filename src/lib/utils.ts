
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata valor monetário em BRL
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valor);
}

// Formata data para formato brasileiro
export function formatarData(data: string | Date): string {
  if (!data) return '';
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleDateString('pt-BR');
}

// Gera um ID único
export function gerarId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Limita o tamanho de um texto e adiciona "..." se necessário
export function limitarTexto(texto: string, tamanho: number): string {
  if (!texto) return '';
  return texto.length > tamanho ? texto.substring(0, tamanho) + '...' : texto;
}
