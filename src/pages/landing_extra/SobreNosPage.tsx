
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Target, Lightbulb, Award, Heart, Zap } from 'lucide-react';

const SobreNosPage = () => {
  const values = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Foco no Cliente",
      description: "Colocamos nossos clientes no centro de tudo o que fazemos, ouvindo suas necessidades e superando expectativas."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "Inovação Contínua",
      description: "Estamos sempre buscando novas formas de melhorar e inovar, mantendo nossa plataforma na vanguarda da tecnologia."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Simplicidade",
      description: "Acreditamos que tecnologia deve simplificar, não complicar. Por isso criamos soluções intuitivas e fáceis de usar."
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Eficiência",
      description: "Cada funcionalidade é pensada para otimizar processos e aumentar a produtividade das assistências técnicas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-4">
              Conheça Nossa História
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Sobre o RP OS Cloud
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transformando a gestão de assistências técnicas através da tecnologia e inovação.
            </p>
          </div>

          {/* Mission and Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-semibold text-primary">Nossa Missão</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Simplificar e modernizar a gestão de assistências técnicas através de uma plataforma 
                intuitiva e poderosa, permitindo que nossos clientes foquem no que realmente importa: 
                oferecer um excelente atendimento aos seus clientes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-semibold text-primary">Nossa Visão</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ser a principal referência em soluções de software para assistências técnicas na 
                América Latina, impulsionando o crescimento e a organização de milhares de empresas 
                através da tecnologia.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-gradient-to-r from-primary/5 to-blue-50 p-8 md:p-12 rounded-xl mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Nossa História</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                O RP OS Cloud nasceu da necessidade real observada no mercado de assistências técnicas. 
                Percebemos que muitas empresas ainda utilizavam métodos manuais ou sistemas desatualizados 
                para gerenciar seus processos, o que limitava seu crescimento e eficiência.
              </p>
              <p className="mb-6">
                Nossa equipe, com mais de 10 anos de experiência no desenvolvimento de software para 
                gestão empresarial, decidiu criar uma solução moderna, acessível e fácil de usar, 
                especificamente voltada para as necessidades únicas das assistências técnicas.
              </p>
              <p>
                Hoje, atendemos milhares de empresas em todo o Brasil, ajudando-as a digitalizar 
                seus processos, aumentar sua produtividade e oferecer um melhor atendimento aos seus clientes.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    {value.icon}
                    <h3 className="text-xl font-semibold text-gray-800">{value.title}</h3>
                  </div>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary text-white p-8 md:p-12 rounded-xl text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para fazer parte da nossa história?</h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de assistências técnicas que já transformaram seus negócios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Começar Gratuitamente
                </Button>
              </Link>
              <Link to="/contato">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Falar Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNosPage;
