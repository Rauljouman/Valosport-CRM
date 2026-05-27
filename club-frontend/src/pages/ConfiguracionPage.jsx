import {
  Users,
  Building2,
  Info,
  ShieldCheck,
} from "lucide-react";

function ConfiguracionPage() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-black text-slate-900">
          Configuración
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ConfigCard
          icon={<Users className="h-5 w-5" />}
          title="Usuarios y roles"
          text="Gestiona los usuarios que pueden acceder al sistema y controla sus permisos."
          button="Gestionar usuarios"
        />

        <ConfigCard
          icon={<Building2 className="h-5 w-5" />}
          title="Datos del club"
          text="Edita la información principal del club como nombre, correo o ciudad."
          button="Editar club"
        />

        <ConfigCard
          icon={<Info className="h-5 w-5" />}
          title="Información del sistema"
          text="Consulta información general sobre la aplicación y el estado actual del sistema."
          button="Ver información"
        />
      </section>
    </div>
  );
}

function ConfigCard({ icon, title, text, button }) {
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

      <button className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
        {button}
      </button>
    </article>
  );
}

export default ConfiguracionPage;