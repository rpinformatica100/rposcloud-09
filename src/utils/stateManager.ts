
// Gerenciador de estado para persistência sem banco de dados
export class StateManager {
  private static instance: StateManager;
  
  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  // Salvar estado completo do usuário
  saveUserState(userId: string, data: any) {
    try {
      const key = `user_state_${userId}`;
      const stateData = {
        ...data,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(key, JSON.stringify(stateData));
      console.log(`Estado do usuário ${userId} salvo`, stateData);
    } catch (error) {
      console.error('Erro ao salvar estado do usuário:', error);
    }
  }

  // Carregar estado do usuário
  loadUserState(userId: string): any | null {
    try {
      const key = `user_state_${userId}`;
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`Estado do usuário ${userId} carregado`, parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Erro ao carregar estado do usuário:', error);
    }
    return null;
  }

  // Backup completo de todos os dados
  createBackup(): string {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        data: {}
      };
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          backup.data[key] = localStorage.getItem(key);
        }
      }
      
      const backupString = JSON.stringify(backup);
      console.log('Backup criado:', backup);
      return backupString;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return '';
    }
  }

  // Restaurar backup
  restoreBackup(backupString: string): boolean {
    try {
      const backup = JSON.parse(backupString);
      
      // Limpar localStorage atual
      localStorage.clear();
      
      // Restaurar dados
      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      
      console.log('Backup restaurado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Verificar integridade dos dados
  validateDataIntegrity(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      // Verificar usuários
      const users = JSON.parse(localStorage.getItem('all_users') || '[]');
      if (!Array.isArray(users)) {
        errors.push('Lista de usuários corrompida');
      }
      
      // Verificar planos de usuários
      users.forEach((user: any) => {
        if (user.id) {
          const planKey = `plan_${user.id}`;
          const planData = localStorage.getItem(planKey);
          if (planData) {
            try {
              JSON.parse(planData);
            } catch {
              errors.push(`Plano do usuário ${user.email} corrompido`);
            }
          }
        }
      });
      
    } catch (error) {
      errors.push('Erro geral na validação de dados');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
