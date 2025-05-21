import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"

// Auth Context
import { AuthProvider } from './contexts/AuthContext';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Landing Extra Pages
import IntegracoesPage from './pages/landing_extra/IntegracoesPage';
import DocumentacaoTecnicaPage from './pages/landing_extra/DocumentacaoTecnicaPage';
import SobreNosPage from './pages/landing_extra/SobreNosPage';
import ContatoPage from './pages/landing_extra/ContatoPage';
import CentroAjudaPage from './pages/landing_extra/CentroAjudaPage';
import TermosServicoPage from './pages/landing_extra/TermosServicoPage';
import PoliticaPrivacidadePage from './pages/landing_extra/PoliticaPrivacidadePage';

// App Layout
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import AssistenciaLayout from './components/layout/AssistenciaLayout';

// App Pages
import Dashboard from './pages/Dashboard';
import ClientesList from './pages/clientes/ClientesList';
import ClientesForm from './pages/clientes/ClientesForm';
import ProdutosList from './pages/produtos/ProdutosList';
import ProdutosForm from './pages/produtos/ProdutosForm';
import OrdensList from './pages/ordens/OrdensList';
import OrdensForm from './pages/ordens/OrdensForm';
import OrdensView from './pages/ordens/OrdensView';
import FinanceiroList from './pages/financeiro/FinanceiroList';
import FinanceiroForm from './pages/financeiro/FinanceiroForm';
import ConfiguracoesList from "./pages/configuracoes/ConfiguracoesList";
import PerfilEmpresa from "./pages/configuracoes/PerfilEmpresa";
import ConfiguracoesAssistencia from "./pages/configuracoes/ConfiguracoesAssistencia";
import RelatoriosPage from "./pages/relatorios/RelatoriosPage";

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AssistenciasList from './pages/admin/AssistenciasList';
import PlanosList from './pages/admin/PlanosList';
import PagamentosList from './pages/admin/PagamentosList';
import ConfigAdmin from './pages/admin/ConfigAdmin';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              {/* Landing page é a rota principal */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Landing Extra Pages */}
              <Route path="/integracoes" element={<IntegracoesPage />} />
              <Route path="/documentacao-tecnica" element={<DocumentacaoTecnicaPage />} />
              <Route path="/sobre-nos" element={<SobreNosPage />} />
              <Route path="/contato" element={<ContatoPage />} />
              <Route path="/centro-de-ajuda" element={<CentroAjudaPage />} />
              <Route path="/termos-de-servico" element={<TermosServicoPage />} />
              <Route path="/politica-de-privacidade" element={<PoliticaPrivacidadePage />} />
              
              {/* App Routes (require authentication) */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                <Route path="/clientes" element={<ClientesList />} />
                <Route path="/clientes/novo" element={<ClientesForm />} />
                <Route path="/clientes/editar/:id" element={<ClientesForm />} />
                
                <Route path="/produtos" element={<ProdutosList />} />
                <Route path="/produtos/novo" element={<ProdutosForm />} />
                <Route path="/produtos/editar/:id" element={<ProdutosForm />} />
                
                <Route path="/ordens" element={<OrdensList />} />
                <Route path="/ordens/nova" element={<OrdensForm />} />
                <Route path="/ordens/editar/:id" element={<OrdensForm />} />
                <Route path="/ordens/visualizar/:id" element={<OrdensView />} />
                
                <Route path="/financeiro" element={<FinanceiroList />} />
                <Route path="/financeiro/novo" element={<FinanceiroForm />} />
                <Route path="/financeiro/editar/:id" element={<FinanceiroForm />} />
                
                <Route path="/relatorios" element={<RelatoriosPage />} />
                
                {/* Rotas de Configurações */}
                <Route path="/configuracoes" element={<ConfiguracoesList />} />
                <Route path="/configuracoes/perfil" element={<PerfilEmpresa />} />
                <Route path="/configuracoes/assistencia" element={<ConfiguracoesAssistencia />} />
              </Route>
              
              {/* Also add routes with /app prefix for compatibility */}
              <Route path="/app" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                <Route path="clientes" element={<ClientesList />} />
                <Route path="clientes/novo" element={<ClientesForm />} />
                <Route path="clientes/editar/:id" element={<ClientesForm />} />
                
                <Route path="produtos" element={<ProdutosList />} />
                <Route path="produtos/novo" element={<ProdutosForm />} />
                <Route path="produtos/editar/:id" element={<ProdutosForm />} />
                
                <Route path="ordens" element={<OrdensList />} />
                <Route path="ordens/nova" element={<OrdensForm />} />
                <Route path="ordens/editar/:id" element={<OrdensForm />} />
                <Route path="ordens/visualizar/:id" element={<OrdensView />} />
                
                <Route path="financeiro" element={<FinanceiroList />} />
                <Route path="financeiro/novo" element={<FinanceiroForm />} />
                <Route path="financeiro/editar/:id" element={<FinanceiroForm />} />
                
                <Route path="relatorios" element={<RelatoriosPage />} />
                
                <Route path="configuracoes" element={<ConfiguracoesList />} />
                <Route path="configuracoes/perfil" element={<PerfilEmpresa />} />
                <Route path="configuracoes/assistencia" element={<ConfiguracoesAssistencia />} />
              </Route>
              
              {/* Assistência Routes */}
              <Route path="/assistencia" element={<AssistenciaLayout />}>
                <Route index element={<Dashboard />} />
                {/* Adicione mais rotas conforme necessário */}
              </Route>
              
              {/* Admin Routes (require admin authentication) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="assistencias" element={<AssistenciasList />} />
                <Route path="planos" element={<PlanosList />} />
                <Route path="pagamentos" element={<PagamentosList />} />
                <Route path="configuracoes" element={<ConfigAdmin />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
