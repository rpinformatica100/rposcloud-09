
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster 
      richColors 
      position="top-right" 
      expand={true}
      duration={4000}
      closeButton={true}
    />
  </>
);
