
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarInset } from "@/components/ui/sidebar";
import MobileMenu from "./MobileMenu";

const MobileAwareLayout = () => {
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <SidebarInset className="flex-1">
          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between h-14 px-4 border-b bg-white sticky top-0 z-40">
            <div className="flex items-center">
              <div className="bg-primary text-white rounded-md w-6 h-6 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">RP OS Cloud</h1>
            </div>
            <MobileMenu />
          </div>
          
          {/* Page Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MobileAwareLayout;
