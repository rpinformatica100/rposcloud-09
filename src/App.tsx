
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import AdminLayout from "@/components/layout/AdminLayout"

// Pages
import Index from "@/pages/Index"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import NotFound from "@/pages/NotFound"
import CheckoutPage from "@/pages/CheckoutPage"
import SuccessPage from "@/pages/SuccessPage"

// Client pages
import ClientesList from "@/pages/clientes/ClientesList"
import ClientesForm from "@/pages/clientes/ClientesForm"

// Orders pages
import OrdensList from "@/pages/ordens/OrdensList"
import OrdensForm from "@/pages/ordens/OrdensForm"
import OrdensView from "@/pages/ordens/OrdensView"

// Products pages
import ProdutosList from "@/pages/produtos/ProdutosList"
import ProdutosForm from "@/pages/produtos/ProdutosForm"

// Financial pages
import FinanceiroList from "@/pages/financeiro/FinanceiroList"
import FinanceiroForm from "@/pages/financeiro/FinanceiroForm"

// Reports pages
import RelatoriosPage from "@/pages/relatorios/RelatoriosPage"

// Settings pages
import ConfiguracoesList from "@/pages/configuracoes/ConfiguracoesList"
import ConfiguracoesAssistencia from "@/pages/configuracoes/ConfiguracoesAssistencia"
import PerfilEmpresa from "@/pages/configuracoes/PerfilEmpresa"
import ConfiguracoesSistema from "@/pages/configuracoes/ConfiguracoesSistema"

// Plans pages
import PlanosPage from "@/pages/planos/PlanosPage"

// Subscription pages
import PlanoAssinatura from "@/pages/assinatura/PlanoAssinatura"

// Landing extra pages
import SobreNosPage from "@/pages/landing_extra/SobreNosPage"
import ContatoPage from "@/pages/landing_extra/ContatoPage"
import TermosServicoPage from "@/pages/landing_extra/TermosServicoPage"
import PoliticaPrivacidadePage from "@/pages/landing_extra/PoliticaPrivacidadePage"
import CentroAjudaPage from "@/pages/landing_extra/CentroAjudaPage"
import DocumentacaoTecnicaPage from "@/pages/landing_extra/DocumentacaoTecnicaPage"
import IntegracoesPage from "@/pages/landing_extra/IntegracoesPage"

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AssistenciasList from "@/pages/admin/AssistenciasList"
import PlanosList from "@/pages/admin/PlanosList"
import PagamentosList from "@/pages/admin/PagamentosList"
import AdminRelatoriosPage from "@/pages/admin/AdminRelatoriosPage"
import ConfigAdmin from "@/pages/admin/ConfigAdmin"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                
                {/* Landing extra pages */}
                <Route path="/sobre-nos" element={<SobreNosPage />} />
                <Route path="/contato" element={<ContatoPage />} />
                <Route path="/termos-servico" element={<TermosServicoPage />} />
                <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
                <Route path="/centro-ajuda" element={<CentroAjudaPage />} />
                <Route path="/documentacao-tecnica" element={<DocumentacaoTecnicaPage />} />
                <Route path="/integracoes" element={<IntegracoesPage />} />

                {/* Protected app routes */}
                <Route path="/app" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  
                  {/* Clients */}
                  <Route path="clientes" element={<ClientesList />} />
                  <Route path="clientes/novo" element={<ClientesForm />} />
                  <Route path="clientes/:id/editar" element={<ClientesForm />} />
                  
                  {/* Orders */}
                  <Route path="ordens" element={<OrdensList />} />
                  <Route path="ordens/nova" element={<OrdensForm />} />
                  <Route path="ordens/:id/editar" element={<OrdensForm />} />
                  <Route path="ordens/:id" element={<OrdensView />} />
                  
                  {/* Products */}
                  <Route path="produtos" element={<ProdutosList />} />
                  <Route path="produtos/novo" element={<ProdutosForm />} />
                  <Route path="produtos/:id/editar" element={<ProdutosForm />} />
                  
                  {/* Financial */}
                  <Route path="financeiro" element={<FinanceiroList />} />
                  <Route path="financeiro/novo" element={<FinanceiroForm />} />
                  <Route path="financeiro/:id/editar" element={<FinanceiroForm />} />
                  
                  {/* Reports */}
                  <Route path="relatorios" element={<RelatoriosPage />} />
                  
                  {/* Settings */}
                  <Route path="configuracoes" element={<ConfiguracoesList />} />
                  <Route path="configuracoes/assistencia" element={<ConfiguracoesAssistencia />} />
                  <Route path="configuracoes/perfil" element={<PerfilEmpresa />} />
                  <Route path="configuracoes/sistema" element={<ConfiguracoesSistema />} />
                  
                  {/* Plans */}
                  <Route path="planos" element={<PlanosPage />} />
                  <Route path="assinatura" element={<PlanoAssinatura />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="assistencias" element={<AssistenciasList />} />
                  <Route path="planos" element={<PlanosList />} />
                  <Route path="pagamentos" element={<PagamentosList />} />
                  <Route path="relatorios" element={<AdminRelatoriosPage />} />
                  <Route path="configuracoes" element={<ConfigAdmin />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
