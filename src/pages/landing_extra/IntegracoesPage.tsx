
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Globe, Smartphone, CreditCard, Mail, Calendar, BarChart3 } from 'lucide-react';

const IntegracoesPage = () => {
  const integracoes = [
    {
      nome: "Sistemas de Pagamento",
      descricao: "Integração com as principais plataformas de pagamento do Brasil",
      icone: <CreditCard className="h-8 w-8" />,
      status: "Disponível",
      cor: "bg-green-500",
      recursos: ["Mercado Pago", "PagSeguro", "PayPal", "PIX automático"]
    },
    {
      nome: "E-mail Marketing",
      descricao: "Automatize comunicações com clientes via e-mail",
      icone: <Mail className="h-8 w-8" />,
      status: "Em Breve",
      cor: "bg-yellow-500",
      recursos: ["Mailchimp", "SendGrid", "Templates automáticos", "Campanhas segmentadas"]
    },
    {
      nome: "Calendários",
      descricao: "Sincronize agendamentos com Google Calendar e Outlook",
      icone: <Calendar className="h-8 w-8" />,
      status: "Beta",
      cor: "bg-blue-500",
      recursos: ["Google Calendar", "Outlook", "Lembretes automáticos", "Disponibilidade em tempo real"]
    },
    {
      nome: "Business Intelligence",
      descricao: "Conecte com ferramentas de análise e relatórios avançados",
      icone: <BarChart3 className="h-8 w-8" />,
      status: "Planejado",
      cor: "bg-purple-500",
      recursos: ["Power BI", "Tableau", "Google Analytics", "Dashboards customizados"]
    },
    {
      nome: "Apps Mobile",
      descricao: "Aplicativo nativo para iOS e Android",
      icone: <Smartphone className="h-8 w-8" />,
      status: "Disponível",
      cor: "bg-green-500",
      recursos: ["PWA", "Notificações push", "Modo offline", "Sincronização automática"]
    },
    {
      nome: "API Completa",
      descricao: "Integre com qualquer sistema usando nossa API REST",
      icone: <Zap className="h-8 w-8" />,
      status: "Disponível",
      cor: "bg-green-500",
      recursos: ["REST API", "Webhooks", "Documentação completa", "SDKs"]
    }
  ];

  const beneficios = [
    {
      titulo: "Automatização Total",
      descricao: "Reduza trabalho manual conectando seus sistemas favoritos",
      icone: <Zap className="h-6 w-6 text-yellow-500" />
    },
    {
      titulo: "Segurança Garantida",
      descricao: "Todas as integrações seguem protocolos de segurança avançados",
      icone: <Shield className="h-6 w-6 text-green-500" />
    },
    {
      titulo: "Alcance Global",
      descricao: "Conecte-se com ferramentas usadas mundialmente",
      icone: <Globe className="h-6 w-6 text-blue-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            Integrações Poderosas
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conecte o TechOS com suas ferramentas favoritas e automatize seu fluxo de trabalho. 
            Mais de 50 integrações disponíveis e em desenvolvimento.
          </p>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="text-center p-6">
              <div className="flex justify-center mb-4">
                {beneficio.icone}
              </div>
              <h3 className="text-lg font-semibold mb-2">{beneficio.titulo}</h3>
              <p className="text-gray-600">{beneficio.descricao}</p>
            </div>
          ))}
        </div>

        {/* Grid de Integrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {integracoes.map((integracao, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">{integracao.icone}</div>
                    <div>
                      <CardTitle className="text-lg">{integracao.nome}</CardTitle>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${integracao.cor} text-white`}
                  >
                    {integracao.status}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">{integracao.descricao}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {integracao.recursos.map((recurso, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{recurso}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={integracao.status === "Disponível" ? "default" : "outline"} 
                  size="sm" 
                  className="w-full mt-4"
                  disabled={integracao.status === "Planejado"}
                >
                  {integracao.status === "Disponível" ? "Configurar" : 
                   integracao.status === "Beta" ? "Testar Beta" : 
                   integracao.status === "Em Breve" ? "Notificar-me" : "Em Desenvolvimento"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção de API */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                API Completa para Desenvolvedores
              </h2>
              <p className="text-gray-300 mb-6">
                Crie integrações customizadas usando nossa API REST completa. 
                Documentação detalhada, SDKs e suporte técnico incluídos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg">
                  Ver Documentação
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Obter API Key
                </Button>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <code className="text-green-400 text-sm">
                  {`// Exemplo de uso da API
curl -X GET \\
  'https://api.techos.com/v1/ordens' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Precisa de uma integração específica?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nossa equipe está sempre trabalhando em novas integrações. 
            Entre em contato e nos conte qual ferramenta você gostaria de conectar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contato">
              <Button size="lg">Solicitar Integração</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegracoesPage;
