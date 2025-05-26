
import { Package, BarChart2, Settings as SettingsIcon } from 'lucide-react';

const FeaturesSection = () => {
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
  );
};

export default FeaturesSection;
