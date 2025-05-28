
export class StateManager {
  private static instance: StateManager;
  
  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  saveUserState(userId: string, data: any) {
    try {
      const key = `user_state_${userId}`;
      const stateData = {
        ...data,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(key, JSON.stringify(stateData));
    } catch (error) {
      // Silently handle errors in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao salvar estado do usuário:', error);
      }
    }
  }

  loadUserState(userId: string): any | null {
    try {
      const key = `user_state_${userId}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao carregar estado do usuário:', error);
      }
    }
    return null;
  }

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
      
      return JSON.stringify(backup);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao criar backup:', error);
      }
      return '';
    }
  }

  restoreBackup(backupString: string): boolean {
    try {
      const backup = JSON.parse(backupString);
      
      localStorage.clear();
      
      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao restaurar backup:', error);
      }
      return false;
    }
  }

  validateDataIntegrity(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const users = JSON.parse(localStorage.getItem('all_users') || '[]');
      if (!Array.isArray(users)) {
        errors.push('Lista de usuários corrompida');
      }
      
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
