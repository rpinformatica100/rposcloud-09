
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { PlanProvider } from "./contexts/PlanContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy loading das páginas
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SupabaseLogin = lazy(() => import("./pages/SupabaseLogin"));
const SupabaseRegister = lazy(() => import("./pages/SupabaseRegister"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Layouts
const Layout = lazy(() => import("./components/layout/Layout"));
const SupabaseLayout = lazy(() => import("./components/layout/SupabaseLayout"));
const AssistenciaLayout = lazy(() => import("./components/layout/AssistenciaLayout"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));

// Páginas do App
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClientesList = lazy(() => import("./pages/clientes/ClientesList"));
const ClientesForm = lazy(() => import("./pages/clientes/ClientesForm"));
const OrdensList = lazy(() => import("./pages/ordens/OrdensList"));
const OrdensForm = lazy(() => import("./pages/ordens/OrdensForm"));
const OrdensView = lazy(() => import("./pages/ordens/OrdensView"));
const ProdutosList = lazy(() => import("./pages/produtos/ProdutosList"));
const ProdutosForm = lazy(() => import("./pages/produtos/ProdutosForm"));
const FinanceiroList = lazy(() => import("./pages/financeiro/FinanceiroList"));
const FinanceiroForm = lazy(() => import("./pages/financeiro/FinanceiroForm"));
const FinanceiroView = lazy(() => import("./pages/financeiro/FinanceiroView"));
const RelatoriosPage = lazy(() => import("./pages/relatorios/RelatoriosPage"));
const PlanoAssinatura = lazy(() => import("./pages/assinatura/PlanoAssinatura"));
const PlanosPage = lazy(() => import("./pages/planos/PlanosPage"));

// Configurações
const ConfiguracoesList = lazy(() => import("./pages/configuracoes/ConfiguracoesList"));
const ConfiguracoesSistema = lazy(() => import("./pages/configuracoes/ConfiguracoesSistema"));
const ConfiguracoesAssistencia = lazy(() => import("./pages/configuracoes/ConfiguracoesAssistencia"));
const PerfilEmpresa = lazy(() => import("./pages/configuracoes/PerfilEmpresa"));

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AssistenciasList = lazy(() => import("./pages/admin/AssistenciasList"));
const PlanosList = lazy(() => import("./pages/admin/PlanosList"));
const PagamentosList = lazy(() => import("./pages/admin/PagamentosList"));
const AdminRelatoriosPage = lazy(() => import("./pages/admin/AdminRelatoriosPage"));
const ConfigAdmin = lazy(() => import("./pages/admin/ConfigAdmin"));

// Outras páginas
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const ShareOrder = lazy(() => import("./pages/ShareOrder"));
const CompletarCadastro = lazy(() => import("./pages/assinante/CompletarCadastro"));

// Páginas extras
const SobreNosPage = lazy(() => import("./pages/landing_extra/SobreNosPage"));
const ContatoPage = lazy(() => import("./pages/landing_extra/ContatoPage"));
const CentroAjudaPage = lazy(() => import("./pages/landing_extra/CentroAjudaPage"));
const PoliticaPrivacidadePage = lazy(() => import("./pages/landing_extra/PoliticaPrivacidadePage"));
const TermosServicoPage = lazy(() => import("./pages/landing_extra/TermosServicoPage"));
const DocumentacaoTecnicaPage = lazy(() => import("./pages/landing_extra/DocumentacaoTecnicaPage"));
const IntegracoesPage = lazy(() => import("./pages/landing_extra/IntegracoesPage"));

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
                <SupabaseAuthProvider>
                  <PlanProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <Suspense 
                        fallback={
                          <div className="h-screen w-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                          </div>
                        }
                      >
                        <Routes>
                          {/* Páginas públicas */}
                          <Route path="/" element={<Landing />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          
                          {/* Páginas Supabase */}
                          <Route path="/supabase-login" element={<SupabaseLogin />} />
                          <Route path="/supabase-register" element={<SupabaseRegister />} />
                          
                          {/* Aplicação com autenticação local */}
                          <Route path="/app" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="clientes" element={<ClientesList />} />
                            <Route path="clientes/novo" element={<ClientesForm />} />
                            <Route path="clientes/editar/:id" element={<ClientesForm />} />
                            <Route path="ordens" element={<OrdensList />} />
                            <Route path="ordens/nova" element={<OrdensForm />} />
                            <Route path="ordens/editar/:id" element={<OrdensForm />} />
                            <Route path="ordens/:id" element={<OrdensView />} />
                            <Route path="produtos" element={<ProdutosList />} />
                            <Route path="produtos/novo" element={<ProdutosForm />} />
                            <Route path="produtos/editar/:id" element={<ProdutosForm />} />
                            <Route path="financeiro" element={<FinanceiroList />} />
                            <Route path="financeiro/novo" element={<FinanceiroForm />} />
                            <Route path="financeiro/editar/:id" element={<FinanceiroForm />} />
                            <Route path="financeiro/:id" element={<FinanceiroView />} />
                            <Route path="relatorios" element={<RelatoriosPage />} />
                            <Route path="assinatura" element={<PlanoAssinatura />} />
                            <Route path="planos" element={<PlanosPage />} />
                            <Route path="configuracoes" element={<ConfiguracoesList />} />
                            <Route path="configuracoes/sistema" element={<ConfiguracoesSistema />} />
                            <Route path="configuracoes/assistencia" element={<ConfiguracoesAssistencia />} />
                            <Route path="configuracoes/perfil" element={<PerfilEmpresa />} />
                          </Route>

                          {/* Aplicação com autenticação Supabase */}
                          <Route path="/supabase" element={<SupabaseLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="clientes" element={<ClientesList />} />
                            <Route path="clientes/novo" element={<ClientesForm />} />
                            <Route path="clientes/editar/:id" element={<ClientesForm />} />
                            <Route path="ordens" element={<OrdensList />} />
                            <Route path="ordens/nova" element={<OrdensForm />} />
                            <Route path="ordens/editar/:id" element={<OrdensForm />} />
                            <Route path="ordens/:id" element={<OrdensView />} />
                            <Route path="produtos" element={<ProdutosList />} />
                            <Route path="produtos/novo" element={<ProdutosForm />} />
                            <Route path="produtos/editar/:id" element={<ProdutosForm />} />
                            <Route path="financeiro" element={<FinanceiroList />} />
                            <Route path="financeiro/novo" element={<FinanceiroForm />} />
                            <Route path="financeiro/editar/:id" element={<FinanceiroForm />} />
                            <Route path="financeiro/:id" element={<FinanceiroView />} />
                            <Route path="relatorios" element={<RelatoriosPage />} />
                            <Route path="assinatura" element={<PlanoAssinatura />} />
                            <Route path="planos" element={<PlanosPage />} />
                            <Route path="configuracoes" element={<ConfiguracoesList />} />
                            <Route path="configuracoes/sistema" element={<ConfiguracoesSistema />} />
                            <Route path="configuracoes/assistencia" element={<ConfiguracoesAssistencia />} />
                            <Route path="configuracoes/perfil" element={<PerfilEmpresa />} />
                          </Route>

                          {/* Admin */}
                          <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="assistencias" element={<AssistenciasList />} />
                            <Route path="planos" element={<PlanosList />} />
                            <Route path="pagamentos" element={<PagamentosList />} />
                            <Route path="relatorios" element={<AdminRelatoriosPage />} />
                            <Route path="configuracoes" element={<ConfigAdmin />} />
                          </Route>

                          {/* Outras rotas */}
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/success" element={<SuccessPage />} />
                          <Route path="/completar-cadastro" element={<CompletarCadastro />} />
                          <Route path="/ordem/:id/compartilhar" element={<ShareOrder />} />

                          {/* Páginas extras */}
                          <Route path="/sobre-nos" element={<SobreNosPage />} />
                          <Route path="/contato" element={<ContatoPage />} />
                          <Route path="/centro-ajuda" element={<CentroAjudaPage />} />
                          <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
                          <Route path="/termos-servico" element={<TermosServicoPage />} />
                          <Route path="/documentacao" element={<DocumentacaoTecnicaPage />} />
                          <Route path="/integracoes" element={<IntegracoesPage />} />

                          {/* 404 */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                      <Toaster />
                    </div>
                  </PlanProvider>
                </SupabaseAuthProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
