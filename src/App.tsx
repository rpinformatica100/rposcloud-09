
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OrdensList = lazy(() => import('./pages/ordens/OrdensList'));
const OrdensForm = lazy(() => import('./pages/ordens/OrdensForm'));
const OrdensView = lazy(() => import('./pages/ordens/OrdensView'));
const ClientesList = lazy(() => import('./pages/clientes/ClientesList'));
const ClientesForm = lazy(() => import('./pages/clientes/ClientesForm'));
const ProdutosList = lazy(() => import('./pages/produtos/ProdutosList'));
const ProdutosForm = lazy(() => import('./pages/produtos/ProdutosForm'));
const FinanceiroList = lazy(() => import('./pages/financeiro/FinanceiroList'));
const FinanceiroForm = lazy(() => import('./pages/financeiro/FinanceiroForm'));
const RelatoriosPage = lazy(() => import('./pages/relatorios/RelatoriosPage'));
const PlanosPage = lazy(() => import('./pages/planos/PlanosPage'));
const PlanoAssinatura = lazy(() => import('./pages/assinatura/PlanoAssinatura'));
const ConfiguracoesList = lazy(() => import('./pages/configuracoes/ConfiguracoesList'));
const ConfiguracoesSistema = lazy(() => import('./pages/configuracoes/ConfiguracoesSistema'));
const ConfiguracoesAssistencia = lazy(() => import('./pages/configuracoes/ConfiguracoesAssistencia'));
const PerfilEmpresa = lazy(() => import('./pages/configuracoes/PerfilEmpresa'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const CompletarCadastro = lazy(() => import('./pages/assinante/CompletarCadastro'));

// Lazy load layouts
const AssistenciaLayout = lazy(() => import('./components/layout/AssistenciaLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AssistenciasList = lazy(() => import('./pages/admin/AssistenciasList'));
const PlanosList = lazy(() => import('./pages/admin/PlanosList'));
const PagamentosList = lazy(() => import('./pages/admin/PagamentosList'));
const ConfigAdmin = lazy(() => import('./pages/admin/ConfigAdmin'));
const AdminRelatoriosPage = lazy(() => import('./pages/admin/AdminRelatoriosPage'));

// Lazy load landing extra pages - Padronização com hífens
const SobreNosPage = lazy(() => import('./pages/landing_extra/SobreNosPage'));
const ContatoPage = lazy(() => import('./pages/landing_extra/ContatoPage'));
const CentroAjudaPage = lazy(() => import('./pages/landing_extra/CentroAjudaPage'));
const PoliticaPrivacidadePage = lazy(() => import('./pages/landing_extra/PoliticaPrivacidadePage'));
const TermosServicoPage = lazy(() => import('./pages/landing_extra/TermosServicoPage'));
const IntegracoesPage = lazy(() => import('./pages/landing_extra/IntegracoesPage'));
const DocumentacaoTecnicaPage = lazy(() => import('./pages/landing_extra/DocumentacaoTecnicaPage'));

// Optimized loading component
const PageLoader = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-gray-500">Carregando...</p>
    </div>
  </div>
));

PageLoader.displayName = 'PageLoader';

function App() {
  // Register service worker
  React.useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
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
              
              {/* Landing Extra Pages - Rotas padronizadas com hífens */}
              <Route path="/sobre-nos" element={<SobreNosPage />} />
              <Route path="/contato" element={<ContatoPage />} />
              <Route path="/centro-ajuda" element={<CentroAjudaPage />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
              <Route path="/termos-servico" element={<TermosServicoPage />} />
              <Route path="/integracoes" element={<IntegracoesPage />} />
              <Route path="/documentacao-tecnica" element={<DocumentacaoTecnicaPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ErrorBoundary>
                  <AdminLayout />
                </ErrorBoundary>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="assistencias" element={<AssistenciasList />} />
                <Route path="planos" element={<PlanosList />} />
                <Route path="pagamentos" element={<PagamentosList />} />
                <Route path="relatorios" element={<AdminRelatoriosPage />} />
                <Route path="configuracoes" element={<ConfigAdmin />} />
              </Route>

              {/* App Routes - Protected */}
              <Route path="/app" element={
                <ErrorBoundary>
                  <AssistenciaLayout />
                </ErrorBoundary>
              }>
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
          </Suspense>
          
          {/* Centralized Toast System */}
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
