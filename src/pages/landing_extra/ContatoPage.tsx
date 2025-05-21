
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContatoPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de envio do formulário aqui
    alert('Mensagem enviada! (funcionalidade de exemplo)');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link to="/" className="text-primary hover:underline">&larr; Voltar para Home</Link>
      </header>
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Entre em Contato</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Tem alguma dúvida, sugestão ou precisa de suporte? Preencha o formulário abaixo ou utilize nossos outros canais de atendimento.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</Label>
            <Input type="text" name="name" id="name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Seu Melhor Email</Label>
            <Input type="email" name="email" id="email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</Label>
            <Input type="text" name="subject" id="subject" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message" className="block text-sm font-medium text-gray-700">Sua Mensagem</Label>
            <Textarea name="message" id="message" rows={4} required className="mt-1" />
          </div>
          <div>
            <Button type="submit" className="w-full" size="lg">Enviar Mensagem</Button>
          </div>
        </form>
        <div className="mt-10 text-center text-gray-600">
          <p>Você também pode nos encontrar em:</p>
          <p className="font-semibold">contato@techos.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContatoPage;
