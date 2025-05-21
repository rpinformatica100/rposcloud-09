
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Briefcase, 
  Calendar, 
  CreditCard, 
  FileText, 
  Settings, 
  Users, 
  Wallet,
  Info,
  CheckCircle,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  // Dados dos planos de pagamento
  const plans = [
    {
      name: "Básico",
      price: "49,90",
      annualPrice: "479,00",
      features: [
        "Gestão de até 50 ordens",
        "Cadastro de 30 clientes", 
        "5 usuários",
        "Relatórios básicos"
      ],
      recommended: false
    },
    {
      name: "Profissional",
      price: "99,90",
      annualPrice: "959,00",
      features: [
        "Gestão de até 500 ordens",
        "Cadastro de clientes ilimitado", 
        "15 usuários",
        "Relatórios avançados",
        "Suporte prioritário",
        "Acesso ao aplicativo móvel"
      ],
      recommended: true
    },
    {
      name: "Empresarial",
      price: "199,90",
      annualPrice: "1.919,00",
      features: [
        "Ordens ilimitadas",
        "Clientes ilimitados", 
        "Usuários ilimitados",
        "Relatórios personalizados",
        "Suporte 24/7",
        "API para integrações",
        "Personalização completa"
      ],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10">
      {/* Hero Section */}
      <section className="w-full px-4 py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-primary">
              Sistema de Ordens de Serviço
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A solução completa para gerenciar suas ordens de serviço, clientes, 
              produtos e finanças de forma simples e eficiente.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate("/login")}
                    className="min-w-[160px]"
                  >
                    Entrar
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/register")}
                    className="min-w-[160px]"
                  >
                    Criar Conta
                  </Button>
                </>
              ) : isAdmin ? (
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/app")}
                    className="min-w-[160px]"
                  >
                    Acessar Sistema
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate("/admin")}
                    className="min-w-[160px] bg-gray-800 hover:bg-gray-700"
                  >
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Painel Admin
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={() => navigate("/app")}
                  className="min-w-[160px]"
                >
                  Acessar Sistema
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Funcionalidades Principais</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nosso sistema oferece tudo o que você precisa para gerenciar seu negócio de serviços de forma eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card card-hover">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ordens de Serviço</h3>
              <p className="text-muted-foreground">
                Crie e gerencie suas ordens de serviço de forma simples e eficiente.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card card-hover">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gestão de Clientes</h3>
              <p className="text-muted-foreground">
                Mantenha um cadastro completo de seus clientes e histórico de serviços.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card card-hover">
              <Wallet className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Controle Financeiro</h3>
              <p className="text-muted-foreground">
                Acompanhe receitas e despesas relacionadas aos serviços prestados.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card card-hover">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Agendamento</h3>
              <p className="text-muted-foreground">
                Organize sua agenda de serviços e evite conflitos de horários.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="w-full px-4 py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Por que escolher nosso sistema?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desenvolvido por especialistas em gestão de serviços para atender todas as suas necessidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 border rounded-lg bg-card">
              <div className="flex-shrink-0 mt-1">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Fácil de usar</h3>
                <p className="text-muted-foreground">
                  Interface intuitiva que não requer conhecimentos técnicos avançados.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 border rounded-lg bg-card">
              <div className="flex-shrink-0 mt-1">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Acesso em qualquer lugar</h3>
                <p className="text-muted-foreground">
                  Sistema baseado em nuvem, acessível de qualquer dispositivo com internet.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 border rounded-lg bg-card">
              <div className="flex-shrink-0 mt-1">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Suporte técnico</h3>
                <p className="text-muted-foreground">
                  Equipe de suporte disponível para ajudar com quaisquer dúvidas.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 border rounded-lg bg-card">
              <div className="flex-shrink-0 mt-1">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Atualizações constantes</h3>
                <p className="text-muted-foreground">
                  Novas funcionalidades e melhorias são adicionadas regularmente.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 border rounded-lg bg-card">
              <div className="flex-shrink-0 mt-1">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Segurança avançada</h3>
                <p className="text-muted-foreground">
                  Seus dados estão protegidos com as mais modernas tecnologias de segurança.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 border rounded-lg bg-card">
              <div className="flex-shrink-0 mt-1">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Relatórios detalhados</h3>
                <p className="text-muted-foreground">
                  Visualize o desempenho do seu negócio com relatórios personalizáveis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="w-full px-4 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Planos de Pagamento</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano que melhor se adapta às necessidades do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`${plan.recommended ? 'border-primary border-2 shadow-lg' : ''}`}>
                {plan.recommended && (
                  <div className="bg-primary text-white py-1 px-3 text-sm font-medium absolute top-0 right-0 rounded-bl rounded-tr">
                    Recomendado
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-primary">R$ {plan.price}</span>
                      <span className="text-muted-foreground"> /mês</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ou R$ {plan.annualPrice}/ano (economia de 20%)
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.recommended ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.recommended ? 'default' : 'outline'}
                    onClick={() => navigate("/register")}
                  >
                    Começar Agora
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Precisa de um plano personalizado para sua empresa?
            </p>
            <Button variant="outline" size="lg">
              Entre em contato conosco
            </Button>
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="w-full px-4 py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-primary mb-4">Sistema Completo de Gestão</h2>
              <p className="text-muted-foreground mb-6">
                Nossa plataforma inclui todas as ferramentas necessárias para gerenciar sua assistência técnica:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Controle total de ordens de serviço</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Cadastro completo de clientes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Gestão de estoque de produtos e peças</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Sistema financeiro integrado</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Relatórios e indicadores de desempenho</span>
                </li>
              </ul>
              <Button className="mt-6" onClick={() => navigate("/app")}>
                <Settings className="mr-2 h-4 w-4" /> Explorar Sistema
              </Button>
            </div>
            <div className="md:w-1/2 bg-slate-100 rounded-lg p-6">
              <div className="border border-border bg-card rounded-md shadow-sm p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <h3 className="font-medium">Dashboard da Assistência Técnica</h3>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <span className="font-medium">Clientes</span>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">158</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <span className="font-medium">Ordens Ativas</span>
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">43</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <span className="font-medium">Ordens Concluídas</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">189</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <span className="font-medium">Faturamento Mensal</span>
                    <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">R$ 15.890,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full px-4 py-12 md:py-24 bg-primary/5">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Pronto para começar?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Registre-se agora e aproveite 14 dias de teste gratuito em qualquer plano.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/register")}>
              Criar Conta Grátis
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Fazer Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 py-12 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sistema OS</h3>
              <p className="text-muted-foreground">
                A solução completa para gerenciamento de ordens de serviço.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Funcionalidades</a></li>
                <li><a href="#planos" className="text-muted-foreground hover:text-primary">Planos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Demonstração</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Central de ajuda</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Base de conhecimento</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Termos de uso</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacidade</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Sistema OS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
