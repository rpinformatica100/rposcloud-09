
const FAQSection = () => {
  const faqs = [
    {
      question: "Como posso começar a usar o TechOS?",
      answer: "Basta se registrar em nossa plataforma, escolher um plano adequado às suas necessidades e começar a configurar sua assistência técnica. Todo o processo é simples e intuitivo."
    },
    {
      question: "Posso experimentar antes de assinar?",
      answer: "Sim, oferecemos um período de teste gratuito de 14 dias com todas as funcionalidades disponíveis para que você possa avaliar nossa plataforma."
    },
    {
      question: "É possível migrar meus dados de outro sistema?",
      answer: "Sim, nossa equipe de suporte pode ajudá-lo com a migração de dados de outros sistemas. Entre em contato conosco para obter mais informações."
    },
    {
      question: "Quais são as formas de pagamento?",
      answer: "Aceitamos cartões de crédito, boleto bancário e PIX. Os pagamentos são processados de forma segura através de nossa plataforma."
    },
    {
      question: "O sistema funciona em dispositivos móveis?",
      answer: "Sim, nossa plataforma é totalmente responsiva e pode ser acessada de qualquer dispositivo com acesso à internet, incluindo smartphones e tablets."
    },
  ];

  return (
    <section id="faq" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 animate-fade-in">FAQ</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter animate-fade-in">Perguntas Frequentes</h2>
            <p className="max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400 animate-fade-in px-4">
              Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-8 md:py-12 px-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border bg-background p-4 md:p-6 shadow-sm animate-fade-in">
              <h3 className="text-base md:text-lg font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
