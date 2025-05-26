import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PlanosSection from '@/components/landing/PlanosSection';
import MobileNav from '@/components/landing/MobileNav';
import { Package, BarChart2, Settings as SettingsIcon } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      title: "Ordens de Serviço",
      description: "Crie e gerencie ordens de serviço de maneira prática e rápida. Acompanhe o status de cada ordem em tempo real.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-10 md:w-10 text-primary">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <path d="M14 2v6h6"></path>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
          <path d="M10 9H8"></path>
        </svg>
      )
    },
    {
      title: "Gestão de Clientes",
      description: "Cadastre e mantenha um histórico completo de seus clientes. Acesse rapidamente todas as informações relevantes.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-10 md:w-10 text-primary">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: "Controle Financeiro",
      description: "Tenha controle total sobre suas finanças. Acompanhe entradas, saídas e gere relatórios completos.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-10 md:w-10 text-primary">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
          <path d="M12 6v2"></path>
          <path d="M12 16v2"></path>
        </svg>
      )
    },
    {
      title: "Gestão de Produtos",
      description: "Organize seu catálogo de produtos e serviços, controle estoque e facilite a adição em ordens de serviço.",
      icon: <Package className="h-8 w-8 md:h-10 md:w-10 text-primary" />
    },
    {
      title: "Relatórios Detalhados",
      description: "Visualize o desempenho da sua assistência com relatórios customizáveis sobre ordens, finanças e clientes.",
      icon: <BarChart2 className="h-8 w-8 md:h-10 md:w-10 text-primary" />
    },
    {
      title: "Configurações Flexíveis",
      description: "Adapte a plataforma às suas necessidades com configurações personalizáveis para sua empresa e fluxo de trabalho.",
      icon: <SettingsIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation - Otimizada para Mobile */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <div className="bg-primary text-white rounded-md w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <Link to="/" className="text-base md:text-lg font-semibold text-foreground">TechOS</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="font-medium transition-colors hover:text-primary">Recursos</a>
            <a href="#planos" className="font-medium transition-colors hover:text-primary">Planos</a>
            <a href="#testimonials" className="font-medium transition-colors hover:text-primary">Depoimentos</a>
            <a href="#faq" className="font-medium transition-colors hover:text-primary">Perguntas</a>
          </nav>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Registrar</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </header>
      
      {/* Hero Section - Otimizada para Mobile */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center space-y-6 md:space-y-10 text-center">
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl animate-fade-in">
              Gerencie sua <span className="text-primary">Assistência Técnica</span> de maneira completa
            </h1>
            <p className="mx-auto max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-xl/relaxed dark:text-gray-400 animate-fade-in px-4">
              Simplifique processos, organize ordens de serviço e tenha controle financeiro em uma única plataforma.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in w-full max-w-sm sm:max-w-none">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="story-link hover-scale w-full sm:w-auto">
                Comece Grátis
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="hover-scale w-full sm:w-auto">
                Saiba Mais
              </Button>
            </a>
          </div>
          
          <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl rounded-lg border overflow-hidden shadow-xl animate-scale-in mx-4">
            <img 
              src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Dashboard da plataforma TechOS"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section - Cards Responsivos */}
      <section id="features" className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 animate-fade-in">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Recursos</div>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter">Tudo que você precisa em um só lugar</h2>
              <p className="max-w-[600px] md:max-w-[900px] text-gray-500 text-base md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400 px-4">
                Nossa plataforma foi projetada para atender às necessidades específicas de assistências técnicas.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 py-8 md:py-12 px-4">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg border bg-background p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] animate-fade-in">
                <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 text-center">
                  {feature.icon}
                  <h3 className="text-lg md:text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Planos Section */}
      <PlanosSection />
      
      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 animate-fade-in">Depoimentos</div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter animate-fade-in">Clientes satisfeitos</h2>
              <p className="max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400 animate-fade-in px-4">
                Veja o que nossos clientes estão falando sobre nossa plataforma.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 py-8 md:py-12 px-4">
            {[
              {
                name: "João Silva",
                role: "Proprietário da TecnoCell",
                content: "A plataforma TechOS revolucionou o gerenciamento da minha assistência técnica. Tudo é muito mais organizado e eficiente agora.",
                avatar: "https://randomuser.me/api/portraits/men/42.jpg"
              },
              {
                name: "Maria Oliveira",
                role: "Gerente da InfoTech",
                content: "O módulo financeiro é fantástico! Consigo ter um controle muito melhor do meu fluxo de caixa e das receitas da empresa.",
                avatar: "https://randomuser.me/api/portraits/women/65.jpg"
              },
              {
                name: "Carlos Santos",
                role: "Técnico na CompuServ",
                content: "A facilidade em criar ordens de serviço e acompanhar o status de cada uma delas tornou meu trabalho muito mais produtivo.",
                avatar: "https://randomuser.me/api/portraits/men/22.jpg"
              },
            ].map((testimonial, index) => (
              <div key={index} className="rounded-lg border bg-background p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] animate-fade-in">
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm md:text-base">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-sm md:text-base">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 animate-fade-in">FAQ</div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter animate-fade-in">Perguntas Frequentes</h2>
              <p className="max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400 animate-fade-in px-4">
                Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 py-8 md:py-12 px-4">
            {[
              {
                question: "Como posso começar a usar o TechOS?",
                answer: "Basta se registrar em nossa plataforma, escolher um plano adequado às suas necessidades e começar a configurar sua assistência técnica. Todo o processo é simples e intuitivo."
              },
              {
                question: "Posso experimentar antes de assinar?",
                answer: "Sim, oferecemos um período de teste gratuito de 14 dias com todas as funcionalidades disponíveis para que você possa avaliar nossa plataforma."
              },
              {
                question: "É possível migrar meus dados de outro sistema?",
                answer: "Sim, nossa equipe de suporte pode ajudá-lo com a migração de dados de outros sistemas. Entre em contato conosco para obter mais informações."
              },
              {
                question: "Quais são as formas de pagamento?",
                answer: "Aceitamos cartões de crédito, boleto bancário e PIX. Os pagamentos são processados de forma segura através de nossa plataforma."
              },
              {
                question: "O sistema funciona em dispositivos móveis?",
                answer: "Sim, nossa plataforma é totalmente responsiva e pode ser acessada de qualquer dispositivo com acesso à internet, incluindo smartphones e tablets."
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-lg border bg-background p-4 md:p-6 shadow-sm animate-fade-in">
                <h3 className="text-base md:text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 animate-scale-in">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">Pronto para transformar sua assistência técnica?</h2>
              <p className="max-w-[600px] md:max-w-[700px] text-base md:text-xl/relaxed px-4">
                Comece agora mesmo e descubra como o TechOS pode melhorar a eficiência do seu negócio.
              </p>
            </div>
            <Link to="/register" className="animate-fade-in">
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100 hover-scale">
                Criar Minha Conta
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer - Grid Responsivo */}
      <footer className="w-full border-t py-8 md:py-12 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
                <div className="bg-primary text-white rounded-md w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <span className="text-base md:text-lg font-semibold text-foreground">TechOS</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Soluções completas para gerenciamento de assistências técnicas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm md:text-base">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-500 hover:text-primary">Recursos</a></li>
                <li><a href="#planos" className="text-gray-500 hover:text-primary">Planos e Preços</a></li>
                <li><Link to="/integracoes" className="text-gray-500 hover:text-primary">Integrações</Link></li>
                <li><Link to="/documentacao-tecnica" className="text-gray-500 hover:text-primary">Documentação Técnica</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm md:text-base">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/sobre-nos" className="text-gray-500 hover:text-primary">Sobre nós</Link></li>
                <li><Link to="/contato" className="text-gray-500 hover:text-primary">Contato</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm md:text-base">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/centro-de-ajuda" className="text-gray-500 hover:text-primary">Centro de Ajuda</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 md:mt-8 border-t pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">© 2025 TechOS. Todos os direitos reservados.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link to="/termos-de-servico" className="text-xs md:text-sm text-gray-500 hover:text-primary text-center">Termos de Serviço</Link>
              <Link to="/politica-de-privacidade" className="text-xs md:text-sm text-gray-500 hover:text-primary text-center">Política de Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
