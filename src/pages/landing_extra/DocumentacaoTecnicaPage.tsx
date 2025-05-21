
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DocumentacaoTecnicaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link to="/" className="text-primary hover:underline">&larr; Voltar para Home</Link>
      </header>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Documentação Técnica</h1>
        <p className="text-lg text-gray-600 mb-4">
          Acesse guias detalhados, tutoriais e informações técnicas sobre a plataforma TechOS.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">Conteúdo em Desenvolvimento</h2>
          <p className="text-gray-600">
            Nossa documentação técnica está sendo cuidadosamente preparada para oferecer o melhor suporte.
            Em breve, você encontrará todas as informações que precisa aqui.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link to="/contato">
            <Button variant="outline" size="lg">Fale Conosco para Dúvidas</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentacaoTecnicaPage;
