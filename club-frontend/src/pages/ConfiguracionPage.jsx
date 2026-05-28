import { useState } from "react";
import {
  Users,
  Building2,
  Info,
} from "lucide-react";
import EditarClubModal from "../components/configuracion/EditarClubModal";
import UsuariosPanel from "../components/configuracion/UsuariosPanel";
import InfoSistemaPanel from "../components/configuracion/InfoSistemaPanel";

function ConfiguracionPage() {
  const [editarClubOpen, setEditarClubOpen] = useState(false);

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-black text-slate-900">
          Configuración
        </h1>
      </section>

      <UsuariosPanel />

      <InfoSistemaPanel />

      <EditarClubModal
        open={editarClubOpen}
        onClose={() => setEditarClubOpen(false)}
        onClubActualizado={() => window.location.reload()}
      />
    </div>
  );
}

function ConfigCard({ icon, title, text, button, onClick }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4ED4D4]/15 text-[#0F766E]">
        {icon}
      </div>

      <h2 className="text-lg font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 min-h-[60px] text-sm text-slate-500">
        {text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
      >
        {button}
      </button>
    </article>
  );
}

export default ConfiguracionPage;