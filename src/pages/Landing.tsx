
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();

  // Sample plans data (similar to what's in the admin panel)
  const planos = [
    { 
      id: 1, 
      nome: "Plano Básico", 
      periodo: "mensal",
      preco: 29.90,
      destacado: false,
      descricao: "Para profissionais autônomos"
    },
    { 
      id: 2, 
      nome: "Plano Profissional", 
      periodo: "mensal",
      preco: 99.90,
      destacado: true,
      descricao: "Para empresas de médio porte"
    },
    { 
      id: 3, 
      nome: "Plano Empresarial", 
      periodo: "mensal",
      preco: 199.90,
      destacado: false,
      descricao: "Para empresas com múltiplas filiais"
    }
  ];

  // Benefícios do sistema
  const beneficios = [
    {
      titulo: "Aumente sua produtividade",
      descricao: "Reduz o tempo gasto com tarefas administrativas em até 70%."
    },
    {
      titulo: "Organização completa",
      descricao: "Mantenha todos os dados de clientes, serviços e pagamentos organizados em um só lugar."
    },
    {
      titulo: "Controle total",
      descricao: "Acompanhe o status de cada ordem de serviço em tempo real."
    },
    {
      titulo: "Atendimento personalizado",
      descricao: "Histórico completo de cada cliente para oferecer um atendimento mais personalizado."
    }
  ];

  // Recursos detalhados
  const recursos = [
    {
      titulo: "Cadastro de Clientes",
      descricao: "Armazene informações detalhadas de seus clientes, incluindo histórico completo de atendimentos, preferências e observações importantes.",
      icone: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    },
    {
      titulo: "Ordens de Serviço",
      descricao: "Crie, edite e acompanhe ordens de serviço completas com descrição do problema, solução aplicada, peças utilizadas e valores.",
      icone: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    },
    {
      titulo: "Controle de Estoque",
      descricao: "Gerencie seu inventário de peças e produtos, com alertas de estoque baixo e relatórios de movimentação.",
      icone: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    },
    {
      titulo: "Financeiro Completo",
      descricao: "Controle de contas a pagar e receber, fluxo de caixa, relatórios financeiros e integração com sistemas de pagamento.",
      icone: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    },
    {
      titulo: "Relatórios e Estatísticas",
      descricao: "Visualize dados importantes do seu negócio com gráficos e relatórios personalizados para tomada de decisões estratégicas.",
      icone: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    },
    {
      titulo: "Notificações e Lembretes",
      descricao: "Sistema de notificações automáticas para clientes e equipe sobre prazos, pagamentos e atualizações de status.",
      icone: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-800 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Sistema de Ordens de Serviço</h1>
              <p className="text-xl mb-8">Gerencie seus serviços, clientes e orçamentos em um só lugar com facilidade e eficiência.</p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-800 hover:bg-blue-50 font-semibold"
                  onClick={() => navigate('/login')}
                >
                  Entrar no Sistema
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/register')}
                >
                  Criar Conta
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
                alt="Profissional gerenciando sistema de ordens de serviço" 
                className="rounded-lg shadow-lg max-w-full h-auto" 
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Por que escolher nosso sistema?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Nosso sistema de ordens de serviço foi desenvolvido para atender às necessidades específicas de
            oficinas, assistências técnicas e prestadores de serviço de todos os portes.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-blue-700">{beneficio.titulo}</h3>
                <p className="text-gray-600">{beneficio.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades Principais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recursos.slice(0, 3).map((recurso, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={recurso.icone} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{recurso.titulo}</h3>
                <p className="text-gray-600">{recurso.descricao}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8">E muito mais recursos...</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {recursos.slice(3, 6).map((recurso, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={recurso.icone} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{recurso.titulo}</h3>
                  <p className="text-gray-600">{recurso.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Como funciona</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Nosso sistema foi desenvolvido para ser intuitivo e fácil de usar, mesmo para quem não tem experiência com tecnologia.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Cadastre-se</h3>
              <p className="text-sm text-gray-600">Crie sua conta em menos de 2 minutos e comece a usar.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">Configure seu perfil</h3>
              <p className="text-sm text-gray-600">Personalize o sistema com os dados da sua empresa.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Cadastre clientes</h3>
              <p className="text-sm text-gray-600">Importe seus clientes ou cadastre-os manualmente.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold mb-2">Comece a usar</h3>
              <p className="text-sm text-gray-600">Crie suas primeiras ordens de serviço e organize seu trabalho.</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/register')}
            >
              Começar agora
            </Button>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-3">Planos e Preços</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Escolha o plano que melhor se adapta às necessidades do seu negócio e comece a gerenciar seus serviços hoje mesmo.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {planos.map((plano) => (
              <Card key={plano.id} className={plano.destacado ? "border-2 border-primary relative" : ""}>
                {plano.destacado && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-md">
                    Recomendado
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plano.nome}</CardTitle>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-primary">R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
                    <span className="text-muted-foreground"> /mês</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{plano.descricao}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Acesso a todas as funcionalidades</span>
                    </div>
                    <div className="flex items-start">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Suporte técnico</span>
                    </div>
                    <div className="flex items-start">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Atualizações incluídas</span>
                    </div>
                    {plano.nome === "Plano Profissional" && (
                      <>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                          <span>Até 5 usuários</span>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                          <span>Recursos avançados de relatórios</span>
                        </div>
                      </>
                    )}
                    {plano.nome === "Plano Empresarial" && (
                      <>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                          <span>Usuários ilimitados</span>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                          <span>API para integrações personalizadas</span>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                          <span>Suporte prioritário</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/register')}>
                    Começar agora
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">O que dizem nossos clientes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-lg">JT</span>
                </div>
                <div>
                  <h4 className="font-semibold">João Torres</h4>
                  <p className="text-gray-600 text-sm">Oficina Mecânica Torres</p>
                </div>
              </div>
              <p className="text-gray-700">"Com este sistema conseguimos organizar todas as nossas ordens de serviço e melhorar o atendimento aos clientes. Muito fácil de usar e completo!"</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-lg">MS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maria Silva</h4>
                  <p className="text-gray-600 text-sm">Assistência Técnica Silva</p>
                </div>
              </div>
              <p className="text-gray-700">"Aumentamos nossa eficiência em 40% após implementar o sistema. O controle financeiro e a gestão de clientes são excelentes!"</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-lg">RP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Roberto Pereira</h4>
                  <p className="text-gray-600 text-sm">Eletrônica RP</p>
                </div>
              </div>
              <p className="text-gray-700">"O sistema simplificou completamente nossa rotina. A interface é intuitiva e o suporte técnico é excelente quando precisamos de ajuda."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Experimente nosso sistema por 14 dias grátis, sem compromisso. Não é necessário cartão de crédito.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-800 hover:bg-blue-50 font-semibold"
              onClick={() => navigate('/register')}
            >
              Criar conta grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Já tenho uma conta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">TechOS</h3>
              <p className="mb-4">Soluções completas para gestão de ordens de serviço e atendimento ao cliente.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planos e Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Serviço</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} TechOS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
