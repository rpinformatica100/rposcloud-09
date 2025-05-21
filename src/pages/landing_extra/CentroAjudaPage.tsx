
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const CentroAjudaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link to="/" className="text-primary hover:underline">&larr; Voltar para Home</Link>
      </header>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">Central de Ajuda</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Encontre respostas rápidas para suas perguntas e explore nossos recursos de suporte.
        </p>
        
        <div className="relative mb-10">
          <Input 
            type="search" 
            placeholder="Como podemos ajudar?" 
            className="pl-10 pr-4 py-3 text-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-primary">Perguntas Frequentes (FAQ)</h2>
            <p className="text-gray-600 mb-3">Respostas para as dúvidas mais comuns sobre o TechOS.</p>
            <Link to="/#faq"> {/* Link para a seção FAQ na Landing Page */}
              <Button variant="link" className="p-0">Acessar FAQ &rarr;</Button>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-primary">Tutoriais em Vídeo</h2>
            <p className="text-gray-600 mb-3">Aprenda a usar os recursos da plataforma com nossos guias visuais.</p>
            <Button variant="link" className="p-0 text-gray-400 cursor-not-allowed">Em Breve &rarr;</Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-primary">Documentação Completa</h2>
            <p className="text-gray-600 mb-3">Explore manuais detalhados e guias de configuração.</p>
            <Link to="/documentacao-tecnica">
              <Button variant="link" className="p-0">Ver Documentação &rarr;</Button>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-primary">Falar com Suporte</h2>
            <p className="text-gray-600 mb-3">Não encontrou o que precisava? Nossa equipe está pronta para ajudar.</p>
            <Link to="/contato">
              <Button variant="link" className="p-0">Entrar em Contato &rarr;</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentroAjudaPage;
