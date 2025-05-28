// Usuários de teste predefinidos para o sistema
export interface TestUser {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: 'cliente' | 'assistencia';
  empresa?: string;
  plano: string;
  status_plano: string;
  data_cadastro: string;
  data_vencimento_plano: string;
}

export const testUsers: TestUser[] = [
  {
    id: 'user_teste_001',
    nome: 'Assistência Teste',
    email: 'teste@teste.com',
    senha: '123456',
    tipo: 'assistencia',
    empresa: 'Assistência Teste Ltda',
    plano: 'trial_plan',
    status_plano: 'trial',
    data_cadastro: new Date().toISOString(),
    data_vencimento_plano: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user_monthly_001',
    nome: 'Assistência Mensal',
    email: 'mensal@teste.com',
    senha: '123456',
    tipo: 'assistencia',
    empresa: 'Assistência Mensal Ltda',
    plano: 'monthly',
    status_plano: 'active',
    data_cadastro: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    data_vencimento_plano: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user_quarterly_001',
    nome: 'Assistência Trimestral',
    email: 'trimestral@teste.com',
    senha: '123456',
    tipo: 'assistencia',
    empresa: 'Assistência Trimestral Ltda',
    plano: 'quarterly',
    status_plano: 'active',
    data_cadastro: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    data_vencimento_plano: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user_yearly_001',
    nome: 'Assistência Anual',
    email: 'anual@teste.com',
    senha: '123456',
    tipo: 'assistencia',
    empresa: 'Assistência Anual Ltda',
    plano: 'yearly',
    status_plano: 'active',
    data_cadastro: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    data_vencimento_plano: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user_expired_001',
    nome: 'Assistência Expirada',
    email: 'expirado@teste.com',
    senha: '123456',
    tipo: 'assistencia',
    empresa: 'Assistência Expirada Ltda',
    plano: 'trial_plan',
    status_plano: 'expired',
    data_cadastro: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    data_vencimento_plano: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Função para inicializar usuários de teste no localStorage
export const initializeTestUsers = () => {
  const existingUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
  const allUserEmails = existingUsers.map((user: any) => user.email);
  
  const newUsers = testUsers.filter(testUser => !allUserEmails.includes(testUser.email));
  
  if (newUsers.length > 0) {
    const updatedUsers = [...existingUsers, ...newUsers];
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));
    console.log(`${newUsers.length} usuários de teste adicionados:`, newUsers.map(u => u.email));
  } else {
    console.log('Todos os usuários de teste já existem');
  }
};

// Função para resetar dados de teste (útil para desenvolvimento)
export const resetTestData = () => {
  localStorage.removeItem('all_users');
  localStorage.removeItem('usuario');
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('plan_')) {
      localStorage.removeItem(key);
    }
  });
  initializeTestUsers();
  console.log('Dados de teste resetados e reinicializados');
};
