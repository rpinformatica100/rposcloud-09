
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <FileQuestion className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="text-xl text-gray-600">Página não encontrada</p>
              <p className="text-gray-500">
                Desculpe, a página que você está procurando não existe ou foi movida.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/app">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Início
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
