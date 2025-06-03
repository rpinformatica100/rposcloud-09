
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="w-full border-t py-8 md:py-12 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="bg-primary text-white rounded-md w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <span className="text-base md:text-lg font-semibold text-foreground">RP OS Cloud</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Soluções completas para gerenciamento de assistências técnicas na nuvem.
            </p>
            <div className="flex space-x-4">
              <Link to="/contato" className="text-gray-500 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link to="/contato" className="text-gray-500 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link to="/contato" className="text-gray-500 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-5 md:w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm md:text-base">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-500 hover:text-primary">Recursos</a></li>
              <li><a href="#planos" className="text-gray-500 hover:text-primary">Planos e Preços</a></li>
              <li><Link to="/integracoes" className="text-gray-500 hover:text-primary">Integrações</Link></li>
              <li><Link to="/documentacao-tecnica" className="text-gray-500 hover:text-primary">Documentação Técnica</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm md:text-base">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre-nos" className="text-gray-500 hover:text-primary">Sobre nós</Link></li>
              <li><Link to="/contato" className="text-gray-500 hover:text-primary">Contato</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm md:text-base">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/centro-ajuda" className="text-gray-500 hover:text-primary">Centro de Ajuda</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 md:mt-8 border-t pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">© 2025 RP OS Cloud. Todos os direitos reservados.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link to="/termos-servico" className="text-xs md:text-sm text-gray-500 hover:text-primary text-center">Termos de Serviço</Link>
            <Link to="/politica-privacidade" className="text-xs md:text-sm text-gray-500 hover:text-primary text-center">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
