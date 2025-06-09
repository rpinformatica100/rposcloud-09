
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import LandingPage from './pages/Landing';
import Login from './pages/Login';
import SupabaseLogin from './pages/SupabaseLogin';
import SupabaseRegister from './pages/SupabaseRegister';
import SupabaseLayout from './components/layout/SupabaseLayout';
import DashboardPage from './pages/Dashboard';
import OrdensPage from './pages/ordens/OrdensList';
import ClientesPage from './pages/clientes/ClientesList';
import ProdutosPage from './pages/produtos/ProdutosList';
import FinanceiroPage from './pages/financeiro/FinanceiroList';
import RelatoriosPage from './pages/relatorios/RelatoriosPage';
import ConfiguracoesPage from './pages/configuracoes/ConfiguracoesList';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AssistenciasPage from './pages/admin/AssistenciasList';
import AdminConfiguracoesPage from './pages/admin/ConfigAdmin';
import { Toaster } from "@/components/ui/toaster"
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { PlanProvider } from './contexts/PlanContext';
import OrdemViewPage from './pages/ordens/OrdensView';
import PlanoAssinatura from './pages/assinatura/PlanoAssinatura';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <SupabaseAuthProvider>
          <PlanProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/supabase-login" element={<SupabaseLogin />} />
              <Route path="/supabase-register" element={<SupabaseRegister />} />

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
                <Route path="configuracoes" element={<AdminConfiguracoesPage />} />
              </Route>
            </Routes>
          </PlanProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
