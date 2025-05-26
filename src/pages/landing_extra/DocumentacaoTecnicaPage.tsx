
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Code, Settings, Users, Smartphone, Laptop } from 'lucide-react';

const DocumentacaoTecnicaPage = () => {
  const guias = [
    {
      titulo: "Guia de Início Rápido",
      descricao: "Configure sua assistência técnica em poucos minutos",
      icone: <Settings className="h-6 w-6" />,
      conteudo: [
        "Criação da conta e login",
        "Configuração inicial da empresa",
        "Cadastro dos primeiros clientes",
        "Criação da primeira ordem de serviço"
      ]
    },
    {
      titulo: "Gestão de Clientes",
      descricao: "Como gerenciar o cadastro e histórico de clientes",
      icone: <Users className="h-6 w-6" />,
      conteudo: [
        "Cadastro completo de clientes",
        "Histórico de serviços",
        "Relatórios de clientes",
        "Comunicação e contatos"
      ]
    },
    {
      titulo: "Ordens de Serviço",
      descricao: "Fluxo completo das ordens de serviço",
      icone: <FileText className="h-6 w-6" />,
      conteudo: [
        "Criação de ordens",
        "Acompanhamento de status",
        "Adição de produtos e serviços",
        "Finalização e cobrança"
      ]
    },
    {
      titulo: "Versão Mobile",
      descricao: "Acesse o sistema de qualquer lugar",
      icone: <Smartphone className="h-6 w-6" />,
      conteudo: [
        "Interface otimizada para mobile",
        "Todas as funcionalidades disponíveis",
        "Sincronização em tempo real",
        "Trabalhe offline quando necessário"
      ]
    }
  ];

  const recursos = [
    {
      categoria: "Básico",
      itens: [
        "Dashboard com visão geral",
        "Cadastro de clientes e produtos",
        "Criação de ordens de serviço",
        "Controle financeiro básico"
      ]
    },
    {
      categoria: "Avançado", 
      itens: [
        "Relatórios detalhados",
        "Integração com sistemas externos",
        "Automação de processos",
        "API para desenvolvimentos customizados"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com navegação */}
      <header className="bg-white shadow-sm border-b px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-primary hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Voltar para Home
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Registrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Documentação Técnica
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tudo que você precisa saber para aproveitar ao máximo a plataforma TechOS. 
            Guias detalhados, tutoriais e informações técnicas.
          </p>
        </div>

        {/* Tabs de navegação */}
        <Tabs defaultValue="guias" className="mb-8">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="guias">Guias de Uso</TabsTrigger>
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
            <TabsTrigger value="api">API & Integrações</TabsTrigger>
          </TabsList>

          {/* Guias de Uso */}
          <TabsContent value="guias">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guias.map((guia, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="text-primary">{guia.icone}</div>
                      <span>{guia.titulo}</span>
                    </CardTitle>
                    <p className="text-gray-600">{guia.descricao}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guia.conteudo.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Ver Guia Completo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recursos */}
          <TabsContent value="recursos">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recursos.map((categoria, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{categoria.categoria}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {categoria.itens.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API & Integrações */}
          <TabsContent value="api">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>API REST</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Integre o TechOS com seus sistemas existentes usando nossa API REST completa.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Endpoints para todas as funcionalidades</li>
                    <li>• Autenticação via API Key</li>
                    <li>• Documentação interativa</li>
                    <li>• SDKs em várias linguagens</li>
                  </ul>
                  <Button variant="outline" size="sm" className="mt-4">
                    Acessar Documentação da API
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Laptop className="h-5 w-5" />
                    <span>Webhooks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Receba notificações em tempo real sobre eventos importantes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Criação de novas ordens</li>
                    <li>• Mudanças de status</li>
                    <li>• Pagamentos recebidos</li>
                    <li>• Alertas customizados</li>
                  </ul>
                  <Button variant="outline" size="sm" className="mt-4">
                    Configurar Webhooks
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8 text-center mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Crie sua conta gratuita e comece a usar o TechOS hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/contato">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Falar com Suporte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentacaoTecnicaPage;
