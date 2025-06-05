import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import LandingPage from './pages/LandingPage';
import TrialPage from './pages/TrialPage';
import SupabaseLayout from './components/layout/SupabaseLayout';
import DashboardPage from './pages/app/DashboardPage';
import OrdensPage from './pages/app/OrdensPage';
import ClientesPage from './pages/app/ClientesPage';
import ProdutosPage from './pages/app/ProdutosPage';
import FinanceiroPage from './pages/app/FinanceiroPage';
import RelatoriosPage from './pages/app/RelatoriosPage';
import ConfiguracoesPage from './pages/app/ConfiguracoesPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AssistenciasPage from './pages/admin/AssistenciasPage';
import UsuariosPage from './pages/admin/UsuariosPage';
import AdminConfiguracoesPage from './pages/admin/AdminConfiguracoesPage';
import { Toaster } from "@/components/ui/toaster"
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { QueryClient } from '@tanstack/react-query';
import OrdemViewPage from './pages/app/OrdemViewPage';
import PlanoAssinatura from './pages/assinatura/PlanoAssinatura';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Toaster />
          <SupabaseAuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/trial" element={<TrialPage />} />

              {/* Protected app routes */}
              <Route path="/app" element={<SupabaseLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="ordens" element={<OrdensPage />} />
                <Route path="ordens/:id" element={<OrdemViewPage />} />
                <Route path="clientes" element={<ClientesPage />} />
                <Route path="produtos" element={<ProdutosPage />} />
                <Route path="financeiro" element={<FinanceiroPage />} />
                <Route path="relatorios" element={<RelatoriosPage />} />
                <Route path="assinatura" element={<PlanoAssinatura />} />
                <Route path="configuracoes" element={<ConfiguracoesPage />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="assistencias" element={<AssistenciasPage />} />
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="configuracoes" element={<AdminConfiguracoesPage />} />
              </Route>
            </Routes>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
