
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
                src="/placeholder.svg" 
                alt="Dashboard Preview" 
                className="rounded-lg shadow-lg max-w-full h-auto" 
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades Principais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ordens de Serviço</h3>
              <p className="text-gray-600">Crie, edite e acompanhe todas as suas ordens de serviço de forma simples e organizada.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastro de Clientes</h3>
              <p className="text-gray-600">Mantenha um banco de dados completo de seus clientes com histórico de serviços.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Controle Financeiro</h3>
              <p className="text-gray-600">Acompanhe receitas, despesas e faturamento de forma simples e intuitiva.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-white">
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">O que dizem nossos clientes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
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
            <div className="bg-white p-6 rounded-lg shadow-md">
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
              <h3 className="text-white font-semibold text-lg mb-4">Sistema OS</h3>
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
            <p>&copy; {new Date().getFullYear()} Sistema OS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
