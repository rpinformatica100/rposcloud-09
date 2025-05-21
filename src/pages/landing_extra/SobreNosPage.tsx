
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SobreNosPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link to="/" className="text-primary hover:underline">&larr; Voltar para Home</Link>
      </header>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Sobre Nós</h1>
        <p className="text-lg text-gray-600 mb-4">
          Conheça a equipe e a história por trás do TechOS.
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-primary">Nossa Missão</h2>
          <p className="text-gray-700 mb-4">
            Simplificar a gestão de assistências técnicas através de uma plataforma intuitiva, poderosa e acessível.
            Acreditamos que a tecnologia pode transformar a maneira como os negócios operam,
            trazendo mais eficiência e satisfação para clientes e gestores.
          </p>
          <h2 className="text-2xl font-semibold mb-3 text-primary">Nossa Visão</h2>
          <p className="text-gray-700">
            Ser a principal referência em soluções de software para assistências técnicas na América Latina,
            impulsionando o crescimento e a organização de milhares de empresas.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link to="/register">
            <Button size="lg">Junte-se à Comunidade TechOS</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SobreNosPage;
