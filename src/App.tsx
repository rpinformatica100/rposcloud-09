import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import ErrorBoundary from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
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
const ConfiguracoesList = lazy(() => import('./pages/configuracoes/ConfiguracoesList'));
const ConfiguracoesAssistencia = lazy(() => import('./pages/configuracoes/ConfiguracoesAssistencia'));
const ConfiguracoesSistema = lazy(() => import('./pages/configuracoes/ConfiguracoesSistema'));
const PerfilEmpresa = lazy(() => import('./pages/configuracoes/PerfilEmpresa'));
const PlanosPage = lazy(() => import('./pages/planos/PlanosPage'));
const PlanoAssinatura = lazy(() => import('./pages/assinatura/PlanoAssinatura'));
const CompletarCadastro = lazy(() => import('./pages/assinante/CompletarCadastro'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AssistenciasList = lazy(() => import('./pages/admin/AssistenciasList'));
const PlanosList = lazy(() => import('./pages/admin/PlanosList'));
const PagamentosList = lazy(() => import('./pages/admin/PagamentosList'));
const AdminRelatoriosPage = lazy(() => import('./pages/admin/AdminRelatoriosPage'));
const ConfigAdmin = lazy(() => import('./pages/admin/ConfigAdmin'));

// Landing extra pages
const SobreNosPage = lazy(() => import('./pages/landing_extra/SobreNosPage'));
const ContatoPage = lazy(() => import('./pages/landing_extra/ContatoPage'));
const PoliticaPrivacidadePage = lazy(() => import('./pages/landing_extra/PoliticaPrivacidadePage'));
const TermosServicoPage = lazy(() => import('./pages/landing_extra/TermosServicoPage'));
const CentroAjudaPage = lazy(() => import('./pages/landing_extra/CentroAjudaPage'));
const DocumentacaoTecnicaPage = lazy(() => import('./pages/landing_extra/DocumentacaoTecnicaPage'));
const IntegracoesPage = lazy(() => import('./pages/landing_extra/IntegracoesPage'));

const Layout = lazy(() => import('./components/layout/Layout'));
const AssistenciaLayout = lazy(() => import('./components/layout/AssistenciaLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const PlanGuard = lazy(() => import('./components/plan/PlanGuard'));

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/sobre" element={<SobreNosPage />} />
                    <Route path="/contato" element={<ContatoPage />} />
                    <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
                    <Route path="/termos-servico" element={<TermosServicoPage />} />
                    <Route path="/centro-ajuda" element={<CentroAjudaPage />} />
                    <Route path="/documentacao" element={<DocumentacaoTecnicaPage />} />
                    <Route path="/integracoes" element={<IntegracoesPage />} />

                    {/* Assistant/User protected routes */}
                    <Route path="/app" element={<Layout />}>
                      <Route path="" element={<Navigate to="/app/dashboard" replace />} />
                      <Route path="dashboard" element={
                        <PlanGuard>
                          <Dashboard />
                        </PlanGuard>
                      } />
                      
                      {/* Orders routes */}
                      <Route path="ordens" element={
                        <PlanGuard>
                          <OrdensList />
                        </PlanGuard>
                      } />
                      <Route path="ordens/nova" element={
                        <PlanGuard>
                          <OrdensForm />
                        </PlanGuard>
                      } />
                      <Route path="ordens/editar/:id" element={
                        <PlanGuard>
                          <OrdensForm />
                        </PlanGuard>
                      } />
                      <Route path="ordens/:id" element={
                        <PlanGuard>
                          <OrdensView />
                        </PlanGuard>
                      } />

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

                    {/* 404 - Catch all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
