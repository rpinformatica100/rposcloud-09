
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

export const useSupabaseHelpers = () => {
  const { user } = useSupabaseAuth();

  const getCurrentUserAssistenciaId = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('assistencias')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Erro ao buscar assistencia_id:', error);
        return null;
      }
      
      return data?.id || null;
    } catch (error) {
      console.error('Erro em getCurrentUserAssistenciaId:', error);
      return null;
    }
  };

  const updateUserProfile = async (updates: any) => {
    if (!user) return { error: 'Usuário não autenticado' };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { error };
    }
  };

  const updateUserAssistencia = async (updates: any) => {
    if (!user) return { error: 'Usuário não autenticado' };
    
    try {
      const { data, error } = await supabase
        .from('assistencias')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Erro ao atualizar assistência:', error);
      return { error };
    }
  };

  return {
    getCurrentUserAssistenciaId,
    updateUserProfile,
    updateUserAssistencia
  };
};
