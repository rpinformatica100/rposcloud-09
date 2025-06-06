
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const TesteCadastro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dados, setDados] = useState<any>(null);
  
  const { signUp } = useSupabaseAuth();

  const handleTestarCadastro = async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando teste de cadastro...');
      const { error } = await signUp(nome, email, senha, 'assistencia');
      
      if (error) {
        console.error('Erro no cadastro:', error);
        toast.error(`Erro: ${error.message}`);
      } else {
        console.log('Cadastro realizado com sucesso');
        toast.success('Cadastro realizado com sucesso!');
        
        // Aguardar um pouco e verificar os dados criados
        setTimeout(async () => {
          await verificarDadosCriados();
        }, 2000);
      }
    } catch (error) {
      console.error('Exceção no cadastro:', error);
      toast.error('Erro inesperado no cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const verificarDadosCriados = async () => {
    try {
      console.log('Verificando dados criados...');
      
      // Verificar profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);
      
      // Verificar assistencias
      const { data: assistencias, error: assistenciaError } = await supabase
        .from('assistencias')
        .select('*')
        .eq('email', email);

      console.log('Profiles encontrados:', profiles);
      console.log('Assistências encontradas:', assistencias);
      
      if (profileError) console.error('Erro ao buscar profiles:', profileError);
      if (assistenciaError) console.error('Erro ao buscar assistências:', assistenciaError);
      
      setDados({
        profiles: profiles || [],
        assistencias: assistencias || [],
        profileError,
        assistenciaError
      });
      
    } catch (error) {
      console.error('Erro ao verificar dados:', error);
    }
  };

  const limparDados = () => {
    setEmail('');
    setSenha('');
    setNome('');
    setDados(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Teste de Cadastro</CardTitle>
        <CardDescription>
          Teste para verificar se o cadastro de assistências está funcionando
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-nome">Nome da Assistência</Label>
          <Input
            id="test-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Assistência Teste"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="test-email">Email</Label>
          <Input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teste@exemplo.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="test-senha">Senha</Label>
          <Input
            id="test-senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleTestarCadastro} 
            disabled={isLoading || !email || !senha || !nome}
            className="flex-1"
          >
            {isLoading ? 'Testando...' : 'Testar Cadastro'}
          </Button>
          <Button variant="outline" onClick={limparDados}>
            Limpar
          </Button>
        </div>
        
        {dados && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Resultados:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Profiles:</strong> {dados.profiles.length} encontrado(s)</p>
              <p><strong>Assistências:</strong> {dados.assistencias.length} encontrada(s)</p>
              {dados.profileError && (
                <p className="text-red-600">Erro profiles: {dados.profileError.message}</p>
              )}
              {dados.assistenciaError && (
                <p className="text-red-600">Erro assistências: {dados.assistenciaError.message}</p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={verificarDadosCriados}
              className="mt-2"
            >
              Verificar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
