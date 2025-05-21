
import React from 'react';
import { Link } from 'react-router-dom';

const TermosServicoPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link to="/" className="text-primary hover:underline">&larr; Voltar para Home</Link>
      </header>
      <div className="max-w-3xl mx-auto prose lg:prose-xl">
        <h1>Termos de Serviço</h1>
        <p>Última atualização: 21 de Maio de 2025</p>

        <h2>1. Aceitação dos Termos</h2>
        <p>Ao acessar e usar os serviços oferecidos pela TechOS ("Nós", "Nosso"), você ("Usuário", "Cliente") concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte dos termos, não poderá usar nossos serviços.</p>

        <h2>2. Descrição do Serviço</h2>
        <p>TechOS fornece uma plataforma de software como serviço (SaaS) para gerenciamento de assistências técnicas, incluindo ordens de serviço, clientes, produtos e finanças.</p>

        <h2>3. Contas de Usuário</h2>
        <p>Para acessar a maioria dos recursos da plataforma, você precisará se registrar e criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de conta e por todas as atividades que ocorrem sob sua conta. Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.</p>

        <h2>4. Planos e Pagamentos</h2>
        <p>Oferecemos diferentes planos de assinatura. As taxas, os recursos incluídos e os termos de pagamento para cada plano são descritos em nossa página de Planos. As taxas são cobradas antecipadamente de forma recorrente (mensal ou anual) e não são reembolsáveis, exceto conforme exigido por lei ou explicitamente declarado em contrário.</p>

        <h2>5. Uso Aceitável</h2>
        <p>Você concorda em não usar o serviço para fins ilegais ou proibidos por estes Termos. Você não deve:</p>
        <ul>
          <li>Violar quaisquer leis ou regulamentos aplicáveis.</li>
          <li>Infringir os direitos de propriedade intelectual de terceiros.</li>
          <li>Transmitir qualquer material que seja abusivo, difamatório, obsceno ou ofensivo.</li>
          <li>Tentar obter acesso não autorizado aos nossos sistemas ou redes.</li>
        </ul>

        <h2>6. Propriedade Intelectual</h2>
        <p>Todos os direitos, títulos e interesses sobre o serviço (excluindo o conteúdo fornecido pelos usuários) são e continuarão sendo propriedade exclusiva da TechOS e de seus licenciadores. O serviço é protegido por direitos autorais, marcas registradas e outras leis.</p>

        <h2>7. Rescisão</h2>
        <p>Podemos suspender ou rescindir seu acesso ao serviço imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos. Após a rescisão, seu direito de usar o serviço cessará imediatamente.</p>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>Em nenhuma circunstância a TechOS, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes de (i) seu acesso ou uso ou incapacidade de acessar ou usar o serviço; (ii) qualquer conduta ou conteúdo de terceiros no serviço; (iii) qualquer conteúdo obtido do serviço; e (iv) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo, seja com base em garantia, contrato, ato ilícito (incluindo negligência) ou qualquer outra teoria legal, tenhamos sido informados ou não da possibilidade de tais danos.</p>

        <h2>9. Alterações nos Termos</h2>
        <p>Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.</p>

        <h2>10. Contato</h2>
        <p>Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em <Link to="/contato" className="text-primary hover:underline">nossa página de contato</Link>.</p>
      </div>
    </div>
  );
};

export default TermosServicoPage;
