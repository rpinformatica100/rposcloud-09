
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/layout/Layout";

// Módulos
import ClientesList from "./pages/clientes/ClientesList";
import ClientesForm from "./pages/clientes/ClientesForm";
import ProdutosList from "./pages/produtos/ProdutosList";
import ProdutosForm from "./pages/produtos/ProdutosForm";
import OrdensList from "./pages/ordens/OrdensList";
import OrdensForm from "./pages/ordens/OrdensForm";
import FinanceiroList from "./pages/financeiro/FinanceiroList";
import ConfiguracoesList from "./pages/configuracoes/ConfiguracoesList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          
          {/* Rotas protegidas com layout compartilhado */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            <Route path="clientes">
              <Route index element={<ClientesList />} />
              <Route path="novo" element={<ClientesForm />} />
              <Route path="editar/:id" element={<ClientesForm />} />
            </Route>
            
            <Route path="produtos">
              <Route index element={<ProdutosList />} />
              <Route path="novo" element={<ProdutosForm />} />
              <Route path="editar/:id" element={<ProdutosForm />} />
            </Route>
            
            <Route path="ordens">
              <Route index element={<OrdensList />} />
              <Route path="nova" element={<OrdensForm />} />
              <Route path="editar/:id" element={<OrdensForm />} />
            </Route>
            
            <Route path="financeiro">
              <Route index element={<FinanceiroList />} />
            </Route>
            
            <Route path="configuracoes">
              <Route index element={<ConfiguracoesList />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
