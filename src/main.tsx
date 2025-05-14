import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { Toaster } from "sonner";
import ConfiguracoesList from "./pages/configuracoes/ConfiguracoesList";
import PerfilEmpresa from "./pages/configuracoes/PerfilEmpresa";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <Toaster richColors position="top-right" />
    <App />
  </AuthProvider>
);
