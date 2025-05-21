
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const IntegracoesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link to="/" className="text-primary hover:underline">&larr; Voltar para Home</Link>
      </header>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Integrações</h1>
        <p className="text-lg text-gray-600 mb-4">
          Descubra como o TechOS se conecta com outras ferramentas para otimizar ainda mais o seu fluxo de trabalho.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">Em Breve</h2>
          <p className="text-gray-600">
            Estamos trabalhando para trazer diversas integrações que facilitarão seu dia a dia. Fique de olho nas novidades!
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link to="/register">
            <Button size="lg">Comece Agora com TechOS</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntegracoesPage;
