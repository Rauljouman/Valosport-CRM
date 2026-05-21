import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FolderPlus , Menu } from "lucide-react";

function Navbar({ onMenuClick, onCrearGrupo }) {
  const navigate = useNavigate();

  const nombre = useAuthStore((state) => state.nombre);
  const rol = useAuthStore((state) => state.rol);
  const clubNombre = useAuthStore((state) => state.clubNombre);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg border border-slate-300 px-3 py-2 text-slate-700 font-bold"
        >
          ☰
        </button>

        <div>
          <p className="text-xs text-slate-400">Club actual</p>
          <h2 className="font-bold text-slate-900 text-sm sm:text-base">
            {clubNombre || "Sin club"}
          </h2>
        </div>
      </div>

      <button
        type="button"
        onClick={onCrearGrupo}
        title="Crear grupo"
        className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#4ED4D4] hover:text-[#0F766E] hover:bg-slate-50"
      >
        <FolderPlus  className="h-5 w-5" />

        <span className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block">
          Crear grupo
        </span>
      </button>

      <div className="flex items-center">
        <div className="hidden sm:block text-right">
          <p className="font-semibold text-slate-800">{nombre || "Usuario"}</p>
          <p className="text-xs text-slate-500">{rol}</p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
        >
          Salir
        </button>
      </div>
    </header>
  );
}

export default Navbar;