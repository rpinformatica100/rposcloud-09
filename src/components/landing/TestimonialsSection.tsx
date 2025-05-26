
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "João Silva",
      role: "Proprietário da TecnoCell",
      content: "A plataforma TechOS revolucionou o gerenciamento da minha assistência técnica. Tudo é muito mais organizado e eficiente agora.",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
      name: "Maria Oliveira",
      role: "Gerente da InfoTech",
      content: "O módulo financeiro é fantástico! Consigo ter um controle muito melhor do meu fluxo de caixa e das receitas da empresa.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      name: "Carlos Santos",
      role: "Técnico na CompuServ",
      content: "A facilidade em criar ordens de serviço e acompanhar o status de cada uma delas tornou meu trabalho muito mais produtivo.",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
  ];

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 animate-fade-in">Depoimentos</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter animate-fade-in">Clientes satisfeitos</h2>
            <p className="max-w-[600px] md:max-w-[700px] text-gray-500 text-base md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400 animate-fade-in px-4">
              Veja o que nossos clientes estão falando sobre nossa plataforma.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 py-8 md:py-12 px-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg border bg-background p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] animate-fade-in">
              <div className="flex flex-col space-y-4">
                <p className="text-gray-500 dark:text-gray-400 italic text-sm md:text-base">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
