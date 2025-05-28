
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Import das páginas
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrdensList from './pages/ordens/OrdensList';
import OrdensForm from './pages/ordens/OrdensForm';
import OrdensView from './pages/ordens/OrdensView';
import ClientesList from './pages/clientes/ClientesList';
import ClientesForm from './pages/clientes/ClientesForm';
import ProdutosList from './pages/produtos/ProdutosList';
import ProdutosForm from './pages/produtos/ProdutosForm';
import FinanceiroList from './pages/financeiro/FinanceiroList';
import FinanceiroForm from './pages/financeiro/FinanceiroForm';
import RelatoriosPage from './pages/relatorios/RelatoriosPage';
import PlanosPage from './pages/planos/PlanosPage';
import PlanoAssinatura from './pages/assinatura/PlanoAssinatura';
import ConfiguracoesList from './pages/configuracoes/ConfiguracoesList';
import ConfiguracoesSistema from './pages/configuracoes/ConfiguracoesSistema';
import ConfiguracoesAssistencia from './pages/configuracoes/ConfiguracoesAssistencia';
import PerfilEmpresa from './pages/configuracoes/PerfilEmpresa';
import NotFound from './pages/NotFound';
import SobreNosPage from './pages/landing_extra/SobreNosPage';
import ContatoPage from './pages/landing_extra/ContatoPage';
import CentroAjudaPage from './pages/landing_extra/CentroAjudaPage';
import PoliticaPrivacidadePage from './pages/landing_extra/PoliticaPrivacidadePage';
import TermosServicoPage from './pages/landing_extra/TermosServicoPage';
import IntegracoesPage from './pages/landing_extra/IntegracoesPage';
import DocumentacaoTecnicaPage from './pages/landing_extra/DocumentacaoTecnicaPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

// Layouts
import AssistenciaLayout from './components/layout/AssistenciaLayout';
import AdminLayout from './components/layout/AdminLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AssistenciasList from './pages/admin/AssistenciasList';
import PlanosList from './pages/admin/PlanosList';
import PagamentosList from './pages/admin/PagamentosList';
import ConfigAdmin from './pages/admin/ConfigAdmin';
import AdminRelatoriosPage from './pages/admin/AdminRelatoriosPage';

// Assinante
import CompletarCadastro from './pages/assinante/CompletarCadastro';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Cadastro completo */}
        <Route path="/completar-cadastro" element={<CompletarCadastro />} />
        
        {/* Payment Pages */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        
        {/* Landing Extra Pages */}
        <Route path="/sobre-nos" element={<SobreNosPage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/centro-ajuda" element={<CentroAjudaPage />} />
        <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
        <Route path="/termos-servico" element={<TermosServicoPage />} />
        <Route path="/integracoes" element={<IntegracoesPage />} />
        <Route path="/documentacao-tecnica" element={<DocumentacaoTecnicaPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="assistencias" element={<AssistenciasList />} />
          <Route path="planos" element={<PlanosList />} />
          <Route path="pagamentos" element={<PagamentosList />} />
          <Route path="relatorios" element={<AdminRelatoriosPage />} />
          <Route path="configuracoes" element={<ConfigAdmin />} />
        </Route>

        {/* App Routes - Protected */}
        <Route path="/app" element={<AssistenciaLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Ordens de Serviço */}
          <Route path="ordens" element={<OrdensList />} />
          <Route path="ordens/nova" element={<OrdensForm />} />
          <Route path="ordens/:id" element={<OrdensView />} />
          <Route path="ordens/:id/editar" element={<OrdensForm />} />
          
          {/* Clientes */}
          <Route path="clientes" element={<ClientesList />} />
          <Route path="clientes/novo" element={<ClientesForm />} />
          <Route path="clientes/:id/editar" element={<ClientesForm />} />
          
          {/* Produtos */}
          <Route path="produtos" element={<ProdutosList />} />
          <Route path="produtos/novo" element={<ProdutosForm />} />
          <Route path="produtos/:id/editar" element={<ProdutosForm />} />
          
          {/* Financeiro */}
          <Route path="financeiro" element={<FinanceiroList />} />
          <Route path="financeiro/novo" element={<FinanceiroForm />} />
          <Route path="financeiro/:id/editar" element={<FinanceiroForm />} />
          
          {/* Relatórios */}
          <Route path="relatorios" element={<RelatoriosPage />} />
          
          {/* Planos */}
          <Route path="planos" element={<PlanosPage />} />
          <Route path="assinatura" element={<PlanoAssinatura />} />
          
          {/* Configurações */}
          <Route path="configuracoes" element={<ConfiguracoesList />} />
          <Route path="configuracoes/sistema" element={<ConfiguracoesSistema />} />
          <Route path="configuracoes/assistencia" element={<ConfiguracoesAssistencia />} />
          <Route path="configuracoes/perfil" element={<PerfilEmpresa />} />
        </Route>

        {/* 404 - Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
