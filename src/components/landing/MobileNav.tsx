
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#features", label: "Recursos" },
    { href: "#planos", label: "Planos" },
    { href: "#testimonials", label: "Depoimentos" },
    { href: "#faq", label: "Perguntas" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <Link to="/" className="text-lg font-semibold text-foreground" onClick={handleLinkClick}>
              TechOS
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4 mb-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-lg font-medium text-gray-600 hover:text-primary transition-colors py-2"
                onClick={handleLinkClick}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="mt-auto space-y-4">
            <Link to="/login" onClick={handleLinkClick}>
              <Button variant="outline" size="lg" className="w-full">
                Entrar
              </Button>
            </Link>
            <Link to="/register" onClick={handleLinkClick}>
              <Button size="lg" className="w-full">
                Registrar
              </Button>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link to="/centro-de-ajuda" className="text-gray-500 hover:text-primary" onClick={handleLinkClick}>
                Centro de Ajuda
              </Link>
              <Link to="/contato" className="text-gray-500 hover:text-primary" onClick={handleLinkClick}>
                Contato
              </Link>
              <Link to="/integracoes" className="text-gray-500 hover:text-primary" onClick={handleLinkClick}>
                Integrações
              </Link>
              <Link to="/documentacao-tecnica" className="text-gray-500 hover:text-primary" onClick={handleLinkClick}>
                Documentação
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
