import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["ADMIN", "TESORERO", "COORDINADOR"],
  },
  {
    label: "Jugadores",
    path: "/jugadores",
    roles: ["ADMIN", "TESORERO", "COORDINADOR"],
  },
  {
    label: "Grupos",
    path: "/grupos",
    roles: ["ADMIN", "TESORERO", "COORDINADOR"],
  },
  {
    label: "Transacciones",
    path: "/transacciones",
    roles: ["ADMIN", "TESORERO","COORDINADOR"],
  },
];

function Sidebar() {
  const rol = useAuthStore((state) => state.rol);

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen p-5">
      <div className="mb-8">
        <h1 className="text-xl font-black">Club Manager</h1>
        <p className="text-xs text-slate-400">Tesorería deportiva</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const hasAccess = item.roles.includes(rol);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800",
                ].join(" ")
              }
            >
              <span>{item.label}</span>
              {!hasAccess && <span className="text-xs">🔒</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;