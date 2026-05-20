import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Navbar() {
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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <p className="text-xs text-slate-400">Club actual</p>
        <h2 className="font-bold text-slate-900">
          {clubNombre || "Sin club"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-slate-800">
            {nombre || "Usuario"}
          </p>
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