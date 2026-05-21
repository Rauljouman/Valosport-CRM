import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Layers,
  ReceiptText,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Jugadores",
    path: "/jugadores",
    icon: Users,
  },
  {
    label: "Grupos",
    path: "/grupos",
    icon: Layers,
  },
  {
    label: "Transacciones",
    path: "/transacciones",
    icon: ReceiptText,
  },
];

function Sidebar({ onNavigate }) {
  return (
    <aside className="w-64 bg-white text-slate-900 min-h-screen px-5 pt-2 pb-5 border-r border-slate-200">
      <div className="mb-6 flex flex-col items-center">
        <img
          src="/ValosportSidebar.png"
          alt="ValosportSidebar"
          className="w-[250px] max-w-none object-contain -mt-2 -mb-2"
        />

        <div className="h-1 w-16 rounded-full bg-[#4ED4D4]" />
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              title={item.label}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition",
                  isActive
                    ? "bg-[#E6FAFA] text-[#0F766E]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>

              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;