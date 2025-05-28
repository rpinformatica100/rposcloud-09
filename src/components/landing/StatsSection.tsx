
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      number: "500+",
      label: "Assistências Técnicas",
      description: "Confiam em nossa plataforma"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      number: "30%",
      label: "Redução no Tempo",
      description: "De processamento de ordens"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      number: "95%",
      label: "Satisfação",
      description: "Dos nossos clientes"
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      number: "2",
      label: "Anos",
      description: "De experiência no mercado"
    }
  ];

  return (
    <section className="w-full py-8 md:py-16 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-4">
            Números que Impressionam
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resultados Comprovados
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Centenas de assistências técnicas já transformaram seus negócios com nossa plataforma
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-primary mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
