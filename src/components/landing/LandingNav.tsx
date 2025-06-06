
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cloud } from 'lucide-react';
import MobileNav from './MobileNav';

const LandingNav = () => {
  const navItems = [
    { href: "#features", label: "Recursos" },
    { href: "#planos", label: "Planos" },
    { href: "#trial", label: "Teste Grátis" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center">
            <Cloud size={18} />
          </div>
          <span className="text-xl font-bold text-foreground">RP OS Cloud</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors story-link"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm">
              Começar Grátis
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </header>
  );
};

export default LandingNav;
