import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"

// Auth Context
import { AuthProvider } from './contexts/AuthContext';

// Public Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// App Layout
import Layout from './components/layout/Layout';

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
import ConfiguracoesList from "./pages/configuracoes/ConfiguracoesList";
import PerfilEmpresa from "./pages/configuracoes/PerfilEmpresa";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* App Routes (require authentication) */}
              <Route path="/app" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="clientes" element={<ClientesList />} />
                <Route path="clientes/novo" element={<ClientesForm />} />
                <Route path="clientes/:id" element={<ClientesForm />} />
                
                <Route path="produtos" element={<ProdutosList />} />
                <Route path="produtos/novo" element={<ProdutosForm />} />
                <Route path="produtos/:id" element={<ProdutosForm />} />
                
                <Route path="ordens" element={<OrdensList />} />
                <Route path="ordens/nova" element={<OrdensForm />} />
                <Route path="ordens/:id" element={<OrdensForm />} />
                <Route path="ordens/:id/visualizar" element={<OrdensView />} />
                
                <Route path="financeiro" element={<FinanceiroList />} />
                
                <Route path="configuracoes" element={<ConfiguracoesList />} />
                <Route path="configuracoes/perfil" element={<PerfilEmpresa />} />
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
