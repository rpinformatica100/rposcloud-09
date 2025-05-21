
import React from 'react';
import { Link } from 'react-router-dom';

const PoliticaPrivacidadePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link to="/" className="text-primary hover:underline">&larr; Voltar para Home</Link>
      </header>
      <div className="max-w-3xl mx-auto prose lg:prose-xl">
        <h1>Política de Privacidade</h1>
        <p>Última atualização: 21 de Maio de 2025</p>

        <h2>1. Introdução</h2>
        <p>A TechOS ("Nós", "Nosso") está comprometida em proteger a privacidade de seus usuários ("Você", "Seu"). Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nossa plataforma e serviços.</p>

        <h2>2. Informações que Coletamos</h2>
        <p>Podemos coletar informações sobre você de várias maneiras, incluindo:</p>
        <ul>
          <li><strong>Informações Pessoais Identificáveis:</strong> Como seu nome, endereço de e-mail, número de telefone, informações de pagamento e outras informações que você nos fornece voluntariamente ao se registrar ou usar nossos serviços.</li>
          <li><strong>Dados de Uso:</strong> Informações que seu navegador envia automaticamente sempre que você visita nosso site ou usa nossa plataforma, como seu endereço IP, tipo de navegador, páginas visitadas, tempo gasto nessas páginas e outras estatísticas.</li>
          <li><strong>Cookies e Tecnologias de Rastreamento:</strong> Usamos cookies e tecnologias de rastreamento semelhantes para rastrear a atividade em nosso serviço e manter certas informações.</li>
        </ul>

        <h2>3. Como Usamos Suas Informações</h2>
        <p>Usamos as informações coletadas para diversos fins, incluindo:</p>
        <ul>
          <li>Fornecer, operar e manter nosso serviço.</li>
          <li>Melhorar, personalizar e expandir nosso serviço.</li>
          <li>Entender e analisar como você usa nosso serviço.</li>
          <li>Desenvolver novos produtos, serviços, recursos e funcionalidades.</li>
          <li>Comunicar com você, diretamente ou através de um de nossos parceiros, inclusive para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao serviço, e para fins de marketing e promocionais.</li>
          <li>Processar suas transações.</li>
          <li>Detectar e prevenir fraudes.</li>
        </ul>

        <h2>4. Compartilhamento de Suas Informações</h2>
        <p>Podemos compartilhar suas informações nas seguintes situações:</p>
        <ul>
          <li><strong>Com Provedores de Serviços:</strong> Podemos compartilhar suas informações com provedores de serviços terceirizados que realizam serviços para nós ou em nosso nome, como processamento de pagamentos, análise de dados, entrega de e-mail, serviços de hospedagem, atendimento ao cliente e assistência de marketing.</li>
          <li><strong>Para Obrigações Legais:</strong> Podemos divulgar suas informações se formos obrigados a fazê-lo por lei ou em resposta a solicitações válidas de autoridades públicas (por exemplo, um tribunal ou agência governamental).</li>
          <li><strong>Com Seu Consentimento:</strong> Podemos divulgar suas informações pessoais para qualquer outro propósito com o seu consentimento.</li>
        </ul>

        <h2>5. Segurança de Suas Informações</h2>
        <p>Usamos medidas de segurança administrativas, técnicas e físicas para ajudar a proteger suas informações pessoais. Embora tenhamos tomado medidas razoáveis para proteger as informações pessoais que você nos fornece, esteja ciente de que nenhum sistema de segurança é perfeito ou impenetrável, e nenhum método de transmissão de dados pode ser garantido contra qualquer interceptação ou outro tipo de uso indevido.</p>

        <h2>6. Seus Direitos de Privacidade</h2>
        <p>Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais, como o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Para exercer esses direitos, entre em contato conosco.</p>

        <h2>7. Política para Crianças</h2>
        <p>Nosso serviço não se destina a menores de 13 anos. Não coletamos intencionalmente informações de identificação pessoal de crianças menores de 13 anos. Se você é pai ou responsável e sabe que seu filho nos forneceu informações pessoais, entre em contato conosco.</p>

        <h2>8. Alterações a Esta Política de Privacidade</h2>
        <p>Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data da "Última atualização".</p>

        <h2>9. Contato</h2>
        <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em <Link to="/contato" className="text-primary hover:underline">nossa página de contato</Link>.</p>
      </div>
    </div>
  );
};

export default PoliticaPrivacidadePage;
