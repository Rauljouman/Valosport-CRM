import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CrearJugadorModal from "../components/jugadores/CrearJugadorModal";
import CrearGrupoModal from "../components/grupos/CrearGrupoModal";
import { useAuthStore } from "../store/authStore";

function MainLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [crearGrupoOpen, setCrearGrupoOpen] = useState(false);
  const [crearJugadorOpen, setCrearJugadorOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%]">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onCrearGrupo={() => setCrearGrupoOpen(true)}
          onCrearJugador={() => setCrearJugadorOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <CrearGrupoModal
        open={crearGrupoOpen}
        onClose={() => setCrearGrupoOpen(false)}
        onGrupoCreado={() => window.location.reload()}
      />

      <CrearJugadorModal
        open={crearJugadorOpen}
        onClose={() => setCrearJugadorOpen(false)}
        onJugadorCreado={() => window.location.reload()}
      />
    </div>
  );
}

export default MainLayout;