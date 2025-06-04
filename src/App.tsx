
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Layout components
import MobileAwareLayout from "@/components/layout/MobileAwareLayout";
import SupabaseLayout from "@/components/layout/SupabaseLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SupabaseLogin from "@/pages/SupabaseLogin";
import SupabaseRegister from "@/pages/SupabaseRegister";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import CheckoutPage from "@/pages/CheckoutPage";
import SuccessPage from "@/pages/SuccessPage";
import ShareOrder from "@/pages/ShareOrder";

// App Pages
import OrdensList from "@/pages/ordens/OrdensList";
import OrdensForm from "@/pages/ordens/OrdensForm";
import OrdensView from "@/pages/ordens/OrdensView";
import ClientesList from "@/pages/clientes/ClientesList";
import ClientesForm from "@/pages/clientes/ClientesForm";
import ProdutosList from "@/pages/produtos/ProdutosList";
import ProdutosForm from "@/pages/produtos/ProdutosForm";
import FinanceiroList from "@/pages/financeiro/FinanceiroList";
import FinanceiroForm from "@/pages/financeiro/FinanceiroForm";
import FinanceiroView from "@/pages/financeiro/FinanceiroView";
import RelatoriosPage from "@/pages/relatorios/RelatoriosPage";
import ConfiguracoesList from "@/pages/configuracoes/ConfiguracoesList";
import ConfiguracoesAssistencia from "@/pages/configuracoes/ConfiguracoesAssistencia";
import ConfiguracoesSistema from "@/pages/configuracoes/ConfiguracoesSistema";
import PerfilEmpresa from "@/pages/configuracoes/PerfilEmpresa";
import PlanosPage from "@/pages/planos/PlanosPage";
import PlanoAssinatura from "@/pages/assinatura/PlanoAssinatura";
import CompletarCadastro from "@/pages/assinante/CompletarCadastro";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AssistenciasList from "@/pages/admin/AssistenciasList";
import PagamentosList from "@/pages/admin/PagamentosList";
import PlanosList from "@/pages/admin/PlanosList";
import ConfigAdmin from "@/pages/admin/ConfigAdmin";
import AdminRelatoriosPage from "@/pages/admin/AdminRelatoriosPage";

// Landing Extra Pages
import SobreNosPage from "@/pages/landing_extra/SobreNosPage";
import ContatoPage from "@/pages/landing_extra/ContatoPage";
import CentroAjudaPage from "@/pages/landing_extra/CentroAjudaPage";
import DocumentacaoTecnicaPage from "@/pages/landing_extra/DocumentacaoTecnicaPage";
import IntegracoesPage from "@/pages/landing_extra/IntegracoesPage";
import PoliticaPrivacidadePage from "@/pages/landing_extra/PoliticaPrivacidadePage";
import TermosServicoPage from "@/pages/landing_extra/TermosServicoPage";

// React Query Client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="rp-os-theme">
        <SupabaseAuthProvider>
          <AuthProvider>
            <PlanProvider>
              <Router>
                <Routes>
                  {/* Landing Pages */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/supabase-login" element={<SupabaseLogin />} />
                  <Route path="/supabase-register" element={<SupabaseRegister />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/success" element={<SuccessPage />} />
                  <Route path="/ordem/:id/share" element={<ShareOrder />} />
                  
                  {/* Landing Extra Pages */}
                  <Route path="/sobre-nos" element={<SobreNosPage />} />
                  <Route path="/contato" element={<ContatoPage />} />
                  <Route path="/ajuda" element={<CentroAjudaPage />} />
                  <Route path="/documentacao" element={<DocumentacaoTecnicaPage />} />
                  <Route path="/integracoes" element={<IntegracoesPage />} />
                  <Route path="/privacidade" element={<PoliticaPrivacidadePage />} />
                  <Route path="/termos" element={<TermosServicoPage />} />
                  
                  {/* App Pages (with MobileAwareLayout) */}
                  <Route path="/app" element={<MobileAwareLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="ordens">
                      <Route index element={<OrdensList />} />
                      <Route path="new" element={<OrdensForm />} />
                      <Route path=":id" element={<OrdensView />} />
                      <Route path=":id/edit" element={<OrdensForm />} />
                    </Route>
                    <Route path="clientes">
                      <Route index element={<ClientesList />} />
                      <Route path="new" element={<ClientesForm />} />
                      <Route path=":id/edit" element={<ClientesForm />} />
                    </Route>
                    <Route path="produtos">
                      <Route index element={<ProdutosList />} />
                      <Route path="new" element={<ProdutosForm />} />
                      <Route path=":id/edit" element={<ProdutosForm />} />
                    </Route>
                    <Route path="financeiro">
                      <Route index element={<FinanceiroList />} />
                      <Route path="new" element={<FinanceiroForm />} />
                      <Route path=":id" element={<FinanceiroView />} />
                      <Route path=":id/edit" element={<FinanceiroForm />} />
                    </Route>
                    <Route path="relatorios" element={<RelatoriosPage />} />
                    <Route path="configuracoes">
                      <Route index element={<ConfiguracoesList />} />
                      <Route path="assistencia" element={<ConfiguracoesAssistencia />} />
                      <Route path="sistema" element={<ConfiguracoesSistema />} />
                      <Route path="perfil" element={<PerfilEmpresa />} />
                    </Route>
                    <Route path="planos" element={<PlanosPage />} />
                    <Route path="assinatura" element={<PlanoAssinatura />} />
                    <Route path="completar-cadastro" element={<CompletarCadastro />} />
                  </Route>
                  
                  {/* Supabase App Pages */}
                  <Route path="/supabase-app" element={<SupabaseLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="ordens">
                      <Route index element={<OrdensList />} />
                      <Route path="new" element={<OrdensForm />} />
                      <Route path=":id" element={<OrdensView />} />
                      <Route path=":id/edit" element={<OrdensForm />} />
                    </Route>
                    <Route path="clientes">
                      <Route index element={<ClientesList />} />
                      <Route path="new" element={<ClientesForm />} />
                      <Route path=":id/edit" element={<ClientesForm />} />
                    </Route>
                    <Route path="produtos">
                      <Route index element={<ProdutosList />} />
                      <Route path="new" element={<ProdutosForm />} />
                      <Route path=":id/edit" element={<ProdutosForm />} />
                    </Route>
                    <Route path="financeiro">
                      <Route index element={<FinanceiroList />} />
                      <Route path="new" element={<FinanceiroForm />} />
                      <Route path=":id" element={<FinanceiroView />} />
                      <Route path=":id/edit" element={<FinanceiroForm />} />
                    </Route>
                    <Route path="relatorios" element={<RelatoriosPage />} />
                    <Route path="configuracoes">
                      <Route index element={<ConfiguracoesList />} />
                      <Route path="assistencia" element={<ConfiguracoesAssistencia />} />
                      <Route path="sistema" element={<ConfiguracoesSistema />} />
                      <Route path="perfil" element={<PerfilEmpresa />} />
                    </Route>
                    <Route path="planos" element={<PlanosPage />} />
                    <Route path="assinatura" element={<PlanoAssinatura />} />
                    <Route path="completar-cadastro" element={<CompletarCadastro />} />
                  </Route>
                  
                  {/* Admin Panel */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="assistencias" element={<AssistenciasList />} />
                    <Route path="pagamentos" element={<PagamentosList />} />
                    <Route path="planos" element={<PlanosList />} />
                    <Route path="config" element={<ConfigAdmin />} />
                    <Route path="relatorios" element={<AdminRelatoriosPage />} />
                  </Route>
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </Router>
            </PlanProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
